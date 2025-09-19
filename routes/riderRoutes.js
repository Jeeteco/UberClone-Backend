const express = require('express');
const router = express.Router();
const supabase = require("../config/supabaseClient.js");
const { authMiddleware } = require('../middelware/authMiddelware.js');

//Ride Booking Route
router.post("/bookride/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { pickup_location, dropoff_location, fare_estimate } = req.body;
  try {
    if (!pickup_location || !dropoff_location)
      return res.send(401).json({ error: "Required Data is missing" });
    const rider_id = id;

    const { data, error } = await supabase
      .from('rides')
      .insert([
        { rider_id, pickup_location, dropoff_location, fare_estimate },
      ])
      .select()
    if (error)
      return res.status(402).json({ error: error.message })
    else {

      return res.status(200).json({ message: "ride booking  Request Sent sucessfully ", ride: data });
    }

  } catch (error) {
    console.error(error.message);

  }

})

//fetch live ride
router.get("/getLiveRide/:rider_id", authMiddleware, async (req, res) => {
  const { rider_id } = req.params

  try {

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .in("status", ["started", "ongoing","accepted","reqested"])
      .eq('rider_id',rider_id) ;

    if (error) {
      console.error("Error fetching rides:", error.message);
      return;
    }

    return res.status(200).json({message:"live Ride status",data:data})



  } catch (error) {
    console.error(error.mesage)

  }
})



//ride history
router.get("/getRides/:id", authMiddleware, async (req, res) => {
  const { id } = req.params

  try {

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", id)
      .eq("status", "completed");
    if (error) return res.status(402).json({ error: error.message })

    return res.status(200).json({ message: "My Rides Fetch Sucessfuly", ride: data })


  } catch (error) {
    console.error(error.mesage)

  }
})




//ride cancellation route

router.put('/cancelRide/:rider_id/:id', authMiddleware, async (req, res) => {

  try {
    const { id, rider_id } = req.params;
    console.log(id, rider_id);

    const { error } = await supabase
      .from('rides')
      .update({ status: 'cancelled', completed_at: new Date() })
      .eq('id', id)
      .eq('rider_id', rider_id)

    if (error)
      return res.status(402).json({ error: error.message })

    return res.status(200).json({ message: 'Ride successfully cancelled.' });



  } catch (error) {
    console.log(error.message)

  }


})





module.exports = router