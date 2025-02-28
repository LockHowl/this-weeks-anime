export const fetchUserData = async (token: string) => {
    const query = `
      query {
        Viewer {
          id
          name
          avatar {
            large
          }
          bannerImage
          statistics {
            anime {
              count
              meanScore
              minutesWatched
            }
          }
        }
      }
    `;
  
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();
    return data.data.Viewer;
  };
  