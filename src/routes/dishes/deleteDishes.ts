import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

const paramsDishesID = z.object({
  id: z.string().uuid(),
});

export const DeleteDishesRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      "/dishes/:id",
      { preValidation: [app.authenticate] },
      async (request, reply) => {
        
        const { id } = paramsDishesID.parse(request.params);

        await prisma.dishes.delete({
          where: { id },
        });

        return reply.status(200).send();
      }
    );
};
