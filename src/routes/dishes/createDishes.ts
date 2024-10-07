import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

const CreateUserSchema = z.object({
  title: z.string().min(6),
  description: z.string(),
  category: z.string().min(6),
  price: z.string(),
  image: z.string(),
});

export const CreateDishesRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/dishes",{preValidation: [app.authenticate]}, async (request, reply) => {
      const { title, description, category, price, image } = CreateUserSchema.parse(request.body);

      const Dishes = await prisma.dishes.create({
        data: {
          title,
          description,
          category,
          price,
          image
        },
      });
      return reply.status(201).send({Dishes});
    });
};
