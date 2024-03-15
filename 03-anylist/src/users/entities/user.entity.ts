import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  fullName: string;

  @Column({ unique: true })
  @Field( () => String )
  email: string;

  @Column()
  // @Field( () => String )
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field( () => [String] )
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field( () => Boolean )
  isActive: boolean;

  //? RELACIONES
  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true } ) //*Lazy es para mostrar los datos de la relación al igual que eager.
  @JoinColumn({ name: 'lastUpadteBy' })
  @Field( () => User, { nullable: true } )
  lastUpdateBy?: User;

  @OneToMany( () => Item, (item) => item.user, { lazy: true } )
  // @Field( () => [Item] )
  items: Item[];

  @OneToMany( () => List, (list) => list.user )
  lists: List[];

}
