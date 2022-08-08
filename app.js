const express = require('express');
const bodyParser = require('body-parser');

const productsRoutes = require('./routes/products-routes');

const app = express();

app.use('/api/products',productsRoutes);

app.use((error, req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'Une erreur inconnue est survenue!'})
})

app.listen(5000)