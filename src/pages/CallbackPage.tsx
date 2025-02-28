import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Callback() {
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function exchangeCodeForToken() {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        
        if (!code) {
          throw new Error("No authorization code received from AniList");
        }

        // Get the code verifier we stored earlier
        const codeVerifier = localStorage.getItem("code_verifier");
        if (!codeVerifier) {
          throw new Error("Code verifier not found in localStorage");
        }

        setStatus("Exchanging code for token...");
        
        // Send the code to your backend
        const response = await fetch("http://localhost:4000/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            code,
            code_verifier: codeVerifier
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Token exchange failed:", errorData);
          throw new Error(`Token exchange failed: ${errorData.error || "Unknown error"}`);
        }

        const data = await response.json();
        
        // Store the token securely
        localStorage.setItem("anilist_token", data.access_token);
        localStorage.setItem("token_expires_at", (Date.now() + data.expires_in * 1000).toString());
        
        // Clear code verifier as it's no longer needed
        localStorage.removeItem("code_verifier");
        
        setStatus("Login successful!");
        
        // Redirect to your app's main page after a brief delay
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Authentication error:", err);
        } else {
          setError("An unknown error occurred");
          console.error("Unknown authentication error");
        }
        setStatus("Authentication failed");
      }
    }

    exchangeCodeForToken();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">AniList Authentication</h1>
      <p className="text-xl">{status}</p>
      {error && (
        <div className="mt-4 p-4 bg-red-800 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Callback;