import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  humidity: number;

  @Column()
  temperature: number;
}

