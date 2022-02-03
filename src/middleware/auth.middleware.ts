import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.entity';

export const authMiddleware = async (req: Request, res: Response, next) => {
  try {
    const jwt = req.cookies['jwt'];
    const payload: any = verify(jwt, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ msg: 'Unauthenticated.' });
    }

    req['user'] = await getRepository(User).findOne(payload.id);

    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthenticated.' });
  }
};
