import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('telemetry')
export class Telemetry {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  vehicleId: string;

  @Column()
  timestamp: Date;

  @Column()
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
