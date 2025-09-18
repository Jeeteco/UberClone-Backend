


const express = require("express");
const Stripe =require('stripe')

const supabase = require("../config/supabaseClient.js");
const { authMiddleware } = require("../middelware/authMiddelware");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Create payment intent
router.post("/create-payment/:rider_id",authMiddleware, async (req, res) => {
  try {
    const {   currency, amount,method } = req.body;
    const {rider_id}=req.params
    console.log(currency,amount)

    //  const { data: rides, error:err } = await supabase
    //   .from("rides")
    //   .select("status, id")
    //   .eq("rider_id", rider_id);

    // // if (err) {
    // //   console.error("Supabase error:", error.message);
    // //   return res.status(500).json({ error: error.message });
    // // }
    //   const Status=rides.map(ride=>ride.status)
    //  res.status(200).json({ message: "success", rides,Status});

    //  const rideStatus=Status.map(state=>state.status);
    //  res.json(rideStatus)

   

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects in paise
      currency: "inr",
      payment_method_types: ["card"], // or "upi"
    });
    
    // Insert pending payment in Supabase
    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
        
          rider_id,
      
          amount,
       
          currency: currency,
          method:method,
          transaction_id: paymentIntent.id,
        },
      ])
      .select();

    if (error) throw error;

    res.json({ clientSecret: paymentIntent.client_secret, payment: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router
