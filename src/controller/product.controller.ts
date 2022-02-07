import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { client } from '../index';

const getProductFromRepo = (id?: string) => {
  return id
    ? getRepository(Product).findOne(id)
    : getRepository(Product).find();
};

export const getProducts = async (req: Request, res: Response) => {
  const products: any = await getProductFromRepo();

  if (products.length === 0) {
    return res.status(404).json({ msg: 'No products exits.' });
  }

  res.status(200).json({ msg: 'Products fetched successfully!', products });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await getProductFromRepo(req.params.id);

  if (!product) {
    return res.status(404).json({ msg: 'No such product exits.' });
  }

  res.status(200).json({ msg: 'Product fetched successfully!', product });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await getRepository(Product).save(req.body);

  res.status(201).json({ msg: 'Product added successfully!', product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await getProductFromRepo(req.params.id);

  if (!product) {
    return res.status(404).json({ msg: 'No such product exits.' });
  }

  await getRepository(Product).update(req.params.id, req.body);
  const updatedProduct = await getProductFromRepo(req.params.id);

  res.status(202).json({
    msg: 'Ambassadors fetched successfully!',
    product: updatedProduct
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await getProductFromRepo(req.params.id);

  if (!product) {
    return res.status(404).json({ msg: 'No such product exits.' });
  }

  getRepository(Product).delete(req.params.id);

  res.status(204).json({ msg: 'Product deleted successfully!', product });
};

export const productsFrontend = async (req: Request, res: Response) => {
  let products = JSON.parse(await client.get('products_frontend'));

  if (!products) {
    products = await getProductFromRepo();

    await client.set('products_frontend', JSON.stringify(products), {
      EX: 60 * 30
    });
  }

  if (products.length === 0) {
    return res.status(404).json({ msg: 'No products exits.' });
  }

  res.status(200).json({ msg: 'Products fetched successfully!', products });
};
