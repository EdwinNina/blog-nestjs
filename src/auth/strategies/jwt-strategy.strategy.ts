import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      configService: ConfigService,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: configService.get('JWT_SECRET'),
      });
   }

   async validate(payload: JwtPayload) {
      const { id } = payload

      const user = await this.userRepository.findOneBy({ id })

      if(!user) throw new UnauthorizedException("Token is not valid")

      if(!user.isActive) throw new UnauthorizedException("User is not active")

      return user
   }
}
