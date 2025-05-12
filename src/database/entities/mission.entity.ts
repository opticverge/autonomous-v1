import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { ObjectId } from 'mongodb';

import { MissionStatus } from '@autonomous/database/entities';

@Entity('missions')
export class Mission {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  vehicleId: string;

  @Column({
    type: 'enum',
    enum: MissionStatus,
    default: MissionStatus.PENDING,
  })
  status: MissionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
