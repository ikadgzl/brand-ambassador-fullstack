import { Router } from 'express';
import {
  getUser,
  login,
  logout,
  register,
  updateUser
} from './controller/auth.controller';
import { getAmbassadors } from './controller/user.controller';
import { authMiddleware } from './middleware/auth.middleware';

export const routes = (router: Router) => {
  router.post('/api/admin/register', register);
  router.post('/api/admin/login', login);
  router.post('/api/admin/logout', authMiddleware, logout);

  router.get('/api/admin/user', authMiddleware, getUser);
  router.put('/api/admin/user', authMiddleware, updateUser);

  router.get('/api/admin/ambassadors', authMiddleware, getAmbassadors);
};
