import Fastify from "fastify";
import jwt from '@fastify/jwt';

import { CreateUserRoutes } from "./routes/user/create_user";
import { LoginUserRoutes } from "./routes/user/login_user";
import { CreateDishesRoutes } from "./routes/dish/create_dish";
import { UpdatedDishesRoutes } from "./routes/dish/updated_dish";
import { DeleteDishesRoutes } from "./routes/dish/delete_dish";
import { CreateOrdersItensRoutes} from "./routes/order/create_order";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { UpdatedPaymentMethodRoutes } from "./routes/order/updated_order";


const app = Fastify()
const PORT = 3333;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(jwt, {
  secret: 'supersecret', // Substitua com uma variável de ambiente
});

app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido ou ausente.' });
  }
});

app.register(CreateUserRoutes)
app.register(LoginUserRoutes)
app.register(CreateDishesRoutes)
app.register(UpdatedDishesRoutes)
app.register(DeleteDishesRoutes)
app.register(CreateOrdersItensRoutes)
app.register(UpdatedPaymentMethodRoutes)

app.listen({port: PORT}).then( ()=> {
  console.log('Server is running')
})