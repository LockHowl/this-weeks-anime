import { useEffect, useState } from "react";
import { loginWithAniList } from "./auth/auth";
import { fetchUserData } from "./api/anilist";

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("anilist_token");
    if (token) {
      fetchUserData(token).then(setUser).catch(console.error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">AniList Schedule App</h1>

      {!user ? (
        <button
          onClick={loginWithAniList}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Login with AniList
        </button>
      ) : (
        <div className="text-center">
          <img
            src={user.avatar.large}
            alt="Avatar"
            className="rounded-full w-24 h-24 mx-auto"
          />
          <h2 className="text-2xl mt-2">{user.name}</h2>
          <p className="text-gray-400">{user.statistics.anime.count} anime watched</p>
          <p className="text-gray-400">{user.statistics.anime.minutesWatched} minutes watched</p>
        </div>
      )}
    </div>
  );
}

export default App;
