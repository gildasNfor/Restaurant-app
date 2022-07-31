import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "resto",
  synchronize: false,
  logging: true,
  entities: ["dist/entities/**.js"],
  migrations: ["dist/migrations/*.js"],
  subscribers: ["src/subscriber/*.ts"],
})

// npx typeorm-ts-node-esm migration:generate ./src/migrations/new-migration -d ./src/data-source

// npx typeorm-ts-node-esm migration:run -d ./src/data-source.ts
