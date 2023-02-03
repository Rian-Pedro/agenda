require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
    app.emit('pronto');
})
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal , checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')

app.use(helmet());
app.use(helmet.referrerPolicy({policy: ["origin", "unsafe-url"]}));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, 'public')));

// Configurações de sessão

const sessionOptions = session({
    secret: 'asdsdsgjdshash',
    store: MongoStore.create({ mongoUrl : process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());
  
// Arquivos renderizados na tela
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Configuração do CSRF token
app.use(csrf());

// Meus proprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// Mandar aplicação escutar
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log("acesse: http://localhost:3000");
    })
});