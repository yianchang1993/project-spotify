import { useSession } from "next-auth/react";
import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSporify from "../hooks/useSporify";
import useSongInfo from "../hooks/useSongInfo";
import { debounce } from "lodash";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import { VolumeUpIcon } from "@heroicons/react/solid";
function Player() {
  const spotifyApi = useSporify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volumn, setVolumn] = useState(50);

  const songInfo = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolumn(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  const debouncedAjustVolume = useCallback(
    debounce((volumn) => {
      spotifyApi.setVolume(volumn).catch((err) => {});
    }, 100),
    []
  );

  //   const debouncedAjustVolume = () => {
  //     debounce((volumn) => {
  //       console.log("bounce");
  //       spotifyApi.setVolume(volumn).catch((err) => {});
  //     }, 500),
  //       [];
  //   };

  useEffect(() => {
    if (volumn > 0 && volumn < 100) {
      debouncedAjustVolume(volumn);
    }
  }, [volumn]);

  const handlePlayPause = () => {
    console.log("call");
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* {center} */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button " />
        <RewindIcon
          //   onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon
          // onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 pr-5 justify-end">
        <VolumeDownIcon
          onClick={() => volumn > 0 && setVolumn(volumn - 10)}
          className="button"
        />
        <input
          className="w-14 mcd:w-28"
          type="range"
          value={volumn}
          min={0}
          max={100}
          onChange={(e) => setVolumn(Number(e.target.value))}
        ></input>
        <VolumeUpIcon
          onClick={() => volumn < 100 && setVolumn(volumn + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
