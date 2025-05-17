import { BeforeInsert, Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { Location } from '@autonomous/database/entities';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

@Entity('telemetry')
export class TelemetryEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  telemetryId: string;

  @Column()
  @Index()
  vehicleId: string;

  @Column()
  timestamp: Date;

  @Column()
  location: Location;

  @Column({ nullable: true })
  status: string;

  @BeforeInsert()
  generateEntityId() {
    this.telemetryId = uuidv4();
  }
}
