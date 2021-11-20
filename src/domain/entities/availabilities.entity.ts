import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity()
export class CatAvailability {
	// Notice:
	/*
		Estamos usando sequences en postgresql,
		si por alguna razón añadimos un registro a mano en la base de datos
		TypeORM no registra ese cambio, entonces regresa un `violation index`
		STR ejemplo: 
		#pgsql> insert into cat_availabilities(description)values('hello world');
		y después hacemos un POST
		Stupid package:
		https://github.com/typeorm/typeorm/issues/2654

	*/
	@PrimaryGeneratedColumn()
	id_availability: number;

	@Column({
		length: 80,
	})
	description: string;
}

/* @EntityRepository(CatAvailability)
export class CatAvailabilityService extends Repository<CatAvailability> {} */
