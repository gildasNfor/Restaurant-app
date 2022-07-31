import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1658978283808 implements MigrationInterface {
    name = 'newMigration1658978283808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dish" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "image" bytea NOT NULL, "password" character varying NOT NULL, "price" character varying NOT NULL, "bowlsAvailable" integer NOT NULL, "orderDetailsOrderId" integer, "orderDetailsDishId" integer, CONSTRAINT "UQ_07626606a3b574903a702fd6ae6" UNIQUE ("name"), CONSTRAINT "PK_59ac7b35af39b231276bfc4c00c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_details" ("orderId" integer NOT NULL, "dishId" integer NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93f791ca0fdf890d349f4eba1d7" PRIMARY KEY ("orderId", "dishId"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "clientId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_480f88a019346eae487a0cd7f0c" UNIQUE ("name"), CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_b9b1d717d5e144691f187f189c8" FOREIGN KEY ("orderDetailsOrderId", "orderDetailsDishId") REFERENCES "order_details"("orderId","dishId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_147bc15de4304f89a93c7eee969" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_6267f6e35a542d37a6e9745b7c3" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_6267f6e35a542d37a6e9745b7c3"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_147bc15de4304f89a93c7eee969"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_b9b1d717d5e144691f187f189c8"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_details"`);
        await queryRunner.query(`DROP TABLE "dish"`);
    }

}
