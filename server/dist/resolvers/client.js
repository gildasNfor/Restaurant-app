"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientResolver = void 0;
const Client_1 = require("../entities/Client");
const bcrypt = __importStar(require("bcrypt"));
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("../data-source");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Client_1.Client, { nullable: true }),
    __metadata("design:type", Client_1.Client)
], UserResponse.prototype, "client", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserResponse.prototype, "cookie", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let ClientResolver = class ClientResolver {
    clients({}) {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield Client_1.Client.find({});
            return clients;
        });
    }
    register(username, email, password, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientRepository = data_source_1.AppDataSource.getRepository(Client_1.Client);
            const existingClientName = yield clientRepository.findOneBy({
                name: username,
            });
            if (existingClientName) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "A user with this username already exist. Use a different username",
                        },
                    ],
                };
            }
            const existingClientEmail = yield clientRepository.findOneBy({
                email: email,
            });
            if (existingClientEmail) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "A user with this email already exist. Use a different email",
                        },
                    ],
                };
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const client = new Client_1.Client();
            client.name = username;
            client.email = email;
            client.password = hashedPassword;
            client.isAdmin = false;
            clientRepository.save(client);
            return { client };
        });
    }
    login(username, email, password, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientRepository = data_source_1.AppDataSource.getRepository(Client_1.Client);
            const existingUser = yield clientRepository.findOneBy({
                name: username,
            });
            if (!existingUser) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username is not correct",
                        },
                    ],
                };
            }
            const result = yield bcrypt.compare(password, existingUser.password);
            if (!result) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Incorrect Password",
                        },
                    ],
                };
            }
            req.session.userId = existingUser.id;
            console.log(req);
            return {
                client: existingUser,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Client_1.Client]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientResolver.prototype, "clients", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("username", () => String)),
    __param(1, (0, type_graphql_1.Arg)("email", () => String)),
    __param(2, (0, type_graphql_1.Arg)("password", () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ClientResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("username", () => String)),
    __param(1, (0, type_graphql_1.Arg)("email", () => String)),
    __param(2, (0, type_graphql_1.Arg)("password", () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ClientResolver.prototype, "login", null);
ClientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ClientResolver);
exports.ClientResolver = ClientResolver;
//# sourceMappingURL=client.js.map