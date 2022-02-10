import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { client } from '..';
import { Order } from '../entity/order.entity';
import { User } from '../entity/user.entity';

export const getAmbassadors = async (req: Request, res: Response) => {
  const ambassadors = await getRepository(User).find({
    is_ambassador: true
  });

  if (!ambassadors) {
    return res.status(404).json({ msg: 'No ambassadors exits.' });
  }

  res
    .status(200)
    .json({ msg: 'Ambassadors fetched successfully!', ambassadors });
};

export const getRankings = async (req: Request, res: Response) => {
  const result: string[] = await client.sendCommand([
    'ZREVRANGEBYSCORE',
    'rankings',
    '+inf',
    '-inf',
    'WITHSCORES'
  ]);

  let name;
  const fortmattedRanks = result.reduce((acc, curr) => {
    if (isNaN(Number(curr))) {
      name = curr;
      return acc;
    } else {
      return {
        ...acc,
        [name]: curr
      };
    }
  }, {});

  res
    .status(200)
    .json({ msg: 'Ranks fetched successfully!', ranks: fortmattedRanks });
};
