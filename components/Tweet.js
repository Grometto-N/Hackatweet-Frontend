import styles from "../styles/Tweet.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import {updateLike, deleteOneTweet} from "../reducers/alltweets";


const { getHashtags, formattedDate, getBackEndAdress } = require("../modules/tools");

const BACKENDADRESS = getBackEndAdress();

// Composant gérant l'affichage d'un tweet. La props est un objet avec les différentes informations : id, firstname, username, date , message, likes, isliked
function Tweet(props) {

  const dispatch = useDispatch();

  //récuperation du user dans le reducer
  const theUser = useSelector((state) => state.user.value);

  // click sur le coeur
  const handleLike = () => {
    // on change en DB ajout ou suppression
    async function updatingLike(){
      try{
          const response = await fetch(`${BACKENDADRESS}/tweets/like`, {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ token: theUser.token, id : props.tweetDatas.tweetId, hashtags : getHashtags(props.tweetDatas.message)}),
                                  });
          const data = await response.json();
        
          if(data.result){
            // enregistrement réussi : on met à jour le reducer
            dispatch(updateLike({
              message : props.tweetDatas.message,
              likes: data.nbLike,
              isLiked: data.likedByUser
            }))
          }
        }catch(error){
          console.log("erreur", error)
        }
    }
    
    updatingLike();
  };

  // click sur la corbeille
  const handleDelete = () => {
    // on change en DB ajout ou suppression
    async function deletingTweet(){
      try{
        const response = await fetch(`${BACKENDADRESS}/tweets/one`, {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ token: theUser.token, id : props.tweetDatas.tweetId, userName : theUser.userName}),
                                  });
        const data = await response.json();

        if(data.result){
            // suppression des trends associés
            const responseTrendsUpdate = await fetch(`${BACKENDADRESS}/trends/update`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({idTweet: props.tweetDatas.tweetId, hashtags  : getHashtags(props.tweetDatas.message),  token: theUser.token}),
                  })
            const dataTrends = await responseTrendsUpdate.json();

            if(dataTrends.result){
                // suppressions réussies : on met à jour le reducer
                dispatch(deleteOneTweet(props.tweetDatas.tweetId))
            }

        }
      }catch(error){
        console.log("erreur", error)
      }
    }
    
    deletingTweet();
  };

  // style du coeur selon s'il est séléctionné ou non
  let heartIconStyle = { cursor: "pointer" };
  if (props.tweetDatas.isLiked) {
    heartIconStyle = { color: "#e74c3c", cursor: "pointer" };
  }

// gestion de l'affichage des messages
const formattedMessage = props.tweetDatas.message.split(' ').map(word => {
      if(word.length >1 && word[0]==='#'){
          return <Link href={`/hashtags/${word.substring(1)}`} ><span className={styles.link}>{word}  </span></Link>;
      }
      return word + ' ';
    })

  return (
    <div className={styles.container}>
      {/* En-tête du tweet : image + info sur l'auteur du tweet + date*/}
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
        {props.tweetDatas.firstName}
        <span className={styles.nameAndtime}>
          @{props.tweetDatas.userName} - {formattedDate(props.tweetDatas.date)}
        </span>
      </div>
      {/* Message  */}
      <div className={styles.message}>{formattedMessage}</div>
      <div className={styles.like}>
        <span className={styles.heart}>
          <FontAwesomeIcon
            icon={faHeart}
            style={heartIconStyle}
            onClick={() => handleLike()}
          />
        </span>
        <span>{props.tweetDatas.likes}</span>
        {props.tweetDatas.isUserTweet && <span className={styles.trash}>
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={() => handleDelete()}
            className="trash"
          />
        </span>}
      </div>
    </div>
  );
}

export default Tweet;
