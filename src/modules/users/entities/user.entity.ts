import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../enums/UserType.enum';
import { Exclude } from 'class-transformer';
import { Organization } from 'src/modules/organization/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @OneToMany(() => Organization, (org) => org.user, { nullable: true })
  organizations: Organization[];

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
