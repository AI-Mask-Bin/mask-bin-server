import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserEntity } from 'src/entity/user.entity';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}

@Injectable()
export class DeserializeUserMiddleware implements NestMiddleware {
  public async use(request: Request, response: Response, next: NextFunction) {
    const { accessToken } = request.cookies;
    if (!accessToken) {
      return next();
    }

    try {
      const { data }: any = jwt.verify(accessToken, process.env.JWT_SECRET);
      if (data) {
        request.user = data;
      }
    } catch (e) {
      response.clearCookie('accessToken');
    }

    return next();
  }
}
