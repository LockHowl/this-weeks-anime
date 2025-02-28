// Generate a random string for PKCE
const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };
  
  // Convert Code Verifier to a SHA-256 Code Challenge
  const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };
  
  // Redirect User to AniList OAuth
  export const loginWithAniList = async () => {
    const clientId = import.meta.env.VITE_ANILIST_CLIENT_ID; // Store in .env file
    const redirectUri = "http://localhost:5173/callback"; // Must match registered URL
  
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem("code_verifier", codeVerifier); // Store for later
  
    const codeChallenge = await generateCodeChallenge(codeVerifier);
  
    const authUrl = `https://anilist.co/api/v2/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;
  
    window.location.href = authUrl; // Redirect to AniList Login
  };  