import {PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query']
})

// Middleware de autenticação para garantir que o created_at não seja alterado após uma atualização de dados do usuário.
prisma.$use(async (params, next) => {
  if(params.action === 'update' || params.action === 'updateMany'){
    params.args.data['updated_at'] = new Date()
  }

  return next(params)
})
