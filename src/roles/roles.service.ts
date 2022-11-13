import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { handleErrorDbLog } from 'src/common/helpers/error-db-log.helper';
import { isUUID } from 'class-validator';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async getDefaultRole(defaultRole = 'USER'){
    const query_builder = this.roleRepository.createQueryBuilder('roles')

    const role = await query_builder
      .where('roles.name = :name', {
        name: defaultRole.toLowerCase()
      }).getOne()

      if(!role) throw new NotFoundException('Role not found with name ' + defaultRole)

    return role;
  }

  async getActiveRoles(){
    const roles = await this.roleRepository.find({
      where: { status: true},
      select: { name: true }
    })
    return roles.map( role => role.name)
  }

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.roleRepository.create(createRoleDto)
      return await this.roleRepository.save(role)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll() {
    return await this.getActiveRoles();
    // const roles = await this.roleRepository.find();
    // return {
    //   data: roles
    // }
  }

  async findOne(query: string) {
    let role: Role;

    if(isUUID(query)){
      role = await this.roleRepository.findOneBy({ id: query })
    }else{
      role = await this.roleRepository.findOneBy({ name: query })
    }

    if(!role) throw new NotFoundException('Role not found with term ' + query)

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.preload({ id, ...updateRoleDto})

      if(!role) throw new NotFoundException('Role not found id ' + id)

      return await this.roleRepository.save(role)

    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async changeStatus(id: string){
    try {
      const role = await this.findOne(id)
      role.status = !role.status
      await this.roleRepository.update(id, role)

      return {
        id: role.id,
        status: role.status
      }
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async remove(id: string) {
    try {
      const role = await this.findOne(id)
      await this.roleRepository.remove(role)

      return {
        msg: 'Role deleted successfully'
      }
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
