const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_PRODUCTS = [
  {
    id: 'p1',
    name: 'VANS',
    price: 50000,
    quantity: 5,
    creator: 'u1',
    imageUrl:
      'https://www.tradeinn.com/f/125/1252953/vans-old-skool-trainers.jpg',
  },
];

const getProducts = (req, res, next) => {
  res.json({ DUMMY_PRODUCTS });
};

const getProductById = (req, res, next) => {
  const productId = req.params.id;
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    throw new HttpError('Produit non trouver', 404);
  }

  res.json({ product });
};

const getProductsByUserId = (req, res, next) => {
  const userId = req.params.id;
  const products = DUMMY_PRODUCTS.filter((p) => p.creator === userId);

  if (!products || products.length === 0) {
    return next(new HttpError('Produits non trouver pour ce utilisateur', 404));
  }

  res.json({ products });
};

const createProduct = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Donees saisies incorrectes, veillez reverifier', 422);
  }

  const { name, price, quantity, creator } = req.body;

  const createdProduct = {
    id: uuid(),
    name,
    price,
    quantity,
    creator,
  };

  DUMMY_PRODUCTS.push(createdProduct);

  res.status(201).json(createdProduct);
};

const updateProductById = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Donees saisies incorrectes, veillez reverifier', 422);
  }

  const { name, price, quantity } = req.body;
  const productId = req.params.id;

  const updatedProduct = { ...DUMMY_PRODUCTS.find((p) => p.id === productId) };
  const productIndex = DUMMY_PRODUCTS.findIndex((p) => p.id === productId);

  updatedProduct.name = name;
  updatedProduct.price = price;
  updatedProduct.quantity = quantity;

  DUMMY_PRODUCTS[productIndex] = updatedProduct;

  res.status(200).json({ product: updatedProduct });
};

const deleteProductById = (req, res, next) => {
  const productId = req.params.id;

  if (!DUMMY_PRODUCTS.find((p) => p.id === productId)) {
    throw new HttpError('Erreur suppression, Produit non trouve', 404);
  }

  DUMMY_PRODUCTS = DUMMY_PRODUCTS.filter((p) => p.id !== productId);

  res.status(200).json({ message: 'Produit supprime' });
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.getProducts = getProducts;
exports.createProduct = createProduct;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
