import { useRouter } from "next/navigation";

export default function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const isLoggedIn =
      !!localStorage.getItem(
        "token"
      ); /* Kiểm tra xác thực từ localStorage, cookies, ... */

    if (!isLoggedIn) {
      router.push("/login"); // hoặc bất kỳ URL đăng nhập nào bạn muốn
      return null;
    }

    return <Component {...props} />;
  };
}
