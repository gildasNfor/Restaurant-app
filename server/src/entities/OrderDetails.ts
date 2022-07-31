import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { Dish } from "./Dish"
import { Order } from "./Order"

@ObjectType()
@Entity()
export class OrderDetails extends BaseEntity {
  @Field()
  @PrimaryColumn()
  orderId!: number

  @ManyToOne(() => Order, order => order.orderDetails)
  order!: Order

  @Field()
  @PrimaryColumn()
  dishId!: number

  @ManyToOne(() => Dish, dish => dish.orderDetails)
  dish!: Dish

  @Field()
  @Column()
  quantity!: number

  @Field()
  @Column()
  price!: number

  @Field()
  @CreateDateColumn()
  createdAt: Date
}
