import styles from "../styles/Trend.module.css";
import Link from 'next/link';

import { useState, useEffect } from "react";
import { useSelector} from "react-redux";

function Trends() {
  const [theTrends, setTheTrends]=useState([]);

  //récuperation du user dans le reducer
  const theTweets = useSelector((state) => state.allTweets.value);


  useEffect(() => {
      // on récupère les trends
      fetch('http://localhost:3000/trends/all')
      .then(response => response.json())
      .then(dataTrends => {
          if(dataTrends.result && dataTrends.trends.length>0){
              const trendsFromDB = [];
              for(let oneTrend of dataTrends.trends){
                trendsFromDB.push({title : oneTrend.hashtag , occurence :oneTrend.tweets.length})
              }
              setTheTrends(trendsFromDB.sort((a,b)=> b.occurence - a.occurence)); 
          }
      })
    },[theTweets]);

 // variable affichage des trends
 let displayTrends = (<div>No trend for the moment</div>)
 if(theTrends.length>0){
  displayTrends = theTrends.map((elt, i) => {
    return (<Link href={`/hashtags/${elt.title.substring(1)}`}>
    <div className={styles.container}>
      <div className={styles.title}>{elt.title}</div>
      <div className={styles.occurence}>{elt.occurence} Tweet{elt.occurence > 1 && 's'}</div>
    </div>
    </Link>) ;
  });
 }

  // affichage du composant
  return (
    <>
    {displayTrends}
    </>
  );
}

export default Trends;
