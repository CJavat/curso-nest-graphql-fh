import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  async signup( signupInput:SignupInput ): Promise<AuthResponse> {

    const user = await this.usersService.create( signupInput );
    const token = this.getJwtToken( user.id );

    return { user, token }
  }

  async login ( {email, password}: LoginInput ): Promise<AuthResponse> {

    const user = await this.usersService.findOneByEmail( email );

    if( !bcrypt.compareSync( password, user.password ) ) throw new BadRequestException('Email/Password do not match');
    
    const token = this.getJwtToken( user.id );

    return { token, user }
  }

  async validateUser( id: string ): Promise<User> {

    const user = await this.usersService.findOneById( id );
    if( !user.isActive ) throw new UnauthorizedException(`User is inactive, talk with an admin`);
    
    delete user.password;
    return user;
  }

  revalidateToken( user: User ): AuthResponse {
    const token = this.getJwtToken( user.id );
    return { token, user };
  }

  private getJwtToken( userId: string ) {
    return this.jwtService.sign({ id: userId });
  }

}
