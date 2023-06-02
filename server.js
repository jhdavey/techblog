// Dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const routes = require('./controllers');

// Bring in connection file for sequelize DB, and setup sequelize session storage
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Create instance of express
const app = express();

// Use process.env port, or default to 3001
const PORT = process.env.PORT || 3001;

// Create session
const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
};
app.use(session(sess));

// Handlebars setup
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Handle JSON data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplify writing routes
app.use(express.static(path.join(__dirname, 'public')));

// Use routes for api
app.use(routes);

//  Sync sequelize to server and listen on port
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});