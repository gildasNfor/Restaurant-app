import { Client } from "../entities/Client"
import * as bcrypt from "bcrypt"
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { AppDataSource } from "../data-source"
import { MyContext } from "src/types"

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Client, { nullable: true })
  client?: Client

  @Field(() => String, { nullable: true })
  cookie?: string
}

@Resolver()
export class ClientResolver {
  @Query(() => [Client])
  async clients(@Ctx() {}: MyContext) {
    const clients = await Client.find({})
    return clients
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("username", () => String) username: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req, res }: MyContext
  ): Promise<UserResponse> {
    const clientRepository = AppDataSource.getRepository(Client)

    const existingClientName = await clientRepository.findOneBy({
      name: username,
    })
    if (existingClientName) {
      return {
        errors: [
          {
            field: "username",
            message:
              "A user with this username already exist. Use a different username",
          },
        ],
      }
    }

    const existingClientEmail = await clientRepository.findOneBy({
      email: email,
    })
    if (existingClientEmail) {
      return {
        errors: [
          {
            field: "email",
            message:
              "A user with this email already exist. Use a different email",
          },
        ],
      }
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    const client = new Client()
    client.name = username
    client.email = email
    client.password = hashedPassword
    client.isAdmin = false
    clientRepository.save(client)
    return { client }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username", () => String) username: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req, res }: MyContext
  ): Promise<UserResponse> {
    const clientRepository = AppDataSource.getRepository(Client)
    const existingUser = await clientRepository.findOneBy({
      name: username,
    })
    if (!existingUser) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is not correct",
          },
        ],
      }
    }
    const result = await bcrypt.compare(password, existingUser.password)
    if (!result) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect Password",
          },
        ],
      }
    }

    req.session.userId = existingUser.id

    return {
      client: existingUser,
    }
  }
}
