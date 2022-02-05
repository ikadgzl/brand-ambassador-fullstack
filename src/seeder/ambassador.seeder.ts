import { createConnection, getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import bcrpyt from 'bcrypt';
import faker from '@faker-js/faker';

createConnection().then(async () => {
  const repo = getRepository(User);

  const password = await bcrpyt.hash('1234', 10);

  for (let i = 0; i < 20; i++) {
    await repo.save({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password,
      is_ambassador: true
    });
  }

  process.exit();
});
