import { Router } from 'express';
import {
  getUser,
  login,
  logout,
  register,
  updateUser
} from './controller/auth.controller';
import { getLinks } from './controller/link.controller';
import { getOrders } from './controller/order.controller';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from './controller/product.controller';
import { getAmbassadors } from './controller/user.controller';
import { authMiddleware } from './middleware/auth.middleware';

export const routes = (router: Router) => {
  // /Routes for ADMINS
  router.post('/api/admin/register', register);
  router.post('/api/admin/login', login);
  router.post('/api/admin/logout', authMiddleware, logout);
  router.get('/api/admin/user', authMiddleware, getUser);
  router.put('/api/admin/user', authMiddleware, updateUser);

  router.get('/api/admin/users/:id/links', authMiddleware, getLinks);

  router.get('/api/admin/ambassadors', authMiddleware, getAmbassadors);

  router.get('/api/admin/products', authMiddleware, getProducts);
  router.get('/api/admin/products/:id', authMiddleware, getProduct);
  router.post('/api/admin/products', authMiddleware, createProduct);
  router.put('/api/admin/products/:id', authMiddleware, updateProduct);
  router.delete('/api/admin/products/:id', authMiddleware, deleteProduct);

  router.get('/api/admin/orders', authMiddleware, getOrders);
  router.get('/api/admin/orders/:id', authMiddleware, getProduct);
  router.post('/api/admin/orders', authMiddleware, createProduct);
  router.put('/api/admin/orders/:id', authMiddleware, updateProduct);

  // Routes for AMBASSADORS
  router.post('/api/ambassador/register', register);
  router.post('/api/ambassador/login', login);
  router.post('/api/ambassador/logout', authMiddleware, logout);
  router.get('/api/ambassador/user', authMiddleware, getUser);
  router.put('/api/ambassador/user', authMiddleware, updateUser);
};
