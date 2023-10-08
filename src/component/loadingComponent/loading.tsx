import styles from "./loading.module.css";
export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.animation}></div>
    </div>
  );
}
