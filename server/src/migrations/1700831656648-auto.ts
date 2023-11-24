import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1700831656648 implements MigrationInterface {
    name = 'Auto1700831656648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "power" ("id" SERIAL NOT NULL, "power" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_9b965296b9f26727d54a5a0620e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "power" ADD CONSTRAINT "FK_b300c8657bcaf3fd3872de20be2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "power" DROP CONSTRAINT "FK_b300c8657bcaf3fd3872de20be2"`);
        await queryRunner.query(`DROP TABLE "power"`);
    }

}
