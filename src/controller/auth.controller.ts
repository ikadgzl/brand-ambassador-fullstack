import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, password_confirm } = req.body;

  try {
    if (password !== password_confirm) {
      return res.status(400).json({ msg: 'Passwords do not match!' });
    }

    const { password: _, ...user } = await getRepository(User).save({
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(password, 10),
      is_ambassador: false
    });

    res.status(201).json({ msg: 'Admin user created successfully.', user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await getRepository(User).findOne({ email: req.body.email });

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

  const { password, ...rest } = user;

  res.status(200).json({ msg: 'Successfully logged in.', user: rest });
};
