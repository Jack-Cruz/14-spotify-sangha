"use client"
import React, { useEffect, useState } from 'react'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '@/hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState, toptrackState } from '@/atoms/playlistAtom';
import { getRecomendation, postUserTracks } from '@/lib/apiBackend';

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [ playlists, setPlaylists ] = useState([]);
  const [ playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [topTracks, setTopTracks] = useRecoilState(toptrackState);

  useEffect(() => {
    if(spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      }).catch((err) => {
        console.log('error:', err);
      });
    }
  }, [session, spotifyApi]);

  const predict = () => {
    console.log("***********************")
    console.log("predict")

    const playlistid = 'DJ Spotify'+session.user.name+Date.now();
    let cnt = 0;
    console.log('topTracks:', topTracks)
    topTracks.map((track) => 
        spotifyApi.getAudioFeaturesForTrack(track.track.id)
        .then((audioFeatures) => {
            postUserTracks(playlistid,
                audioFeatures.body.acousticness, 
                audioFeatures.body.danceability, 
                audioFeatures.body.duration_ms, 
                audioFeatures.body.energy, 
                audioFeatures.body.id, 
                audioFeatures.body.instrumentalness, 
                audioFeatures.body.key, 
                audioFeatures.body.liveness, 
                audioFeatures.body.loudness, 
                audioFeatures.body.mode, 
                audioFeatures.body.speechiness, 
                audioFeatures.body.tempo, 
                audioFeatures.body.valence).then(() => {
                    cnt += 1;
                    if(cnt == 10){
                        getRecomendation(playlistid).then((data) => {
                            console.log(data)
                            spotifyApi.createPlaylist(playlistid, 
                            { 'description': 'My description', 
                                'public': false })
                            .then(function(playlist) {
                                console.log('playlist:', playlist.body.id)
                                data = data.map((item) => "spotify:track:" + item)
                                console.log('items:', data)
                    
                                spotifyApi.addTracksToPlaylist(playlist.body.id, data).then(() =>
                                    {
                                        session.user.name=session.user.name;
                                    }
                                )
                            }).catch((err) => {
                                console.log('error:', err);
                            }).catch((err) => {
                                console.log('error:', err);
                            });
                            console.log('data:', data)
                        }).catch((err) => {
                            console.log('error:', err);
                        });
                    }
                }).catch((err) => {})

    }))
    

    
    
  }

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
      <div className="space-y-4">
       
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" onClick={predict}/>
          <p>PREDICT</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create a Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlist... */}
        {
            playlists.map((playlist) => (
                <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">{playlist.name}</p>
            ))
        }
        
      </div>
    </div>
  )
}

export default Sidebar