import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { Client } from "./Client"
import { OrderDetails } from "./OrderDetails"

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  clientId!: number

  @ManyToOne(() => Client, client => client.orders)
  client!: Client

  @OneToMany(() => OrderDetails, orderDetails => orderDetails.order)
  orderDetails: OrderDetails[]

  @Field()
  @CreateDateColumn()
  createdAt: Date
}
