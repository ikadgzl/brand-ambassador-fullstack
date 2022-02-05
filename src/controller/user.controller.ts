import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
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
