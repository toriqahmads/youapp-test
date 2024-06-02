export interface IJWTPayload {
  id: string;
  email: string;
  username: string;
}

export interface IJWTDecoded extends IJWTPayload {
  iat: number;
  exp: number;
}
