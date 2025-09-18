const express = require('express');
const router = express.Router();
const supabase = require("../config/supabaseClient.js");
const { authMiddleware } = require('../middelware/authMiddelware.js');

//update profile
router.put("/updateProfile/:id", async (req, res) => {
  const { id } = req.params; 
  const { newName, newNumber } = req.body; 

  console.log("Update request for id:", id, "name:", newName, "number:", newNumber);

  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    if (!newName || !newNumber) {
      return res.status(400).json({ error: "Missing updated data" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: newName, phone_number: newNumber })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }




    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    console.log(data);
    return res.status(200).json({
      message: "Profile updated successfully",
      profile: data[0],
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//fetch user Data
router.post("/data/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  // const { role } = req.body;

  // if ( !role) {
  //   return res.status(400).json({ error: "Missing id parameter" });
  // }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id);


    if (error) {
      return res.status(402).json({ error: error.message });

    }
    else {
      return res.status(200).json({ user: data })
    }
  } catch (error) {
    console.error(error);

  }

})


module.exports = router