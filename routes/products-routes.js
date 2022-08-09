const express = require('express');
const { check } = require('express-validator');

const productsController = require('../controllers/products-controllers');

const router = express.Router();

router.get('/', productsController.getProducts);

router.get('/:id', productsController.getProductById);

router.get('/user/:id', productsController.getProductsByUserId);

router.post(
  '/',
  check('name').not().isEmpty(),
  productsController.createProduct
);

router.patch('/:id',check('name').not().isEmpty(), productsController.updateProductById);

router.delete('/:id', productsController.deleteProductById);

module.exports = router;
