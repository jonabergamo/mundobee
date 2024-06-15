import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";
import { Device } from "src/device/entities/device.entity";
import { Metrics } from "src/metrics/entities/metrics.entity";
import "dotenv/config"; // <- this line is the important
import { Preset } from "src/presets/entities/preset.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Device, Preset, User, Metrics],
  synchronize: true,
  bigNumberStrings: true,
  multipleStatements: true,
  migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
  migrationsRun: true,
};

