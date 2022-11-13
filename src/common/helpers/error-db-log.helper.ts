import { BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';

export const handleErrorDbLog = (error: any) => {
   const logger = new Logger() 

   if(error.code === "23505") throw new BadRequestException(error.detail)

   if(error.response.statusCode === 401) throw new UnauthorizedException(error.response.message)

   logger.error(error)

}