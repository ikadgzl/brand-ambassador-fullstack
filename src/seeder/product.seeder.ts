import { createConnection, getRepository } from 'typeorm';
import faker from '@faker-js/faker';
import { Product } from '../entity/product.entity';

createConnection().then(async () => {
  const repo = getRepository(Product);

  for (let i = 0; i < 20; i++) {
    await repo.save({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.imageUrl(200, 200, '', true),
      price: Math.floor(Math.random() * 800)
    });
  }

  process.exit();
});
