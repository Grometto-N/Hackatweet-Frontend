import styles from "../styles/ModaleIn.module.css";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { changeModaleIn } from "../reducers/modaleIn";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { checkBody } from "../modules/tools";
import { addUser } from "../reducers/user";
import { useRouter } from "next/router";

function ModaleIn() {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    dispatch(changeModaleIn(false));
  };

  const router = useRouter();
  const navigate = () => {
    router.push("/homeTweet");
  };

  // fonction pour gérer la validation
  const handleSign = () => {
    
    // on verifie si les champs sont remplis
    if (
      checkBody({ userName: userName, password: password }, [
        "userName",
        "password",
      ])
    ) {console.log("click")
      // on utilise la route pour enregistrer l'utilisateur
      fetch("http://localhost:3000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, password: password }),
      })
        .then((response) => response.json())
        .then((data) => { 
          if (data.result) {
            dispatch(
              addUser({
                firstName: data.firstName,
                userName: userName,
                token: data.token,
              })
            );
            navigate();
            dispatch(changeModaleIn(false));
          }
        });
    }
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
        <div className={styles.modaleIn}>
          <FontAwesomeIcon className={styles.logoT} icon={faTwitter} />
          <p className={styles.text}>Connect to Hackatweet</p>
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
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModaleIn;
