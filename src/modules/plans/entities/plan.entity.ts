import { Subscription } from 'src/modules/subscription/entities/subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
