import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash';
import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
import {  useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '@/hooks/useSpotify';
import Sogns from './Songs';
import Songs from './Songs';

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
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());  
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data.body);
    }).catch((err) => {
      console.log('error:', err);
    })
  }, [spotifyApi, playlistId])

  console.log('playlist:', playlist)

  return (
    <div className="flex-grow text-white">
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2' onClick={signOut}>
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="User image"/>
          <h2>{session?.user.name}</h2>
        </div>
      </header>
      
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}>
        <img className="h-44 w-44 shadow-2x1" src={playlist?.images?.[0]?.url} alt=""/>
        <div>
          <p>Playlist</p>
          <h1 className='text-2x1 md:text-3x1 xl:text-5x1'>{playlist?.name}</h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}
