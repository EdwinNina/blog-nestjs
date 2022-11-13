import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User{

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 100 })
   username: string;

   @Column('varchar', { unique: true, length: 60 })
   email: string;

   @Column('varchar', {length: 70 })
   password: string;

   @Column('boolean', { default: true })
   isActive: boolean;

   @OneToMany(
      () => Post,
      (post) => post.user
   )
   post: Post;

   @ManyToOne(
      () => Role,
      ( role ) => role.user,
      { eager: true }
   )
   role: Role;

   @BeforeInsert()
   checkInputsInsert(){
      this.username = this.username.trim().toLowerCase()
      this.email = this.email.trim().toLowerCase()
   }

   @BeforeUpdate()
   checkInputsUpdate(){
      this.checkInputsInsert()
   }
}