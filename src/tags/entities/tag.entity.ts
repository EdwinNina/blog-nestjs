import { Post } from "src/post/entities/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToMany } from "typeorm";

@Entity('tags')
export class Tag {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 100, unique: true })
   title: string;

   @Column('varchar', { length: 100, unique: true })
   slug: string;

   @Column('boolean', { default: true })
   status: boolean;

   @ManyToMany(
      () => Post,
      (post) => post.tags
   )
   posts: Post[]

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
