import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

// Schema de validação para criação de pratos
const CreateUserSchema = z.object({
  title: z.string().min(6),
  description: z.string(),
  category: z.string().min(6),
  price: z.string(),
  image: z.string(),
  ingredients: z.array(z.object({
    name: z.string()
  }))
});

export const CreateDishesRoutes: FastifyPluginAsync = async (app) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/dishes",
      {
        preValidation: [app.authenticate],
        schema: {
          summary: "Create a new dish",
          description: "This route creates a new dish along with its ingredients",
          tags: ["Dishes"],
          body: CreateUserSchema, // Swagger body validation via Zod schema
          response: {
            201: z.object({
              message: z.string(),
              dish: z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                category: z.string(),
                price: z.string(),
                image: z.string().optional(),
                ingredients: z.array(z.object({
                  name: z.string()
                }))
              })
            }),
            500: z.object({
              error: z.string()
            })
          }
        }
      }, 
      async (request, reply) => {
        const { title, description, category, price, image, ingredients } = CreateUserSchema.parse(request.body);

        try {
          const result = await prisma.$transaction(async (prisma) => {
            // Cria o prato
            const dish = await prisma.dishes.create({
              data: {
                title,
                description,
                category,
                price,
                image: image || ''
              },

              include: {
                ingredients: true
              }
            });

            // Cria os ingredientes relacionados ao prato
            if (ingredients && ingredients.length > 0) {
              await prisma.ingredients.createMany({
                data: ingredients.map((ingredient) => ({
                  name: ingredient.name,
                  dishesId: dish.id
                }))
              });
            }

            return dish;
          });

          return reply.status(201).send({ message: 'Prato criado com sucesso', dish: result });

        } catch (error) {
          console.error(error);
          return reply.status(500).send({ error: "Erro ao criar o prato e os ingredientes." });
        }
      }
    );
};
