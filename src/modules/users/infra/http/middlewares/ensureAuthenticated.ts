import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação token JWT

  interface ITokenPayLoad {
    iat: number;
    exp: number;
    sub: string;
  }

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  // const {secret, ExpiresIn} = authConfig.jwt;

  // try {
  const decoded = verify(token, authConfig.jwt.secret);

  const { sub } = decoded as ITokenPayLoad;

  request.user = {
    id: sub,
  };

  return next();
  // } catch {
  //   throw new AppError('Invalid JWT token', 401);
  // }
}
