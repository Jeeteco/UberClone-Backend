const express=require('express')
const dotenv=require('dotenv');
dotenv.config();
const cors=require("cors")
const authController=require('./controllers/authController.js')
const riderRoutes=require('./routes/riderRoutes.js')
const userRoutes=require('./routes/userRoutes.js')
const driverRoutes=require('./routes/driverRoutes.js')
const paymentRoutes=require('./routes/paymentRoutes.js')

const app=express();

app.use(express.json());
app.use(cors());

app.use('/auth',authController)
app.use('/rider',riderRoutes)

app.use('/user',userRoutes)
app.use('/driver',driverRoutes)
app.use('/payment',paymentRoutes);

const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Hello Server is running')

})

app.listen(PORT, ()=>{
    console.log(`Server is runnig of http://localhost:${PORT}`)
})