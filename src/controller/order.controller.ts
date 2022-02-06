import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Order } from '../entity/order.entity';

export const getOrders = async (req: Request, res: Response) => {
  const orders = await getRepository(Order).find({
    where: { complete: true },
    relations: ['order_items']
  });

  if (orders.length === 0) {
    return res.status(404).json({ msg: 'No orders exits.' });
  }

  const organisedOrders = orders.map((order) => ({
    id: order.id,
    name: order.name,
    email: order.email,
    total: order.total,
    createdAt: order.created_at,
    order_items: order.order_items
  }));

  res
    .status(200)
    .json({ msg: 'Orders fetched successfully!', orders: organisedOrders });
};
