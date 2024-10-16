import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

interface AuthenticatedUser {
  id: string;
}

const UpdatePaymentMethodSchema = z.object({
  paymentMethod : z.enum(['CREDIT_CARD','DEBIT_CARD', 'PIX', 'CASH'])
})

export const UpdatedPaymentMethodRoutes: FastifyPluginAsync = async (app) => {
  app.put('/orders/:ordersId/payment', { preValidation: [app.authenticate] }, async (request, reply) => {

    const {paymentMethod} = UpdatePaymentMethodSchema.parse(request.body)
    const {ordersId} = request.params as {ordersId: string}

    const user = request.user as AuthenticatedUser
    const userId = user.id

    const order = await prisma.orders.findFirst({
      where: {
        id: ordersId, userId,
        orderStatus: 'OPEN'
      }
    })

    if(!order){
      return reply.status(404).send({error: 'Pedido não encontrado ou não está aberto'})
    }

    const updatedOrder = await prisma.orders.update({
      where: {
        id: ordersId,
      },
      data: {
        paymentMethod,
      }
    })

    return reply.status(200).send({message: 'Forma de pagamento atualizada com sucesso.', updatedOrder})
  });
}