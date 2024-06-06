import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Preset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;
  
    @Column()
    internal_humidity: number;
  
    @Column()
    internal_temperature: number;

    @Column()
    external_humidity: number;
  
    @Column()
    external_temperature: number;

}
