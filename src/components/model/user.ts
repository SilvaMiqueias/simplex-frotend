export class UserDetail{
  id?: number;
  username?: string;
  password?: string;
  name?: string;
  role?: RoleName;
  image?: string;
}

export enum RoleName {
  ROLE_USER = "ROLE_ADMINISTRATOR",
  ROLE_ADMIN = "ROLE_CUSTOMER",
}