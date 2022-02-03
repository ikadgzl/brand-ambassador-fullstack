import { Router } from 'express';
import { login, register } from './controller/auth.controller';

export const routes = (router: Router) => {
  router.post('/api/admin/register', register);
  router.post('/api/admin/login', login);
};
