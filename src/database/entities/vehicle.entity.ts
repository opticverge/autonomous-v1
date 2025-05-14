import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { ObjectId } from 'mongodb';

import { v4 as uuidv4 } from 'uuid';

@Entity('vehicles')
export class Vehicle {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  vehicleId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  generateVehicleId() {
    this.vehicleId = uuidv4();
  }
}
