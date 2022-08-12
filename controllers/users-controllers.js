const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Aucun utilisateur trouver', 404);

    return next(error);
  }

  if (!users || users.length === 0) {
    const error = new HttpError('Aucun utilisateur trouver', 404);
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Donees saisies incorrectes, veillez reverifier', 422)
    );
  }

  const { firstname, lastname, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Echec de l'inscription, veillez reessayez plus tard",
      500
    );
    return next(error);
  }

  if (existingUser) {
    return next(
      new HttpError('Utilisateur existe deja, veillez vous connecter', 422)
    );
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    password,
    image: 'https://www.tradeinn.com/f/125/1252953/vans-old-skool-trainers.jpg',
    products: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Erreur de creation de l'utilisateur", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Echec de l'authentification, veillez reessayez plus tard",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Email ou Mot de passe Incorrect', 401);
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
