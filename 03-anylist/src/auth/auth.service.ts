import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
  ) {}


  async signup( signupInput:SignupInput ): Promise<AuthResponse> {

    const user = await this.usersService.create( signupInput );
    
    //TODO: Crear JWT
    const token = 'abc';

    return {
      user,
      token,
    }
  }

  async login ( {email, password}: LoginInput ): Promise<AuthResponse> {

    const user = await this.usersService.findOneByEmail( email );

    const token = 'asdasd';

    return {
      token,
      user,
    }
  }



}
