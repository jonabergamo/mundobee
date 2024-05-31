import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";
import { Configuration } from "src/device/entities/configuration.entity";
import { Device } from "src/device/entities/device.entity";
import { Metrics } from "src/metrics/entities/metrics.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mariadb",
  host: "host.docker.internal",
  port: 3306,
  username: "prisma",
  password: "prisma",
  database: "mqtt",
  entities: [Device, Configuration, User, Metrics],
  synchronize: true,
  bigNumberStrings: true,
  multipleStatements: true,
  migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
  migrationsRun: true,
};
