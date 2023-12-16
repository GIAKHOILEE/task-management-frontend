import styles from "./CircleAvatarComponent.module.css";
import { imageDb } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import cx from "classnames";

type CircleAvatarProps = {
  email: string;
  className?: string;
};

export default function CircleAvatarComponent({ email, className }: any) {
  const [imgUrl, setImgUrl] = useState("");
  const combinedClass = cx(styles.circleAvatar, className);
  async function fetchAvatarByEmail(email: any) {
    try {
      const response = await fetch("http://localhost:8080/user/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("kết nối thất bại");
      }

      const data = await response.json();
      return data.avatar;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    async function fetchAndSetAvatar() {
      const avatarPathFromServer = await fetchAvatarByEmail(email);

      const avatarPath = avatarPathFromServer || "avatar/AvatarUser.png";
      const imageRef = ref(imageDb, avatarPath);
      getDownloadURL(imageRef)
        .then((url) => {
          setImgUrl(url);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchAndSetAvatar();
  }, []);

  return (
    <div className={combinedClass}>
      {imgUrl && <img className={styles.Avatar} src={imgUrl} />}
    </div>
  );
}
