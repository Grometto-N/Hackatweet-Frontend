import styles from "../styles/Trend.module.css";

function Trend(props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.occurence}>{props.occurence} Tweet(s)</div>
    </div>
  );
}

export default Trend;
