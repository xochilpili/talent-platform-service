import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueIndexCategorySkills1637788149326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX category_skills_description_unique on cat_category_skills (LOWER(description)); `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX category_skills_description_unique; `);
    }

}
