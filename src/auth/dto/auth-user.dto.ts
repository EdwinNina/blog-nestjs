import { OmitType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Role } from '../../roles/entities/role.entity';


export class RegisterDto{
   @IsNotEmpty()
   @IsString()
   username: string;

   @IsNotEmpty()
   @IsEmail()
   email: string;

   @IsNotEmpty()
   @IsString()
   password: string;

   @IsOptional()
   @IsUUID()
   role?: Role;
}

export class LoginDto extends OmitType(RegisterDto, ['username']) {}