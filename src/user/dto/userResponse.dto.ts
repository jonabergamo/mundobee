import { OmitType } from "@nestjs/mapped-types";
import { User } from "src/auth/enitities/user.entity";

export class UserResponseDto extends OmitType(User, ["hash"]) {}
