const express = require('express');
const authRoutes = require('./routes/authRoutes')
const cookiePareser = require('cookie-parser');
const { requireAuth,checkUser} = require('./middleware/authMiddleware');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookiePareser())



// view engine
app.set('view engine', 'ejs');

// database connection

// routes
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

app.listen(3000, function(){
  console.log('port listening on port 3000');
})