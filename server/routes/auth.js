const express = require('express');
const router = express();
const controller = require('../controllers/indexcontroller');
const session = require('express-session');
const flash = require('connect-flash');
const { refreshToken } = require('../controllers/RefreshToken');

router.use(
  session({
    secret: 'flashblog',
    saveUninitialized: true,
    resave: true,
  })
);

router.use(flash());

router.use(function (req, res, next) {
  res.locals.message = req.flash('message');
  next();
});

router.use(express.static('public'));

router.post('/register', controller.users.register);
router.put('/updatePassword', controller.users.updatePassword);
router.put('/updateProfile', controller.users.updateProfile);
router.get('/me', controller.users.me);
router.post('/login', controller.users.login);
router.delete('/logout', controller.users.logout);

module.exports = router;
