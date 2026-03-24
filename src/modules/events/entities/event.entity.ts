import { Category } from 'src/modules/categories/entities/category.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  short_description: string;

  @Column()
  long_description: string;

  @Column({ type: 'boolean' })
  is_published: boolean;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => Organization, (org) => org.events)
  organization: Organization;

  @Column()
  organizationId: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  capacity: number;

  @Column()
  map_location: string;

  @Column()
  col_count: number;

  @Column()
  rows_count: number;

  @Column()
  start_at: Date;

  @Column()
  end_at: Date;

  @Column()
  isCanceled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
