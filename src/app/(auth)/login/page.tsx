"use client";
import styles from "./login.module.css";
import Image from "next/image";

export default function login() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage_left}>
        <Image
          src="/bg_login.png"
          layout="fill" 
          objectFit="cover" 
          alt="Picture of the author"
        />
      </div>
      <div className={styles.loginPage_right}>
        
      </div>
    </div>
  );
}
