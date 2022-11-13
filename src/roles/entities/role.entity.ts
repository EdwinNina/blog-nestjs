import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 50, nullable: false, unique: true})
   name: string;

   @Column('varchar', { length: 150, nullable: true })
   description: string;

   @Column('boolean', { default: true })
   status: boolean;

   @OneToMany(
      () => User,
      ( user ) => user.role
   )
   user: User;

   @BeforeInsert()
   checkInputInsert(){
      this.name = this.name.toLowerCase()
      this.description = this.description?.toLowerCase()
   }

   @BeforeUpdate()
   checkInputUpdate(){
      this.checkInputInsert()
   }
}
