import styles from "./registerdone.module.css";
import Image from "next/image";
import Link from "next/link";

export default function registerdone() {
  return (
    <div className={styles.registerdoneContainer}>
      <div className={styles.registerdoneContainer_form}>
        <div className={styles.form_title}>Sign Up Success</div>
        <div className={styles.form_icon}>
          <Image
            src="/Ok.png"
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </div>
        <Link href="/login">
          <button className={styles.form_button}>Login</button>
        </Link>
      </div>
    </div>
  );
}
