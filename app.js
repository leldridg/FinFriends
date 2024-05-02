var express = require("express");
var app = express();
var PORT = 4567 || process.env.PORT; //var PORT = process.env.PORT || 3000
const indexRouter = require('./routes/index');

///fixes css file template
// Middleware to set Content-Type for CSS files
app.use('/styles', (req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});
app.use(express.static('images'));
// Serve static files from the 'styles' directory
app.use('/styles', express.static('styles'));
//////
const bodyParser = require('body-parser');
// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set("view engine","ejs");

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.static('middleware'));

app.use('/', indexRouter);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


