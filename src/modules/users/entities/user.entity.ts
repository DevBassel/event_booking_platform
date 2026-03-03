import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enums/UserType.enum';
import { Exclude } from 'class-transformer';

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

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  type: UserType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// export class UserSerializer {
//   constructor(user: User) {
//     this.id = user.id;
//     this.name = user.name;
//     this.email = user.email;
//     this.type = user.type;
//     this.createdAt = user.createdAt;
//     this.updatedAt = user.updatedAt;
//   }

//   id: string;
//   name: string;
//   email: string;
//   type: UserType;
//   createdAt: Date;
//   updatedAt: Date;
// }
