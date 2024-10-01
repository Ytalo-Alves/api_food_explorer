import Fastify from "fastify";
import { CreateUserRoutes } from "./routes/Users/create_user";

const app = Fastify()
const PORT = 3333;

app.register(CreateUserRoutes)

app.listen({port: PORT}).then( ()=> {
  console.log('Server is running')
})