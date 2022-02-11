import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Link } from '../entity/link.entity';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { Product } from '../entity/product.entity';

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

export const createOrder = async (req: Request, res: Response) => {
  const link = await getRepository(Link).findOne({
    where: { code: req.body.code },
    relations: ['user']
  });

  if (link!) {
    return res.status(404).json({ msg: 'Invalid link.' });
  }

  let order = new Order();
  order.user_id = link.user.id;
  order.ambassador_email = link.user.email;
  order.code = req.body.code;
  order.first_name = req.body.first_name;
  order.last_name = req.body.last_name;
  order.email = req.body.email;
  order.address = req.body.address;
  order.country = req.body.country;
  order.city = req.body.city;
  order.zip = req.body.zip;

  order = await getRepository(Order).save(order);

  for (const product of req.body.products) {
    const fetchedProduct = await getRepository(Product).findOne(product.id);

    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.product_title = fetchedProduct.title;
    orderItem.price = fetchedProduct.price;
    orderItem.quantity = product.quantity;
    orderItem.ambassador_revenue =
      0.1 * fetchedProduct.price * product.quantity;
    orderItem.admin_revenue = 0.9 * fetchedProduct.price * product.quantity;

    await getRepository(OrderItem).save(orderItem);
  }

  res.status(200).json({
    order
  });
};
