import { Post } from "src/post/entities/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";

@Entity('categories')
export class Category {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 100, unique: true })
   title: string;

   @Column('varchar', { length: 100, unique: true })
   slug: string;

   @Column('boolean', { default: true })
   status: boolean;

   @OneToMany(
      () => Post,
      (post) => post.category 
   )
   posts: Post[];

   @BeforeInsert()
   transformInputsInsert(){
      this.title = this.title.trim().toLowerCase();
      this.slug = this.title.toLowerCase().replaceAll(' ', '-');
   }

   @BeforeUpdate()
   transformInputsUpdate(){
      this.transformInputsInsert()
   }
}
