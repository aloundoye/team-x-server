const HttpError = require('../models/http-errors');

const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    name: 'VANS',
    price: '50000',
    quantity: 5,
    creator: 'u1',
    imageUrl:
      'https://www.tradeinn.com/f/125/1252953/vans-old-skool-trainers.jpg',
  },
];

const getProducts = (req, res, next) => {
  console.log('GET Request in Products');
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

const getProductByUserId = (req, res, next) => {
  const userId = req.params.id;
  const product = DUMMY_PRODUCTS.find((p) => p.creator === userId);

  if (!product) {
    return next(new HttpError('Produit non trouver pour ce utilisateur', 404));
  }

  res.json({ product });
};

exports.getProductById = getProductById;
exports.getProductByUserId = getProductByUserId;
exports.getProducts = getProducts;