import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

const CreateUserSchema = z.object({
  name: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateUserRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users', async (request, reply) => {
      // Validar o corpo da requisição com o Zod
      const { name, email, password } = CreateUserSchema.parse(request.body);
      
      // Criar usuário no banco de dados usando Prisma
      await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      // Retornar status 201 e os dados do usuário criado
      return reply.status(201).send({ name, email, password });
    }
  );
};
