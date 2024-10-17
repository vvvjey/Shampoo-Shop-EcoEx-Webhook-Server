const express = require('express')
const path = require('path');
const app = express()
var bodyParser = require('body-parser');
var initWebRoutes = require("./src/routes/route");
const handlebars = require('express-handlebars');
require('dotenv').config()


// Template engine
app.engine(
  'hbs',
  handlebars.engine({ defaultLayout: 'main' ,
  extname:'.hbs',
  }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'src', 'resources','views'));

app.use(express.static(__dirname + '/src/resources'));


const port = process.env.PORT || 80 
app.use(bodyParser.urlencoded({
    extended: false
}));
  app.use(bodyParser.json());
  initWebRoutes(app);
console.log('hello',process.env.PORT || 80)

app.listen(port, () => {
  console.log(`Example app listening on port ${port || process.env.PORT}`)
})