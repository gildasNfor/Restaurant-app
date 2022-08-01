import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import cors from "cors"
import express from "express"
import { buildSchema } from "type-graphql"
import session from "express-session"
import connectRedis from "connect-redis"
import { ClientResolver } from "./resolvers/client"
import { AppDataSource } from "./data-source"
import { MyContext } from "./types"
import Redis from "ioredis"

declare module "express-session" {
  export interface SessionData {
    userId: number
  }
}

const main = async () => {
  await AppDataSource.initialize()
  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis(6379)
  app.set("trust proxy", 1)

  app.use(
    session({
      name: "cid",
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "safhsfkaskjbsdkjadsd",
      resave: false,
    })
  )

  app.use(
    cors({ origin: "https://studio.apollographql.com", credentials: true })
  )
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [ClientResolver],
    }),
    debug: true,
    context: ({ req, res }): MyContext => ({ req, res }),
  })
  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })
}

main().catch(err => {
  console.error(err)
})
