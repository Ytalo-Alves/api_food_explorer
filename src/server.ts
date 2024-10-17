import Fastify from "fastify";
import jwt from '@fastify/jwt';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyMultipart from 'fastify-multipart';  // Importa o plugin
import { CreateUserRoutes } from "./routes/create_user";
import { LoginUserRoutes } from "./routes/login_user";
import { CreateDishesRoutes } from "./routes/create_dish";
import { UpdatedDishesRoutes } from "./routes/updated_dish";
import { DeleteDishesRoutes } from "./routes/delete_dish";
import { CreateOrdersItensRoutes} from "./routes/create_order";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { UpdatedPaymentMethodRoutes } from "./routes/updated_order";


const app = Fastify()
const PORT = 3333;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);



app.register(fastifyMultipart)

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

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'food-explorer-api',
      description: 'API developed for a restaurant application',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.register(CreateUserRoutes)
app.register(LoginUserRoutes)
app.register(CreateDishesRoutes)
app.register(UpdatedDishesRoutes)
app.register(DeleteDishesRoutes)
app.register(CreateOrdersItensRoutes)
app.register(UpdatedPaymentMethodRoutes)


app.listen({port: PORT}).then( ()=> {
  console.log('Server is running on port ' + PORT)
})