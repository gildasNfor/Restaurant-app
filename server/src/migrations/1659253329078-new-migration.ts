import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1659253329078 implements MigrationInterface {
    name = 'newMigration1659253329078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dish_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_3b79a00aa3e497329b185ed9b9f" UNIQUE ("name"), CONSTRAINT "PK_99a7f8da03e95489210ec2c8ed8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dish" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_f101936095917dde2a9f0609516" FOREIGN KEY ("categoryId") REFERENCES "dish_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_f101936095917dde2a9f0609516"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP COLUMN "categoryId"`);
        await queryRunner.query(`DROP TABLE "dish_category"`);
    }

}
