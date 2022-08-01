import { AppDataSource } from "src/data-source"
import { Order } from "src/entities/Order"
import { MyContext } from "src/types"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"

@Resolver()
export class OrderResolver {
  @Query(() => [Order])
  async orders(@Ctx() {}: MyContext) {
    const orders = await Order.find({})
    return orders
  }

  @Query(() => [Order])
  async ordersByClient(
    @Arg("clientId", () => Number) clientId: number,
    @Ctx() {}: MyContext
  ) {
    const orders = await Order.findOneBy({
      clientId,
    })
    return orders
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg("clientId", () => Number) clientId: number,
    @Ctx() {}: MyContext
  ): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order)
    const order = new Order()
    order.clientId = clientId
    orderRepository.save(order)
    return order
  }
}
