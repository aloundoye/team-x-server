const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const getProducts = async (req, res, next) => {
  let products;

  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError('Aucun produits trouver', 404);

    return next(error);
  }

  if (!products || products.length === 0) {
    const error = new HttpError('Aucun produit trouver', 404);
    return next(error);
  }

  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const getProductById = async (req, res, next) => {
  const productId = req.params.id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError('Produit non trouver', 500);

    return next(error);
  }

  if (!product) {
    const error = new HttpError('Produit non trouver', 404);
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let products;
  try {
    products = await Product.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Produits non trouver pour ce utilisateur',
      404
    );

    return next(error);
  }

  if (!products || products.length === 0) {
    return next(new HttpError('Produits non trouver pour ce utilisateur', 404));
  }


  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Donees saisies incorrectes, veillez reverifier', 422)
    );
  }

  const { name, price, quantity, creator } = req.body;

  const createdProduct = new Product({
    name,
    price,
    quantity,
    image: 'https://www.tradeinn.com/f/125/1252953/vans-old-skool-trainers.jpg',
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Erreur de creation du produit, veillez ressayer',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Utilisateur introuvable', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    user.products.push(createdProduct);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Erreur de creation du produit', 500);
    return next(error);
  }

  res.status(201).json(createdProduct);
};

const updateProductById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Donees saisies incorrectes, veillez reverifier', 422)
    );
  }

  const { name, price, quantity } = req.body;
  const productId = req.params.id;

  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError('Produit non trouver', 404);

    return next(error);
  }

  product.name = name;
  product.price = price;
  product.quantity = quantity;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Erreur lors de l'enregistrement des modfications",
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProductById = async (req, res, next) => {
  const productId = req.params.id;

  let product;

  try {
    product = await Product.findById(productId).populate('creator');
  } catch (err) {
    const error = new HttpError('Produit non trouver', 404);
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Produit non trouver', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess });
    product.creator.products.pull(product);
    await product.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la supprission du produit',
      500
    );

    return next(error);
  }

  res.status(200).json({ message: 'Produit supprime' });
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.getProducts = getProducts;
exports.createProduct = createProduct;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
