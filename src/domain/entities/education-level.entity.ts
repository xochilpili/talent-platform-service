import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class CatEducationLevel {
	@PrimaryGeneratedColumn()
	id_education_level: number;

	@Column({
		length: 150,
	})
	description: string;
}
