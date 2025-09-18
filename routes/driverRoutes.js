const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient.js");
const { authMiddleware } = require("../middelware/authMiddelware.js");


router.post("rideStatus/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const { data, error } = await supabase
      .from('rides')
      .select('status')
      .eq("id", id);
    if (error) {
      return res.status(402).json({ error: error.message });
    }
    return res.status(200).json({ message: "Ride Accepted Sucessfully", data: data });


  } catch (error) {
    console.error(error.message);

  }
})

router.put("/acceptRide", authMiddleware, async (req, res) => {

  try {
    const { driver_id } = req.params;
    const { id }=req.body;
    console.log( driver_id);




    const { data, error } = await supabase
      .from('rides')
      .update({ status: 'accepted', 'driver_id': driver_id })
      .eq('id', id)
      .eq("status","requested")
      .select()

    if (error) return res.status(402).json({ error: error.message });

    return res.status(200).json({ mesage: "ride accepted", data: data })


  } catch (error) {

    console.error(error.message);

  }

})

// track live ride  by driver
router.post("/trackRide/:id", authMiddleware, async (req, res) => {
  
   const id = req.user.id;

  if (!id) {
    return res.status(401).json({ error: "Authentication failed. User ID not found." });
  }

  try {

   const { data, error } = await supabase
  .from('rides')
  .select('*')
  .filter('status', 'not.in', '(completed,requested)')  // values comma-separated, no parentheses

    if (error) return res.status(402).json({ error: error.message })

    return res.status(200).json({ message: "My Rides Fetch Sucessfuly", ride: data })


  } catch (error) {
    console.error(error)

  }

  }
);


router.get("/startRide/:id", authMiddleware, async (req, res) => {

  try {
    const {  id } = req.query;
  
    const driver_id=req.user.id;
      console.log(id, driver_id);



    const { data: rideStart, error: err } = await supabase
      .from('rides')
      .update({ status: 'started', started_at: new Date() })
      .eq('id', id)
      .eq('status',"accepted")
      .select()
    if (err) {
      return res.status(402).json({ error: "alredy Started" });
    }
    return res.status(200).json({ message: "Ride started now ", res: rideStart });


  } catch (error) {

    console.error(error.message);

  }

})




router.put("/rideCompleted/:driver_id/:id", authMiddleware, async (req, res) => {

  try {
    const { driver_id, id } = req.params;
    console.log(id, driver_id);



    const { data: rideComplete, error: err } = await supabase
      .from('rides')
      .update({ status: 'completed', completed_at: new Date() })
      .eq('id', id)
      .select()
    if (err) {
      return res.status(402).json({ error: err.message });
    }
    return res.status(200).json({ message: "Ride compeleted sucessfully ", res: rideComplete });


  } catch (error) {

    console.error(error.message);

  }

})

//Fetch requested Or New Rides
router.get("/getRequestedRides", authMiddleware, async (req, res) => {
  const id = req.user.id;

  if (!id) {
    return res.status(401).json({ error: "Authentication failed. User ID not found." });
  }

  try {

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested");
    if (error) return res.status(402).json({ error: error.message })

    return res.status(200).json({ message: "My Rides Fetch Sucessfuly", ride: data })


  } catch (error) {
    console.error(error)

  }
})

//Driver Rides history
router.get("/getRides/:id", authMiddleware, async (req, res) => {
  const { id } = req.params

  try {

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", id)
      .eq("status", "completed");
    if (error) return res.status(402).json({ error: error.message })

    return res.status(200).json({ message: "My Rides Fetch Sucessfuly", ride: data })


  } catch (error) {
    console.error(error.mesage)

  }
})


module.exports = router