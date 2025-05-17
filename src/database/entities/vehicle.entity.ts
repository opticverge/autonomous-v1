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
export class VehicleEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  vehicleId: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateEntityId() {
    this.vehicleId = this.vehicleId ?? uuidv4();
  }
}
