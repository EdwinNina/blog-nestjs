import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto/auth-user.dto';
import { User } from './entities/user.entity';
import { handleErrorDbLog } from '../common/helpers/error-db-log.helper';
import * as bcrypt from 'bcrypt'
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {

   constructor(
      @InjectRepository(User)
      private authRepository: Repository<User>,
      private jwtService: JwtService,
      private roleService: RolesService
   ) {}

   private generateJwt(payload: JwtPayload){
      return this.jwtService.sign(payload)
   }

   async register(registerDto: RegisterDto){
      try {
         const { password, ...body } = registerDto

         const defaultRole = await this.roleService.getDefaultRole();

         const user = this.authRepository.create({
            ...body,
            role: defaultRole,
            password: bcrypt.hashSync(password, 10)
         })

         await this.authRepository.save(user)

         delete user.password

         const {id, role, ...restUser} = user;

         return {
            user: {
               ...restUser,
               role: role.name
            },
            jwt: this.generateJwt({ id })
         }
      } catch (error) {
         handleErrorDbLog(error)
      }
   }

   async login(loginDto: LoginDto){
      try {
         const { email, password } = loginDto

         const user = await this.authRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true, username: true }
         })

         if(!user) throw new UnauthorizedException(`User not found with email ${email}`)

         if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException("The password is not correct");

         delete user.password;

         const {id, role, ...restUser} = user;

         return {
            user: {
               ...restUser,
               role: role.name
            },
            jwt: this.generateJwt({ id })
         }
      } catch (error) {
         handleErrorDbLog(error)
      }
   }
}
