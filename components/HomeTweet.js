import styles from "../styles/HomeTweet.module.css";
import Tweet from "./Tweet";
import Trend from "./Trend";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { addTweet, removeTweets, setTweets } from "../reducers/alltweets";
import { updateTrend, removeTrends,addTrends } from "../reducers/alltrends";
import { removeUser } from "../reducers/user";

import Image from "next/image";
import { useState, useEffect } from "react";

import { useRouter } from "next/router";


const { getHashtags, setSpan } = require("../modules/tools");

function HomeTweet() {
  const dispatch = useDispatch();

  // définitions des états utilisés
  const [theMessage, setTheMessage] = useState("");
  // const [theTweets, setTheTweets] = useState([]);
  const [theTrends, setTheTrends]=useState([]);
  const [changeTrendinDB, setChangeTrendinDB] = useState(false);

  //récuperation du user dans le reducer
  const theUser = useSelector((state) => state.user.value);
  const theTweets = useSelector((state) => state.allTweets.value);

  // récuperation des trends dans le reducer
  //const theTrends = useSelector((state) => state.allTrends.value);
  

  //          INITIALISATION 
  // récupération des tweets depuis la DB
  useEffect(() => {
    fetch('http://localhost:3000/tweets',{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: theUser.token})
    })
    .then(response => response.json())
    .then(dataTweets => {
      if(dataTweets.result){
        // on ajoute les messages au reducer
        //const tweetsFromDB = []; // pour créer un tableau qu'on
        for(let item of dataTweets.data){
            // tweetsFromDB.unshift({
            //   tweetId : item.tweetId,
            //   firstName: item.firstName,
            //   userName: item.userName,
            //   date: item.date,
            //   message: item.message,
            //   likes: item.likes.length,
            //   isLiked: item.isLikedByUser,
            //   isUserTweet : true,
            // })
            dispatch(addTweet(
              {
                  tweetId : item.tweetId,
                  firstName: item.firstName,
                  userName: item.userName,
                  date: item.date,
                  message: item.message,
                  likes: item.likes.length,
                  isLiked: item.isLikedByUser,
                  isUserTweet : item.isUserTweet,
                }
            ))
        }// fin fetch tweets
        // setTheTweets(tweetsFromDB)
        // dispatch(setTweets(tweetsFromDB));

        // on récupère les trends
        fetch('http://localhost:3000/trends/all')
        .then(response => response.json())
        .then(dataTrends => {
            if(dataTrends.result && dataTrends.trends.length>0){
                const trendsFromDB = [];
                for(let oneTrend of dataTrends.trends){
                  //dispatch(addTrends({title : oneTrend.hashtag , occurence :oneTrend.tweets.length} ));
                  trendsFromDB.push({title : oneTrend.hashtag , occurence :oneTrend.tweets.length})
                }
                setTheTrends(trendsFromDB.sort((a,b)=> b.occurence - a.occurence)); 
            }
        })// fin fetch trends
      }  
    })
       
    },[]);

    useEffect(() => {
      // on récupère les trends
      fetch('http://localhost:3000/trends/all')
      .then(response => response.json())
      .then(dataTrends => {
          if(dataTrends.result && dataTrends.trends.length>0){
              const trendsFromDB = [];
              for(let oneTrend of dataTrends.trends){
                //dispatch(addTrends({title : oneTrend.hashtag , occurence :oneTrend.tweets.length} ));
                trendsFromDB.push({title : oneTrend.hashtag , occurence :oneTrend.tweets.length})
              }
              setTheTrends(trendsFromDB.sort((a,b)=> b.occurence - a.occurence)); 
          }
      })
    },[changeTrendinDB]);

 

  //    GESTION DES "BOUTONS"

  // gestion du click sur le bouton tweet
  const handleTweet = () => {
    const theHashtags = getHashtags(theMessage)
    // on rajoute le tweet en DB
    fetch("http://localhost:3000/tweets/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: theUser.token, message : theMessage, hashtags: theHashtags }),
    })
    .then((response) => response.json())
    .then((dataTweet) => {
        if (dataTweet.result) {
          // on ajoute le 
          dispatch(addTweet([{
            firstName: theUser.firstName,
            userName: theUser.userName,
            date: Date.now(),
            message: theMessage,
            likes: 0,
            isLiked: false,
          },...theTweets]))
          // on met à jour les trends en DB en parcourant les trends
          for(let item of theHashtags){
              fetch("http://localhost:3000/trends/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hashtag  : item, idTweet: dataTweet.id }),
              }).then((response) => response.json())
                .then( dataTrends => {
                  if(dataTrends.result){
                      //setChange(!changeTrendinDB)
                  }
                });
          }// fin du for sur les hashtags
          
          
        }  
      })  
      fetch('http://localhost:3000/trends/all')
      .then(response => response.json())
      .then(dataTrends => {
          if(dataTrends.result && dataTrends.trends.length>0){
              const trendsFromDB = [];
              for(let oneTrend of dataTrends.trends){
                //dispatch(addTrends({title : oneTrend.hashtag , occurence :oneTrend.tweets.length} ));
                trendsFromDB.push({title : oneTrend.hashtag , occurence :oneTrend.tweets.length})
              }
              setTheTrends(trendsFromDB.sort((a,b)=> b.occurence - a.occurence)); 
          }
      })
    // on reset l'input
    setTheMessage("");
  };

   // click enter de l'input du tweet
   const handlekeypress = (e) => {
    if (e.key === "Enter") {
      handleTweet();
    }
  };
  
  // gestion du bouton logout : on efface tous le contenu des reducers et on retourne à la page d'accueil
  const handleLogout = () => {
      dispatch(removeUser());
      dispatch(removeTrends());
      dispatch(removeTweets());
      navigate();
  }

  
  //     NAVIGATION
  const router = useRouter();
  const navigate = () => {
    router.push("/connection");
  };


  //          AFFICHAGE
  //variable affichage des tweets
  const displayTweets = theTweets.map((eltTweet, i) => {
    return (
      <Tweet
        key={i}
        tweetDatas = {eltTweet}
      />
    );
  });


  // variable affichage des trends
  const displayTrends = theTrends.map((elt, i) => {
    return <Trend key={i} title={elt.title} occurence={elt.occurence} />;
  });

  // affichage globale du composant 
  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.leftContainer}>
          <div className={styles.logoLeft}>
            <FontAwesomeIcon icon={faTwitter} className={styles.logoApp} />
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
        <span>Home</span>
        <div className={styles.tweetwriting}>
          {/* Input du tweet */}
          <input
            type="text"
            placeholder="What's up ?"
            className={styles.inputTweet}
            onChange={(e) => setTheMessage(e.target.value)}
            value={theMessage}
            maxLength="280"
            onKeyDown={handlekeypress}
          />
          <div className={styles.validation}>
            <span>{theMessage.length}/280</span>
            {/* bouton add tweet */}
            <button className={styles.buttonTweet} onClick={() => handleTweet()}>Tweet </button>
          </div>
        </div>
      </div>
      {/* TWEETS */}
      <div className={styles.tweetsContainer}>{displayTweets}</div>
      {/* RIGHT */}
      <div className={styles.rightContainer}>
        <span> Trends </span>
        <div className={styles.trendsContainer}>{displayTrends}</div>
      </div>
    </div>  
  );
}

export default HomeTweet;
