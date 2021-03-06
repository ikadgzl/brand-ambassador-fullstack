import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Order } from '../entity/order.entity';

export const register = async (req: Request, res: Response) => {
  const { password, password_confirm, ...rest } = req.body;

  try {
    if (password !== password_confirm) {
      return res.status(400).json({ msg: 'Passwords do not match!' });
    }

    const user = await getRepository(User).save({
      ...rest,
      password: await bcrypt.hash(password, 10),
      is_ambassador: req.path === '/api/ambassador/register'
    });

    delete user.password;

    res.status(201).json({ msg: 'Admin user created successfully.', user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await getRepository(User).findOne(
    { email: req.body.email },
    { select: ['id', 'password', 'is_ambassador'] }
  );

  if (!user) {
    return res.status(404).json({ msg: 'Invalid credentials.' });
  }

  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!correctPassword) {
    return res.status(404).json({ msg: 'Invalid credentials.' });
  }

  const isAdmin = req.path === '/api/admin/login';
  if (user.is_ambassador && req.path === '/api/admin/login') {
    return res.status(401).json({ msg: 'Unauthorized.' });
  }

  const token = sign(
    {
      id: user.id,
      scope: isAdmin ? 'admin' : 'ambassador'
    },
    process.env.JWT_SECRET
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 10000
  });

  res.status(200).json({ msg: 'Successfully logged in.' });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 });

  res.status(200).json({ msg: 'Successfully logged out.' });
};

export const getUser = async (req: Request, res: Response) => {
  const user = req['user'];

  if (req.path === '/api/admin/user') {
    return res.status(200).json({ user });
  }

  const orders = await getRepository(Order).find({
    where: {
      user_id: user.id,
      complete: true
    },
    relations: ['order_items']
  });

  user.revenue = orders.reduce((acc, curr) => acc + curr.ambassador_revenue, 0);

  res.status(200).json({ user });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = req['user'];

  if (req.body.password) {
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({ msg: 'Passwords do not match!' });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    delete req.body.confirm_password;
  }

  await getRepository(User).update(user.id, req.body);
  const updatedUser = await getRepository(User).findOne(user.id);

  res
    .status(200)
    .json({ msg: 'User successfully updated.', user: updatedUser });
};
