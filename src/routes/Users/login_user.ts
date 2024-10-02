import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { compare } from "bcryptjs";
import { hash } from 'bcryptjs'

const LoginUserSchema = z.object({
  email: z.string().min(6),
  password: z.string().min(6)
})

const UpdateUserSchema = z.object({
  name: z.string().min(6, "O nome deve conter pelo menos 6 caracteres."),
  email: z.string().email(),
  password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres."),
  old_password: z
    .string()
    .min(6, "A senha deve conter pelo menos 6 caracteres."),
});

const ParamsUserId = z.object({
  id: z.string().uuid(),
});

export const LoginUserRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/login", async (request, reply) => {
      const { email, password } = LoginUserSchema.parse(request.body)

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({ message: "E-mail ou senha incorretos" });
      }

      const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        return reply.status(401).send({ message: "E-mail ou senha incorretos" });
      }
      
      const token = app.jwt.sign({ id: user.id }, { expiresIn: '1d' });

      // Removendo a senha ao retornar o usuário
      const { password: _, ...userWithoutPassword } = user;

      return reply.status(200).send({ user: userWithoutPassword, token });
    
})

app
    .withTypeProvider<ZodTypeProvider>()
    .put("/users/:id", async (request, reply) => {
      const { name, email, password, old_password } = UpdateUserSchema.parse(
        request.body
      );
      const { id } = ParamsUserId.parse(request.params);

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found." });
      }

      if (password && old_password) {
        const passwordMatch = await compare(old_password, user.password);

        if (!passwordMatch) {
          return reply
            .status(400)
            .send({ error: "The old password is incorrect" });
        }
      }

      const hashedPassword = await hash(password, 10);
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      const updateUser = await prisma.user.update({
        where: { id },
        data: {
          name: name ?? user.name,
          email: email ?? user.email,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return reply.status(200).send({user: userWithoutPassword});
    });
}
