import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatCategorySkills {
    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({
        length: 80,
    })
    description: string;
}