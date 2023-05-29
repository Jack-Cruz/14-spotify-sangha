import React from 'react'

async function getUserTracks(username) {
   const response =  await fetch(`https://cesarquezada.pythonanywhere.com/track?user=${username}`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }})
    const jsonData = await response.json();
    return jsonData;
}

async function getRecomendation(username) {
    const response =  await fetch(`https://cesarquezada.pythonanywhere.com/prediction?user=${username}`,{
     method: "GET",
     headers: {
         "Content-Type": "application/json",
         "Access-Control-Allow-Origin": "*",
     }})
     const jsonData = await response.json();
     return jsonData;
}

async function postUserTracks(user, acousticness, danceability, duration_ms, energy, id, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, valence) {
    const response  = await fetch("https://cesarquezada.pythonanywhere.com/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            user: user,
            acousticness: acousticness,
            danceability: danceability,
            duration_ms: duration_ms,
            energy: energy,
            id: id,
            instrumentalness: instrumentalness,
            key: key,
            liveness: liveness,
            loudness: loudness,
            mode: mode,
            speechiness: speechiness,
            tempo: tempo,
            valence: valence
        })
    })
    const jsonData = await response.json();
    return jsonData;
}


export { getUserTracks, postUserTracks, getRecomendation }