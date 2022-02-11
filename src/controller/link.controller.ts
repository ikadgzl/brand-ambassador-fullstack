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

export const getStats = async (req: Request, res: Response) => {
  const user = req['user'];

  const links = await getRepository(Link).find({
    where: {
      user
    },
    relations: ['orders', 'order_items']
  });

  const linkStats = links.map((link) => {
    const orders = link.orders.filter((order) => order.complete);

    return {
      code: link.code,
      count: orders.length,
      revenue: orders.reduce((acc, curr) => acc + curr.ambassador_revenue, 0)
    };
  });

  res
    .status(200)
    .json({ msg: 'Statistics fetched successfully.', links: linkStats });
};

export const getLinkByCode = async (req: Request, res: Response) => {
  const link = getRepository(Link).findOne({
    where: {
      code: req.params.code
    },
    relations: ['user', 'products']
  });

  if (!link) {
    return res.status(404).json({ msg: 'Such link does not exist' });
  }

  res.status(200).json({ msg: 'Link fetched successfully.', link });
};
