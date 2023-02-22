import styles from "../styles/ModaleUp.module.css";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { changeModaleUp } from "../reducers/modaleUp";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { addUser } from "../reducers/user";
import { useState } from "react";

import { checkDatas, getBackEndAdress } from "../modules/tools";

const BACKENDADRESS = getBackEndAdress();

function ModaleUp() {
  const [firstName, setFirstName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

    // fonctions pour changer de page
    const router = useRouter();
    const navigate = () => {
      router.push("/homeTweet");
    };
  
  // fonction pour gérer la fermuture de la modale
  const handleClose = () => {
    dispatch(changeModaleUp(false));
  };

  // fonction pour gérer la validation
  const handleSign = () => {
    const userToCreate =  {userName : userName, firstName : firstName, password: password};
    // on verifie si les champs sont remplis
    if(!checkDatas(userToCreate,['firstName','userName', 'password'])){
      setErrorMessage("All fields must be completed")
      return
    }

    async function signUp(){
      try{
          // on utilise la route pour enregistrer l'utilisateur
          const response = await  fetch(`${BACKENDADRESS}/users/signup`, {
                                      method : 'POST', 
                                      headers: { 'Content-Type': 'application/json' }, 
                                      body :JSON.stringify(userToCreate) 
                                  });
          const data = await response.json();

          if(data.result){
            dispatch(addUser({ firstName: firstName, userName: userName, token: data.token }));
            navigate();
            dispatch(changeModaleUp(false));
          }
          // si pb lors de l'enregistrement
          if(!data.result){
            setErrorMessage(data.error)
          }

      }catch(error){
        console.log(error);
      }
    }
    
    signUp();

  };
  

  return (
    <div className={styles.main}>
      <div className={styles.modale}>
        <div className={styles.X}>
          <FontAwesomeIcon
            onClick={() => {
              handleClose();
            }}
            className={styles.logoX}
            icon={faXmark}
          />
        </div>
        <div className={styles.modaleUp}>
          <FontAwesomeIcon className={styles.logoT} icon={faTwitter} />
          <p className={styles.text}>Create your Hackatweet account</p>
          {errorMessage !== "" && <p style={{color:"red"}}> {errorMessage} </p>}
          <input
            className={styles.input}
            type="text"
            placeholder="Firstname"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            className={styles.button}
            onClick={() => {
              handleSign();
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModaleUp;
