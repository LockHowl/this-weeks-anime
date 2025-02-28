require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // You'll need to install axios: npm install axios

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.post("/api/auth/token", async (req, res) => {
  const { code, code_verifier } = req.body;
  console.log("Received authorization code:", code);
  console.log("Received code verifier:", code_verifier);
  
  if (!code) {
    console.error("Missing authorization code!");
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const tokenRequestBody = {
      grant_type: "authorization_code",
      client_id: process.env.ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code,
    };
    
    // Add code_verifier if it's provided
    if (code_verifier) {
      tokenRequestBody.code_verifier = code_verifier;
    }

    console.log("Sending token request with body:", tokenRequestBody);

    const response = await axios.post("https://anilist.co/api/v2/oauth/token", tokenRequestBody, {
      headers: { "Content-Type": "application/json" }
    });

    const data = response.data;
    console.log("AniList Token Response:", data);
    
    if (data.access_token) {
      return res.json(data);
    } else {
      console.error("Failed to fetch token:", data);
      return res.status(400).json({ error: "Failed to get access token", details: data });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ 
      error: "Server error", 
      details: error.response ? error.response.data : error.message 
    });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));