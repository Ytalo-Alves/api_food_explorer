import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { hash, compare } from "bcryptjs";

const CreateUserSchema = z.object({
  name: z.string().min(6, "O nome deve conter pelo menos 6 caracteres."),
  email: z.string().email(),
  password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres."),
});

export const CreateUserRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/users", async (request, reply) => {
      const { name, email, password } = CreateUserSchema.parse(request.body);

      const checkEmailUser = await prisma.user.findUnique({ where: { email } });

      if (checkEmailUser) {
        return reply.status(409).send({ error: "Email is already in use" });
      }

      const hashPassword = await hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });
      return reply.status(201).send({ name, email, password });
    });
};
