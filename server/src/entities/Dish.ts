import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { OrderDetails } from "./OrderDetails"

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

  @Column()
  password!: string

  @Field()
  @Column()
  price!: string

  @Field()
  @Column()
  bowlsAvailable!: number

  @ManyToOne(() => OrderDetails, orderDetails => orderDetails.dish)
  orderDetails!: OrderDetails
}
