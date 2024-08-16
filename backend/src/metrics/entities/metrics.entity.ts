import moment from "moment-timezone";
import { Device } from "src/device/entities/device.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Metrics {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  inCount: number;

  @Column()
  outCount: number;

  @Column("float", { nullable: true })
  temperature: number;

  @Column("float", { nullable: true })
  humidity: number;

  @Column("float", { nullable: true })
  outsideTemp: number;

  @Column("float", { nullable: true })
  outsideHumidity: number;

  @Column("float", { nullable: true })
  externalTemp: number;

  @Column("float", { nullable: true })
  externalHumidity: number;

  @Column("timestamp", { name: "date", default: (): string => "LOCALTIMESTAMP" })
  timestamp: Date;

  @ManyToOne(() => Device)
  @JoinColumn()
  device: Device;

  @Column({ nullable: true })
  deviceId: string;
}
