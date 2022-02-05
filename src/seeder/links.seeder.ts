import { createConnection, getRepository } from 'typeorm';
import faker from '@faker-js/faker';
import { Link } from '../entity/link.entity';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';

createConnection().then(async () => {
  const repo = getRepository(Link);

  for (let i = 0; i < 20; i++) {
    const product: any = getRepository(Product).findOne(i);
    const user = new User();
    user.id = i + 1;

    await repo.save({
      code: faker.random.alphaNumeric(6),
      product: [product],
      user
    });
  }

  process.exit();
});
