import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueIndexEducationLevel1637697783613 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX education_level_description_unique on cat_education_level (LOWER(description)); `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX education_level_description_unique; `);
    }

}
