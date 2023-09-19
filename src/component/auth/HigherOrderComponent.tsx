"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }
    }, []);

    if (!isLoggedIn) {
      return null;
    }

    return <Component {...props} />;
  };
}
