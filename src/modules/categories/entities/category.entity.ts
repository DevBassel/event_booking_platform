import { Event } from 'src/modules/events/entities/event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ type: 'simple-array', nullable: true })
  sub_categories: string[];

  @ManyToMany(() => Event, (event) => event.categories)
  events: Event[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
