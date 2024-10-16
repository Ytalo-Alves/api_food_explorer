import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

interface AuthenticatedUser {
  id: string;
}

// Schema para criação de OrderItems
const CreateOrderItensSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  dishesId: z.string(), // O ID do prato é necessário para vincular ao item
});

export const CreateOrdersItensRoutes: FastifyPluginAsync = async (app) => {
  app.post("/ordersItens", { preValidation: [app.authenticate] }, async (request, reply) => {
    const { title, quantity, dishesId } = CreateOrderItensSchema.parse(request.body);

    const user =  request.user as AuthenticatedUser
    const userId = user.id;
  
    // Verifica se o usuário existe na tabela "users"
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!userExists) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
  
    // Verifica se existe um pedido "OPEN" para este usuário
    let activeOrder = await prisma.orders.findFirst({
      where: { userId, orderStatus: 'OPEN' },
    });
  
    // Se não houver um pedido aberto, cria um novo pedido
    if (!activeOrder) {
      activeOrder = await prisma.orders.create({
        data: {
          userId: userId, // Certifique-se de que o userId está correto
          orderStatus: 'OPEN',
          totalPrice: '0', // Inicialmente 0, será atualizado após adicionar os itens
          paymentMethod: '', // Pode ser definido posteriormente
        },
      });
    }
  
    // Buscar o prato pelo dishesId
    const dish = await prisma.dishes.findUnique({
      where: { id: dishesId },
    });
  
    if (!dish) {
      return reply.status(404).send({ error: 'Prato não encontrado' });
    }
  
    // Converte o preço de string para número (float)
    const priceAsNumber = parseFloat(dish.price);
  
    if (isNaN(priceAsNumber)) {
      return reply.status(400).send({ error: 'Preço inválido para o prato' });
    }
  
    // Adicionar o novo OrderItem ao pedido ativo
    const newOrderItem = await prisma.ordersItems.create({
      data: {
        title,
        quantity,
        ordersId: activeOrder.id, // Vincula o item ao pedido
        dishesId,
      },
    });
  
    // Calcula o novo total do pedido
    const newTotalPrice =
      parseFloat(activeOrder.totalPrice) + priceAsNumber * quantity;
  
    // Atualiza o totalPrice do pedido
    await prisma.orders.update({
      where: { id: activeOrder.id },
      data: { totalPrice: newTotalPrice.toFixed(2) }, // Arredonda para 2 casas decimais
    });
  
    return reply.status(201).send({ newOrderItem, totalPrice: newTotalPrice.toFixed(2) });
  });

  
};
