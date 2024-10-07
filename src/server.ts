import Fastify from "fastify";
import jwt from '@fastify/jwt';

import { CreateUserRoutes } from "./routes/users/createUser";
import { LoginUserRoutes } from "./routes/users/loginUser";
import { CreateDishesRoutes } from "./routes/dishes/createDishes";
import { UpdatedDishesRoutes } from "./routes/dishes/updateDishes";
import { DeleteDishesRoutes } from "./routes/dishes/deleteDishes";


const app = Fastify()
const PORT = 3333;

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

app.listen({port: PORT}).then( ()=> {
  console.log('Server is running')
})