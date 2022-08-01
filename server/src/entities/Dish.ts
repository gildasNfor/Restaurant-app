import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { OrderDetails } from "./OrderDetails"
import { DishCategory } from "./DishCategoty"

@ObjectType()
@Entity()
export class Dish extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  name!: string

  @Field()
  @Column({
    type: "bytea",
  })
  image: Buffer

  @Field()
  @Column()
  price!: number

  @Field()
  @Column()
  bowlsAvailable!: number

  @Field()
  @Column()
  categotyId!: number

  @ManyToOne(() => OrderDetails, orderDetails => orderDetails.dish)
  orderDetails!: OrderDetails

  @ManyToOne(() => DishCategory, dishCategory => dishCategory.dishes)
  category!: DishCategory
}
