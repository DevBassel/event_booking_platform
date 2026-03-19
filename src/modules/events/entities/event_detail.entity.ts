import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EventDetail {
  @PrimaryGeneratedColumn('uuid')
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
  seats_count: number;

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
