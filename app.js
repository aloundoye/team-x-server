const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'Une erreur inconnue est survenue!' });
});

mongoose
  .connect('mongodb+srv://alou:dakar1996@cluster0.yluko.mongodb.net/products?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
    
  })
  .catch(err=>{
    console.log(err);
  });

