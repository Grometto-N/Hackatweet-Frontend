import styles from "../styles/HomeTweet.module.css";
import Tweet from "./Tweet";
import Trend from "./Trend";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { addTweet, removeTweets } from "../reducers/alltweets";
import { updateTrend, removeTrends,addTrends } from "../reducers/alltrends";
import { removeUser } from "../reducers/user";

import Image from "next/image";
import { useState, useEffect } from "react";

import { useRouter } from "next/router";


const { getHashtags, setSpan } = require("../modules/tools");

function HomeTweet() {
  const dispatch = useDispatch();
  //
  const [theMessage, setTheMessage] = useState("");
  const [theTweets, setTheTweets] = useState([]);
  const [theTrends, setTheTrends]=useState([]);
  const [changeTrendinDB, setChangeTrendinDB] = useState(false);

  //récuperation du user dans le reducer
  const theUser = useSelector((state) => state.user.value);

  // récuperation des trends dans le reducer
  //const theTrends = useSelector((state) => state.allTrends.value);
  
  // récupération des tweet depuis la DB
  useEffect(() => {
    fetch('http://localhost:3000/tweets')
    .then(response => response.json())
    .then(dataTweets => {
      if(dataTweets.result){
        // on ajoute les messages au reducer
        const tweetsFromDB = [];
        for(let item of dataTweets.data){
          //const isUserLike = item.likes.some(elt => elt === theUser.token);
            tweetsFromDB.unshift({
              firstname: item.firstName,
              username: item.userName,
              date: item.Date,
              message: item.message,
              likes: item.likes.length,
              userLike: false,
            })
        }// fin fetch tweets
        setTheTweets(tweetsFromDB)

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

  // click enter
  const handlekeypress = (e) => {
    if (e.key === "Enter") {
      handleTweet();
    }
  };

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
          setTheTweets([{
            firstname: theUser.firstName,
            username: theUser.userName,
            date: Date.now(),
            message: theMessage,
            likes: 0,
            userLike: false,
          },...theTweets])
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
  
  const router = useRouter();
  const navigate = () => {
    router.push("/connection");
  };
  const handleLogout = () => {
      //on efface tous les reducers
      dispatch(removeUser());
      dispatch(removeTrends());
      dispatch(removeTweets());
      navigate();
  }
  //          AFFICHAGE
  // affichage des tweets
  const displayTweets = theTweets.map((elt, i) => {
    return (
      <Tweet
        key={i}
        firstname={elt.firstname}
        username={elt.username}
        date={elt.date}
        message={elt.message}
        likes={elt.likes}
        isliked={false}
      />
    );
  });

  console.log(theTrends)
  // affiche des trends
  const displayTrends = theTrends.map((elt, i) => {
    return <Trend key={i} title={elt.title} occurence={elt.occurence} />;
  });
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
