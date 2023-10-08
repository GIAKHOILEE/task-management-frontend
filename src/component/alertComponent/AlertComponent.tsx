import React, { useEffect, useState } from "react";
import styles from "./alertComponent.module.css";

type AlertProps = {
  type: "success" | "warning" | "error";
  message: string;
};

const Alert: React.FC<AlertProps> = React.memo(({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.alert} ${styles[type]} ${styles.show}`}>
      {message}
    </div>
  );
});

export default Alert;
