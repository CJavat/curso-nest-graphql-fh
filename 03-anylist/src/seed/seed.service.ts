import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>,
    
    @InjectRepository( User )
    private readonly usersRepository: Repository<User>,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }


  async executeSeed() {
    if( this.isProd ) throw new UnauthorizedException('We cannot run SEED on PROD');
    
    // Limpiar la base de datos | BORRARO TODO
    await this.deleteDatabase();

    // Crear usuarios

    // Crear items

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
}
