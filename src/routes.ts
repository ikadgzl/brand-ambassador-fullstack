import { Router } from 'express';
import { register } from './controller/auth.controller';

export const routes = (router: Router) => {
  router.post('/api/admin/register', register);
};
