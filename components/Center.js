import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { set, shuffle } from 'lodash';
import { playlistIdState, playlistState, toptrackState, tracksState } from '@/atoms/playlistAtom';
import {  useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '@/hooks/useSpotify';
import Songs from './Songs';
import { getUserTracks, postUserTracks } from '@/lib/apiBackend';

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500"
];

export default function Center() {
  const {data: session} = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [tracks, setTracks] = useRecoilState(tracksState);
  const [topTracks, setTopTracks] = useRecoilState(toptrackState);
  const spotifyApi = useSpotify();
  
  useEffect(() => {
    setColor(shuffle(colors).pop());  
  }, [playlistId])

  useEffect(() => {
    if(playlistId){
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body);
            setTracks(data.body.tracks.items)
            console.log('data:', data.body.tracks.items)
        })
    }
    else {
        spotifyApi.getMyRecentlyPlayedTracks({'limit': 5}).then((recetlyplayed) => {
            setTracks(recetlyplayed.body.items)
            setTopTracks(recetlyplayed.body.items)
        });
    }
    
  }, [spotifyApi, playlistId])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white' onClick={signOut}>
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="User image"/>
          <h2>{session?.user.name}</h2>
        </div>
      </header>
      
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}>
        
        {
            playlistId ? (
              <div>  
                <img className="h-44 w-44 shadow-2x1" src={playlist?.images?.[0]?.url} alt=""/>
                <p>Playlist</p>
                <h1 className='text-2x1 md:text-3x1 xl:text-5x1'>{playlist?.name}</h1>
              </div>
            ) : (
              <h1>Canciones escuchadas recientemente</h1>
            )
        }
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}
