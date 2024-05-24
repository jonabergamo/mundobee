import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";
import { Configuration } from "src/device/entities/configuration.entity";
import { Device } from "src/device/entities/device.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mariadb",
  host: "mariadb",
  port: 3306,
  username: "prisma",
  password: "prisma",
  database: "mqtt",
  entities: [Device, Configuration, User],
  synchronize: true,
  bigNumberStrings: true,
  multipleStatements: true,
  logging: true,
  migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
  migrationsRun: true,
};

