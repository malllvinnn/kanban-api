import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 72, nullable: true })
  passwordHash: string;

  @Column({ type: 'bigint', nullable: true })
  createAt: number;

  @Column({ type: 'bigint', nullable: true })
  updateAt: number;

  @Column({ type: 'boolean', nullable: true })
  isDeleted: boolean;
}
