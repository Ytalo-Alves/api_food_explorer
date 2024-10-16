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

const paramsDishesID = z.object({
  id: z.string().uuid(),
});

export const UpdatedDishesRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .put(
      "/dishes/:id",
      { preValidation: [app.authenticate] },
      async (request, reply) => {
        const { title, description, category, price, image } =
          CreateUserSchema.parse(request.body);
        const { id } = paramsDishesID.parse(request.params);

        const dishes = await prisma.dishes.findUnique({
          where: { id },
        });

        if (!dishes) {
          return reply.status(404).send({ error: "Dishes is not found" });
        }

        const updatedDishes = await prisma.dishes.update({
          where: { id },
          data: {
            title: title ?? dishes?.title,
            description: description ?? dishes?.description,
            category: category ?? dishes?.category,
            price: price ?? dishes?.price,
            image: image ?? dishes?.image,
          },
        });

        return reply.status(201).send({ updatedDishes });
      }
    );
};
