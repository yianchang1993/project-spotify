import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession,signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSporify from "../hooks/useSporify";
import Songs from '../components/Songs'

const colors = [
  "from-indigo-500",
  "form-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const spotifyApi = useSporify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistsId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistsId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistsId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) => console.log("something when wrong", error));
  }, [spotifyApi, playlistsId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        onClick={signOut}>
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          ></img>
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} text-white p-8 h-80`}
      >
        <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""></img>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <Songs/>
    </div>
  );
}

export default Center;
