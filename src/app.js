const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Routes
const userRoutes = require('./routes/users');



const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(mongoSanitize());

const mongoClientPromise = new Promise((resolve) => {
  mongoose.connection.on('connected', () => {
    const client = mongoose.connection.getClient();
    resolve(client);
  });
});

const sessionConfig = {
  name: 'dqsess',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 20 * 60000,
    httpOnly: true,
    //secure: true
  },
  store: MongoStore.create({
    clientPromise: mongoClientPromise,
  }),
};
const scriptSrcUrls = [
  "https://cdn.jsdelivr.net"
];
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls]
      },
  })
);

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error', { err });
  //console.log(`${err.name}: ${err.message}`);
 
});

module.exports = app;
