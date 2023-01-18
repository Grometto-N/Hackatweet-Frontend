import styles from "../styles/Trend.module.css";
import Link from 'next/link';

function Trend(props) {
  return (
    <Link href={`/hashtags/${props.title.substring(1)}`}>
    <div className={styles.container}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.occurence}>{props.occurence} Tweet(s)</div>
    </div>
    </Link>
  );
}

export default Trend;
