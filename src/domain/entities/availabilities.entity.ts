import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity()
export class CatAvailability {
	@PrimaryGeneratedColumn()
	id_availability: number;

	@Column({
		length: 80,
	})
	description: string;
}

@EntityRepository(CatAvailability)
export class CatAvailabilityService extends Repository<CatAvailability> {}
