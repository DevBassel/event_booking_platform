import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  countOfEvents: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  yearlyPrice: number;

  @Column('text')
  description: string;

  @Column('simple-array')
  features: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
