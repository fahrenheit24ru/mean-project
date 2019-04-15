const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const keys = require('./config/keys.config');

const passport = require('passport');

const analyticRoutes = require('./routes/analytic.route');
const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/category.route');
const orderRoutes = require('./routes/order.route');
const positionRoutes = require('./routes/position.route');
const app = express();

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

app.use(passport.initialize());
require('./middleware/passport.middleware')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use('/api/analytic', analyticRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;
