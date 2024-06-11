const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const FileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
dotenv.config();
const multer = require('multer');
const SequelizeStore = require('connect-session-sequelize');
const db = require('../server/config/conn.js');

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: 'auto',
    },
  })
);

app.use(express.static('public'));
app.use(FileUpload());

const auth = require('./routes/auth');
const blog = require('./routes/blog');
const forum = require('./routes/forum');
const marketplace = require('./routes/marketplace');
const kelola = require('./routes/kelola');
const daftaruser = require('./routes/daftaruser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/auth', auth);
app.use('/blog', blog);
app.use('/daftaruser', daftaruser);
app.use('/marketplace', marketplace);
app.use('/forum', forum);
app.use('/kelola', kelola);

//--------------------------------

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', (req, res) => {
  res.render('eror404');
});

// store.sync();

app.listen(port, () => {
  console.log(`Server Sedang Berjalan di http://localhost:${port}`);
});
