import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { MissionStatus } from './mission-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity('vehicle_mission_status')
export class VehicleMissionStatusEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  vehicleMissionStatusId: string;

  @Column()
  @Index()
  vehicleMissionId: string;

  @Column({
    type: 'enum',
    enum: MissionStatus,
    default: MissionStatus.PENDING,
  })
  status: MissionStatus;

  @CreateDateColumn()
  timestamp: Date;

  @BeforeInsert()
  generateEntityId() {
    this.vehicleMissionStatusId = uuidv4();
  }
}
