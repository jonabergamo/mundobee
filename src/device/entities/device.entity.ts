import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Configuration } from "./configuration.entity";

@Entity()
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isOn: boolean;

  @Column({ default: 0 })
  inCount: number;

  @Column({ default: 0 })
  outCount: number;

  @ManyToOne(() => Configuration)
  @JoinColumn({ name: "configurationId" })
  configuration: Configuration;
}

