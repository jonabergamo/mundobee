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

  @Column({ nullable: true })
  temperature: number;

  @Column({ nullable: true })
  humidity: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Device)
  @JoinColumn()
  device: Device;

  @Column({ nullable: true })
  deviceId: string;
}

