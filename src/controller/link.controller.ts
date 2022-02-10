import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Link } from '../entity/link.entity';

export const getLinks = async (req: Request, res: Response) => {
  const links = await getRepository(Link).find({
    where: {
      user: req.params.id
    },
    relations: ['orders', 'orders.order-items']
  });

  res.status(200).json({ msg: 'Links fetched successfully.', links });
};

export const createLink = async (req: Request, res: Response) => {
  const user = req['user'];

  const link = await getRepository(Link).save({
    user,
    code: Math.random().toString(36).substring(6),
    products: req.body.products.map((id) => ({
      id
    }))
  });

  res.status(200).json({ msg: 'Link created successfully.', link });
};
