import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Create payment intent
router.post("/create-payment", async (req, res) => {
  try {
    const { ride_id, rider_id, currency, amount, method } = req.body;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects in paise
      currency: "inr",
      payment_method_types: ["card","upi","cash"], // or "upi"
    });

    // Insert pending payment in Supabase
    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          ride_id,
          rider_id,
      
          amount,
          method,
          currency: currency,
       
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

export default router;
