import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm"
import { Field, ObjectType } from "type-graphql"
import { Dish } from "./Dish"

@ObjectType()
@Entity()
export class DishCategory extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  name!: string

  @OneToMany(() => Dish, dish => dish.category)
  dishes: Dish[]
}
