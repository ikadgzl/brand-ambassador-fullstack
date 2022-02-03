import { Router } from 'express';
import {
  authenticatedUser,
  login,
  logout,
  register
} from './controller/auth.controller';

export const routes = (router: Router) => {
  router.post('/api/admin/register', register);
  router.post('/api/admin/login', login);
  router.post('/api/admin/logout', logout);
  router.get('/api/admin/user', authenticatedUser);
};
