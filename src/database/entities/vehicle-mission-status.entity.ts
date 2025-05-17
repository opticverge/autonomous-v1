import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { MissionStatus } from './mission-status.enum';

@Entity('vehicle_mission_status')
export class VehicleMissionStatusEntity {
  @ObjectIdColumn()
  _id: ObjectId;

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
}
