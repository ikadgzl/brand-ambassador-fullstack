import { Router } from 'express';
import {
  authenticatedUser,
  login,
  register
} from './controller/auth.controller';

export const routes = (router: Router) => {
  router.post('/api/admin/register', register);
  router.post('/api/admin/login', login);
  router.get('/api/admin/user', authenticatedUser);
};
