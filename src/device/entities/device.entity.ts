import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne } from "typeorm";
import { Configuration } from "./configuration.entity";
import { User } from "src/auth/enitities/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Configuration)
  @JoinColumn({ name: "configurationId" })
  configuration: Configuration;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @Column({ nullable: true })
  ownerId: number;

  @ManyToMany(() => User)
  @JoinTable()
  viewers: User[];
}
