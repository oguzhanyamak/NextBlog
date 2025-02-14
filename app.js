const express = require('express');
const app = express();


const register = require('./src/routes/register_route')
app.set('view engine','ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended:true}));




app.use('/Register',register);

app.get('/',(req,res)=> {
    res.send("<h1>Selam Canım Ben Amcanım</h1>");
});




app.listen(3000,()=>  {
    console.log('Server listening on port http://localhost:3000');
});