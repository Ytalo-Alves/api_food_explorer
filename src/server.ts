import Fastify from "fastify";
import jwt from '@fastify/jwt';

import { CreateUserRoutes } from "./routes/Users/create_user";
import { LoginUserRoutes } from "./routes/Users/login_user";


const app = Fastify()
const PORT = 3333;

app.register(jwt, {
  secret: 'supersecret', // Substitua com uma variável de ambiente
});

app.register(CreateUserRoutes)
app.register(LoginUserRoutes)

app.listen({port: PORT}).then( ()=> {
  console.log('Server is running')
})