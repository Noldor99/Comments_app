import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('power')
export class Power {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  power: string;

  @ManyToOne(() => User, (user) => user.powers)
  user: User;
}
