import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superuser = 'superuser'
}

registerEnumType( ValidRoles, { name: 'ValidRoles' } );