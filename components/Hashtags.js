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
import Link from "next/link";

import { useState, useEffect } from "react";

import { useRouter } from "next/router";


const { getHashtags, setSpan } = require("../modules/tools");

function Hashtags() {
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
        <div className={styles.tweetwriting}>
          {/* Input du tweet */}
          <input
            type="text"
            placeholder="Hashtags ?"
            className={styles.inputTweet}
            onChange={(e) => setTheMessage(e.target.value)}
            value={theMessage}
          />
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

export default Hashtags;
