const clientID = process.env.REACT_APP_SPOTIFY_KEY;
const redirectURI = "http://jamjamspotify.surge.sh";

let accessToken;
let userId;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access Token match 

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        // console.log(accessTokenMatch);
        // console.log("access Match is above");
        // console.log(expiresInMatch);
        // console.log("expires in Match is above");
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = "", expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            let accessURL = "https://accounts.spotify.com/authorize?client_id=" + clientID + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
         
            // console.log(accessURL);
            // console.log("access URL is recieved ")
            return window.location = accessURL;
        }
    },
    search(term) {
        accessToken = this.getAccessToken();
        const headers = {'Authorization': `Bearer ${accessToken}`};
       
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: headers
        }).then(response => {
            // console.log("response search " + response);
            return response.json()
        }).then(jsonResponse => {
            // console.log(jsonResponse);
            if (!jsonResponse.tracks) {
                return [];
            } else {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists[0].name,
                    album: track.album.name,
                    preview: track.preview_url,
                    uri: track.uri
                }));
            };
        });
    },
    async getCurrentUserId() {
        if (userId) {
            return userId;
        }
        // console.log("calling get user id ")

        accessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        // console.log(headers);
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: headers,
                method: 'GET'
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                userId = jsonResponse.id;
                return userId;
            } 
        } catch(err) {
            console.log(err);
        }
    },
    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        
        accessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};

        // userId = this.getCurrentUserId();

        try {
            userId = await Promise.resolve(this.getCurrentUserId());
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                const playlistId = jsonResponse.id;
                // console.log(playlistId)
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            }
            
        } catch(error) {
            console.log(error);
        }

    },
    async getUserPlaylists() {
        
        accessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        // userId = this.getCurrentUserId();
        
        // console.log(headers);

        try {
            userId = await Promise.resolve(this.getCurrentUserId());
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'GET'
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                // console.log(jsonResponse);
                const playlistList = jsonResponse.items.map(playlist => ({
                    playlistName: playlist.name,
                    playlistId: playlist.id
                    
                }));
                // console.log(playlistList);
                return playlistList;
            }
            } catch(err) {
                console.log(err)
            }
        
    },
}

export default Spotify;