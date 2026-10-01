const JELLYFIN_URL = "http://192.168.1.26:8096";
const USERNAME = "API";
const PASSWORD = "APIDashboard";

async function jellyfin() {
    // 1. Connexion
    const authResponse = await fetch(
        `${JELLYFIN_URL}/Users/AuthenticateByName`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Emby-Authorization":
                    'MediaBrowser Client="AirPanel", Device="Server", DeviceId="airpanel", Version="1.0.0"'
            },
            body: JSON.stringify({
                Username: USERNAME,
                Pw: PASSWORD
            })
        }
    );

    const auth = await authResponse.json();

    const token = auth.AccessToken;
    const userId = auth.User.Id;

    console.log("Connecté :", auth.User.Name);
    console.log("User ID :", userId);


    // 2. Récupérer les films
    const moviesResponse = await fetch(
        `${JELLYFIN_URL}/Users/${userId}/Items?IncludeItemTypes=Movie`,
        {
            headers: {
                "X-Emby-Token": token
            }
        }
    );

    const movies = await moviesResponse.json();

    console.log("Films :", movies.Items);


    // 3. Afficher les informations des films
    for (const movie of movies.Items) {

        console.log({
            id: movie.Id,
            titre: movie.Name,
            année: movie.ProductionYear,
            description: movie.Overview,
            durée: movie.RunTimeTicks,
            genres: movie.Genres,

            // URL de l'affiche
            affiche: `${JELLYFIN_URL}/Items/${movie.Id}/Images/Primary?fillWidth=300`
        });
    }


    // 4. Récupérer ce qui est actuellement en lecture
    const sessionsResponse = await fetch(
        `${JELLYFIN_URL}/Sessions`,
        {
            headers: {
                "X-Emby-Token": token
            }
        }
    );

    const sessions = await sessionsResponse.json();

    for (const session of sessions) {

        if (session.NowPlayingItem) {

            const item = session.NowPlayingItem;
            const playState = session.PlayState;

            console.log("LECTURE ACTUELLE");

            console.log({
                titre: item.Name,
                type: item.Type,
                utilisateur: session.UserName,

                pause: playState.IsPaused,

                position: playState.PositionTicks,

                affiche:
                    `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary?fillWidth=300`
            });
        }
    }
}

jellyfin();
