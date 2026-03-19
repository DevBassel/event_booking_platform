import { Event } from 'src/modules/events/entities/event.entity';
import { Plan } from 'src/modules/plans/entities/plan.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  slug: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column()
  domain: string;

  @ManyToOne(() => User, (user) => user.organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Plan, { nullable: true, onDelete: 'SET NULL' })
  plan: Plan;

  @Column({ nullable: true })
  planId: string;

  @OneToMany(() => Event, (e) => e.organization)
  events: Event[];

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
