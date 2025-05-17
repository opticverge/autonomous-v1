import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

@Entity('vehicle_missions')
export class VehicleMissionEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  vehicleMissionId: string;

  @Column()
  @Index()
  vehicleId: string;

  @Column()
  @Index()
  missionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateEntityId() {
    this.vehicleMissionId = uuidv4();
  }
}
