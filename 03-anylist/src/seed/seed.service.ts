import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,
    
    @InjectRepository( User )
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }


  async executeSeed() {
    if( this.isProd ) throw new UnauthorizedException('We cannot run SEED on PROD');
    
    // Limpiar la base de datos | BORRARO TODO
    await this.deleteDatabase();

    // Crear usuarios
    const user = await this.loadUsers();

    // Crear items
    await this.loadItems( user );

    return true;
  }

  async deleteDatabase() {
    // Borrar items
    await this.itemsRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar usuarios
    await this.usersRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for ( const user of SEED_USERS ) {
      users.push( await this.usersService.create( user ) );
    }

    return users[0];
  }

  async loadItems( user: User ): Promise<void> {
    const items = [];

    for ( const item of SEED_ITEMS ) {
      items.push( await this.itemsService.create( item, user ) );
    }
  }
}
