import { createConnection, getRepository } from 'typeorm';
import faker from '@faker-js/faker';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { randomInt } from 'crypto';

createConnection().then(async () => {
  const orderRepo = getRepository(Order);
  const orderItemRepo = getRepository(OrderItem);

  for (let i = 0; i < 20; i++) {
    const order = await orderRepo.save({
      user_id: randomInt(2, 25),
      code: faker.random.alphaNumeric(6),
      ambassador_email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      complete: true
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemRepo.save({
        order,
        product_title: faker.lorem.word(2),
        price: randomInt(10, 100),
        quantity: randomInt(1, 5),
        admin_revenue: randomInt(10, 100),
        ambassador_revenue: randomInt(10, 100)
      });
    }
  }

  process.exit();
});
