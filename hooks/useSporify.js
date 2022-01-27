import React,{useEffect} from "react";
import {signIn,useSession} from 'next-auth/react'
import spotifyApi from "../lib/spotify";

function useSporify() {
  const { data: session } = useSession();

  useEffect(()=>{
    if (session){
      //if refresh access token fails direct user to login
      if (session.error === 'RefreshTokenError'){
        signIn();
      }
      // if all good
      spotifyApi.setAccessToken(session.user.accessToken)
    }
  },[session])

  return spotifyApi;
}

export default useSporify;
