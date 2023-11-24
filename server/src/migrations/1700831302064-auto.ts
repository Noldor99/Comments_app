import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1700831302064 implements MigrationInterface {
    name = 'Auto1700831302064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "postCpmments" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "likes" integer NOT NULL, "image" character varying, "text" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "parentId" integer, CONSTRAINT "PK_0811a40d54e9c13dffac77ec50f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "postCpmments" ADD CONSTRAINT "FK_385e11b6e566df4edefdf495a08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postCpmments" ADD CONSTRAINT "FK_f49a74a0f945a0dd685ad43393f" FOREIGN KEY ("parentId") REFERENCES "postCpmments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "postCpmments" DROP CONSTRAINT "FK_f49a74a0f945a0dd685ad43393f"`);
        await queryRunner.query(`ALTER TABLE "postCpmments" DROP CONSTRAINT "FK_385e11b6e566df4edefdf495a08"`);
        await queryRunner.query(`DROP TABLE "postCpmments"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
