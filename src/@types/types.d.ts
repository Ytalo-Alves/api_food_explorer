import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "fastify-multer";  // Tipagem do arquivo usado pelo fastify-multer

// Extensão do módulo Fastify
declare module "fastify" {
  interface FastifyRequest {
    file?: MultipartFile;  // Adiciona a tipagem para o arquivo
  }

  // Exemplo de adição de método customizado para FastifyInstance
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
