const express = require('express');

const productsController = require('../controllers/products-controller');

const router = express.Router();

router.get('/', productsController.getProducts);

router.get('/:id', productsController.getProductById);

router.get('/user/:id', productsController.getProductByUserId);

router.post('/', productsController.createProduct);

module.exports = router;
