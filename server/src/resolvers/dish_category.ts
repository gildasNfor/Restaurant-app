import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { DishCategory } from "src/entities/DishCategoty"
import { MyContext } from "src/types"
import { AppDataSource } from "src/data-source"

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

  @Field(() => DishCategory, { nullable: true })
  category?: DishCategory

  @Field(() => String, { nullable: true })
  cookie?: string

  // @Field(() => String, { nullable: true })
  // refreshToken?: string
}

@Resolver()
export class DishCategoryResolver {
  @Query(() => [DishCategory])
  async dishCategories(@Ctx() {}: MyContext) {
    const categories = await DishCategory.find({})
    return categories
  }

  @Mutation(() => Response)
  async createCategory(
    @Arg("name", () => String) name: string,
    @Ctx() { req, res }: MyContext
  ): Promise<Response> {
    const categoryRepository = AppDataSource.getRepository(DishCategory)

    const existingCategory = await categoryRepository.findOneBy({
      name: name,
    })
    if (existingCategory) {
      return {
        errors: [
          {
            field: "name",
            message:
              "A Category with this name already exist. Use a different name",
          },
        ],
      }
    }

    const category = new DishCategory()
    category.name = name
    categoryRepository.save(category)

    return { category }
  }
}
