import styles from "./CircleAvatarComponent.module.css";

export default function CircleAvatarComponent() {
  return (
    <div className={styles.circleAvatar}>
      <img className={styles.Avatar} src="/avatar.png" alt="avatar" />
    </div>
  );
}
