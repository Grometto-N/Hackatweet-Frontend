import styles from "../styles/Tweet.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState } from "react";
const { setSpan, getHashtags } = require("../modules/tools");
import { useSelector} from "react-redux";

function Tweet(props) {
  const [isLiked, setIsLiked] = useState(props.userLike);
  const [nbLike, setNbLike] = useState(props.likes);

  //récuperation du user dans le reducer
  const theUser = useSelector((state) => state.user.value);


// style du coeur selon s'il est séléctionné ou non
  let heartIconStyle = { cursor: "pointer" };
  if (isLiked) {
    heartIconStyle = { color: "#e74c3c", cursor: "pointer" };
  }

  // click heart
  const handleLike = () => {
    // on change en DB ajout ou suppression
    fetch("http://localhost:3000/tweets/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: theUser.token, message : props.message, hashtags : getHashtags(props.message)}),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('hashtags', getHashtags(props.message))
    })
    if(isLiked){
      // on met à jour l'état 
      setNbLike(nbLike-1);
    }
    if(!isLiked){
      // on ajoute le user dans le tweet de la DB
      setNbLike(nbLike+1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div>
          <Image
            src="/Capture d’écran 2022-11-25 093029.png"
            alt="pp"
            width={25}
            height={25}
            className={styles.pp}
          />
        </div>
        {props.firstname}
        <span className={styles.nameAndtime}>
          @{props.username} - {props.date}
        </span>
      </div>
      <div className={styles.message}>{props.message}</div>
      <div className={styles.like}>
        <span className={styles.heart}>
          <FontAwesomeIcon
            icon={faHeart}
            style={heartIconStyle}
            onClick={() => handleLike()}
            className="like"
          />
        </span>
        <span>{nbLike}</span>
      </div>
    </div>
  );
}

export default Tweet;
