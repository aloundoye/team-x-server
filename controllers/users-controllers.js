const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Alassane Ndoye',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Donees saisies incorrectes, veillez reverifier', 422)
    );
  }

  const { firstname, lastname, email, password, products } = req.body;

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
    products,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Erreur de creation de l'utilisateur", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser) {
    throw new HttpError('E-mail introuvable', 401);
  }

  if (identifiedUser.password !== password) {
    throw new HttpError('Mot de passe incorrect', 401);
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
