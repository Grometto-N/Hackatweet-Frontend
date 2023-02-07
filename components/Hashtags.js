import styles from "../styles/Hashtags.module.css";
import Tweet from "./Tweet";
import Trends from "./Trends";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faSearch } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { addTweet, removeTweets, setTweets } from "../reducers/alltweets";
import { updateTrend, removeTrends,addTrends } from "../reducers/alltrends";
import { removeUser } from "../reducers/user";

import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";

import { useRouter } from "next/router";



const { getBackEndAdress } = require("../modules/tools");

const BACKENDADRESS = getBackEndAdress();

function Hashtags() {
  const dispatch = useDispatch();

  // définitions des états utilisés
  const [hashtagInput, setHashtagInput] = useState("");
  // const [theTweets, setTheTweets] = useState([]);

  //récuperation du user dans le reducer
  const theUser = useSelector((state) => state.user.value);
  const theTweets = useSelector((state) => state.allTweets.value);

// récupération données navigation 
  const router = useRouter();

  // récuperation des trends dans le reducer
  //const theTrends = useSelector((state) => state.allTrends.value);
  
  //     NAVIGATION
  const navigate = () => {
    router.push("/connection");
  };


  //          INITIALISATION DE LA PAGE

  const { hashtags } = router.query;
  useEffect(() => {
    fetch(`${BACKENDADRESS}/tweets/${hashtags}`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: theUser.token})
    })
    .then(response => response.json())
    .then(dataTweets => {
      if(dataTweets.result){
        // on ajoute les messages au reducer
        const tweetsFromDB = []; // pour créer un tableau qu'on
        for(let item of dataTweets.data){
          tweetsFromDB.unshift({
            tweetId : item.tweetId,
            firstName: item.firstName,
            userName: item.userName,
            date: item.date,
            message: item.message,
            likes: item.likes.length,
            isLiked: item.isLikedByUser,
            isUserTweet : item.isUserTweet,
          })              
        }
        dispatch(setTweets(tweetsFromDB))
      }

  }) },[hashtags]);


  //  GESTION DES BOUTONS

  // gestion du bouton recherche
  const handleSearch= () => {
    fetch(`${BACKENDADRESS}/tweets/${hashtagInput.replace("#","")}`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: theUser.token})
    })
    .then(response => response.json())
    .then(dataTweets => {
      if(dataTweets.result){
        // on ajoute les messages au reducer
        const tweetsFromDB = []; // pour créer un tableau qu'on
        for(let item of dataTweets.data){
          tweetsFromDB.unshift({
            tweetId : item.tweetId,
            firstName: item.firstName,
            userName: item.userName,
            date: item.date,
            message: item.message,
            likes: item.likes.length,
            isLiked: item.isLikedByUser,
            isUserTweet : item.isUserTweet,
          })              
        }
        dispatch(setTweets(tweetsFromDB))
      }})
      setHashtagInput("");
  }
  
  // gestion du bouton logout : on efface tous le contenu des reducers et on retourne à la page d'accueil
  const handleLogout = () => {
      dispatch(removeUser());
      dispatch(removeTrends());
      dispatch(removeTweets());
      navigate();
  }

  const handleKeyPress = (event) =>{
    if(event.key === "Enter"){
      handleSearch();
    }
  }
  

  //          AFFICHAGE
  //variable affichage des tweets
let displayTweets = (<h4 className={styles.notFound}>No tweet found</h4>)
if(theTweets.length>0){
  displayTweets = theTweets.map((eltTweet, i) => {
    return (
      <Tweet
        key={i}
        tweetDatas = {eltTweet}
      />
    );
  });
}



  // affichage globale du composant 
  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.leftContainer}>
          <div className={styles.logoLeft}>
          <Link href="/homeTweet">
            <FontAwesomeIcon icon={faTwitter} className={styles.logoApp} />
            </Link>
          </div>
          {/* Bottom */}
          <div className={styles.bottom}>
                {/* user */}
                <div className={styles.user}>
                  <div><Image
                    src="/Capture d’écran 2022-11-25 093029.png"
                    alt="pp"
                    width={35}
                    height={35}
                    className={styles.pp}/>
                  </div>
                  <div className={styles.username}>
                    <span>{theUser.firstName}</span>@{theUser.userName}
                  </div>
                </div>
                {/* bouton logout */}
                <div>
                <button onClick={() => {handleLogout()}} className={styles.buttonLogout}>Logout</button>
                </div>
          </div>   
      </div>
      {/* HOME */}
      <div className={styles.home}>
        <span>Hashtags</span>
        <div className={styles.hashtagwriting}>
          {/* Input du tweet */}
          <input
            type="text"
            placeholder="Search Hashtag"
            className={styles.inputHashtag}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            value={hashtagInput}
          />
          {/* <button className={styles.buttonLogout}><FontAwesomeIcon icon={faMagnifyingGlass}  /></button> */}
          <button className={styles.buttonSearch} onClick={() => {handleSearch()}}><FontAwesomeIcon icon={faSearch} className={styles.iconSearch} /></button>
        </div>
      </div>
      {/* TWEETS */}
      <div className={styles.tweetsContainer}>{displayTweets}</div>
      {/* RIGHT */}
      <div className={styles.rightContainer}>
        <span> Trends </span>
        <div className={styles.trendsContainer}> <Trends /></div>
      </div>
    </div>  
  );
}

export default Hashtags;
