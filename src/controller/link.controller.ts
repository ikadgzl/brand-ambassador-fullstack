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
