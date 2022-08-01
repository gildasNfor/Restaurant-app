import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { MyContext } from "src/types"
import { AppDataSource } from "src/data-source"
import { Dish } from "src/entities/Dish"

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class Response {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Dish, { nullable: true })
  dish?: Dish

  @Field(() => String, { nullable: true })
  cookie?: string

  // @Field(() => String, { nullable: true })
  // refreshToken?: string
}

@Resolver()
export class DishResolver {
  @Query(() => [Dish])
  async dishes(@Ctx() {}: MyContext) {
    const dishes = await Dish.find({})
    return dishes
  }

  @Mutation(() => Response)
  async createDish(
    @Arg("name", () => String) name: string,
    @Arg("image", () => String) image: Buffer,
    @Arg("price", () => Number) price: number,
    @Arg("bowlsAvailable", () => Number) bowlsAvailable: number,
    @Arg("categoryId", () => Number) categoryId: number,
    @Ctx() { req, res }: MyContext
  ): Promise<Response> {
    const dishRepository = AppDataSource.getRepository(Dish)

    const dish = await dishRepository.findOneBy({
      name: name,
    })
    if (dish) {
      return {
        errors: [
          {
            field: "name",
            message:
              "A Dish with this name already exist. Use a different name",
          },
        ],
      }
    }

    const newDish = new Dish()
    newDish.name = name
    newDish.bowlsAvailable = bowlsAvailable
    newDish.categotyId = categoryId
    newDish.image = image
    newDish.price = price
    dishRepository.save(newDish)

    return { dish: newDish }
  }

  @Mutation(() => Response)
  async updateDish(
    @Arg("id", () => String) id: number,
    @Arg("name", () => String) name: string,
    @Arg("image", () => String) image: Buffer,
    @Arg("price", () => Number) price: number,
    @Arg("bowlsAvailable", () => Number) bowlsAvailable: number,
    @Arg("categoryId", () => Number) categoryId: number,
    @Ctx() { req, res }: MyContext
  ): Promise<Response> {
    const dishRepository = AppDataSource.getRepository(Dish)

    const dish = await dishRepository.findOneBy({
      id: id,
    })
    if (!dish) {
      return {
        errors: [
          {
            field: "Does not exist",
            message: "This Dish does not exist",
          },
        ],
      }
    }

    dishRepository.save({
      id: dish.id,
      name: name ? name : dish.name,
      price: price ? price : dish.price,
      bowlsAvailable: bowlsAvailable ? bowlsAvailable : dish.bowlsAvailable,
      image: image ? image : dish.image,
      categoryId: categoryId ? categoryId : dish.categotyId,
    })

    return { dish }
  }
}
