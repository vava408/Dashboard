require("dotenv").config();
const JELLYFIN_URL = process.env.JELLYFIN_URL

async function loginJellyfin()
{
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
}