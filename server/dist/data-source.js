"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
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
});
//# sourceMappingURL=data-source.js.map