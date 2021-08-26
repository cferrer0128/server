const express = require('express');
const path = require('path');
const indexRoutes = require('./routes/index');

const tasksRoutes = require('./routes/tasks');

const contact = require('./routes/contact');

const app = express();

// settings


app.set('port', process.env.PORT || 3000);

// middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'views')));
// routes
app.use('/', indexRoutes);
app.use('/tasks', tasksRoutes);
app.use('/contacts', contact);

// static files

// start the server
app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
}); 