import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne } from "typeorm";
import { User } from "src/auth/enitities/user.entity";
import { Preset } from "src/presets/entities/preset.entity";

@Entity()
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Preset)
  @JoinColumn({ name: "presetId" })
  preset: Preset;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column({ nullable: true })
  ownerId: number;

  @ManyToMany(() => User)
  @JoinTable()
  viewers: User[];
}
