import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatEducationLevel {
	@PrimaryGeneratedColumn()
	id_education_level: number;

	@Column({
		length: 150,
	})
	description: string;
}
