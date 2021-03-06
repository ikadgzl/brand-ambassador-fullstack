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

// frontend will handle filtering-sorting-pagination
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

export const productsBackend = async (req: Request, res: Response) => {
  let products = JSON.parse(await client.get('products_frontend'));

  if (!products) {
    products = await getProductFromRepo();

    await client.set('products_frontend', JSON.stringify(products), {
      EX: 60 * 30
    });
  }

  if (req.query.search) {
    const search: string = req.query.search.toString();

    products = products.filter(
      (product: Product) =>
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
    );
  }

  if (req.query.sort === 'asc' || req.query.sort === 'desc') {
    products.sort((a, b) => {
      const diff = a.price - b.price;
      const sign = diff / Math.abs(diff);

      return req.query.sort === 'asc' ? sign : -sign;
    });
  }

  const page: number = Number(req.query.page) || 1;
  const perPage = 9;
  const total = products.length;
  const paginatedProcuts = products.slice((page - 1) * perPage, page * perPage);

  if (products.length === 0) {
    return res.status(404).json({ msg: 'No products exits.' });
  }

  res.status(200).json({
    msg: 'Products fetched successfully!',
    products: paginatedProcuts,
    page,
    total,
    last_page: Math.ceil(total / perPage)
  });
};
