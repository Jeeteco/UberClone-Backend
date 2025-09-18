const supabase = require("../config/supabaseClient.js");
const express = require("express")
const router = express.Router();

//user register Route

router.post('/register', async (req, res) => {
    const { email, password, phone_number, role, full_name } = req.body;

    try {

        if (!email || !password || !phone_number || !role || !full_name) {
            return res.status(500).json({ error: "missing Data" });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        console.log(data);

        if (error) {
            console.log(error.message);
            return res.status(400).json({ error: error.message });
        }

        const checkConfirmation = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error(error.message);
                return;
            }

            const user = data.user;
            if (user?.email_confirmed_at) {
                console.log("✅ Email confirmed:", user.email);
            } else {
                console.log("❌ Email not confirmed yet");
            }
        }

        const id = data.user.id;
        const profile_pic = ``

        if (data.user) {

            const { data, error } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: id,
                        email,
                        full_name,
                        phone_number,
                        role
                    },
                ])
                .select()
            if (error) {
                return res.status(401).json({ error: error.message })
            }
            else {
                // console.log(data);
                return res.status(200).json({ message: "user registered  sucesfully", user: data })
            }
        } else {
            console.log("data Entry Failed ");
        }
        res.json(checkConfirmation());

    } catch (error) {
        console.error(error);

    }




})

//user login route
router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        // console.log(email)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });


        if (error) return res.status(400).json({ error: error.message });


      



        res.json({ message: "Login successful", user: data.user, session: data.session });
    } catch (error) {
        console.error(error.message);
    }
})


// router.get('/getRole',async (req,res) => {
//    try {
//      const { email }=req.query;
//       const { data, error:err } = await supabase
//             .from('profiles')
//             .select('role')
//             .eq('email', email);

//         if (err) {
//             console.error('Error fetching data:', err.message);
//         } else {
//             console.log('User data:', data);
//         }
//         res.json({role:data.role});
    
//    } catch (error) {
//     console.error(error.message)
    
//    }
// })
router.post('/getRole', async (req, res) => {
  try {
    const { email } = req.body; // from request body
    if (!email) return res.status(400).json({ error: "Email is required" });

    const { data, error: err } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();

    if (err) return res.status(500).json({ error: err.message });

    res.json({ role: data.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//user logout route
router.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Logged out successfully" });
})

//password recovery route
router.post("/forgotPassword", async (req, res) => {
    try {
        const { email } = req.body;
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            return res.status(402).json({ error: error.message, message: "Enter Valid email" });
        }
        else {
            return res.status(200).json({ message: `password recovery email sent on ${email} ` })
        }

    } catch (error) {
        console.error(error.message);
    }

})

module.exports = router
