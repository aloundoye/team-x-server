const express = require('express');

const productsControllers = require('../controllers/products-controller');

const router = express.Router();

router.get('/', productsControllers.getProducts);

router.get('/:id', productsControllers.getProductById);

router.get('/user/:id', productsControllers.getProductByUserId);

router.post('/', productsControllers.createProduct);

module.exports = router;
