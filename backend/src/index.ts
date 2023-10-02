import express, { Request, Response, NextFunction} from 'express'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from '@apollo/server';
import { ExpressContextFunctionArgument, expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
import {schema} from './graphql/schema';
import {resolvers} from './graphql/resolvers'

const { json } = pkg;

const prisma = new PrismaClient({log: ['error', 'info', 'query', 'warn']})

const app = express()

app.use(morgan("dev"))
app.use(express.json())

app.get("/", async (request: Request, response: Response ) => {
    const submissions = await prisma.submission.findMany()
    response.json(submissions)
})

interface MyContext {
    token?: String;
}

async function startServer(){
    const httpServer = http.createServer(app);
    const server = new ApolloServer<MyContext>({
      typeDefs: schema,
      resolvers: resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(server, {
        context: async ({ req } : ExpressContextFunctionArgument) => ({ token: req.headers.token }),
      }),
    );

    const port = Number(process.env.PORT ?? 8080)
    await new Promise<void>((resolve:(value:void | PromiseLike<void>) => void) => httpServer.listen({ host: '0.0.0.0', port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

startServer()



// app.listen(port,'0.0.0.0', () => {
//     console.log(`Server is working on ${port}`)
// })




