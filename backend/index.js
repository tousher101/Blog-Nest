require('dotenv').config();
const express = require('express');
const app = express();
const cors=require('cors');
const compression = require('compression')





app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use('/api/payment',require('./router/paymentInti'));
app.use(express.json({limit:'50mb'}))
app.use(compression())
app.use(express.urlencoded({extended:true, limit: '50mb'}));
app.use('/api/auth',require('./router/auth'));
app.use('/api/admin',require('./router/admin'));
app.use('/api/userinfo',require('./router/userinfo'));
app.use('/api/user',require('./router/user'));
app.use('/api/author', require('./router/author'));
app.use('/api/userintraction', require('./router/userinteraction'));

const port = process.env.PORT|| 5000
app.listen(port, () => {
  console.log(`Server is Connect on port ${port}`)
})
