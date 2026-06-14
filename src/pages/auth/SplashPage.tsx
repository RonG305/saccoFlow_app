import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLogo } from "@/components/common/AppLogo";
import { Loader2 } from "lucide-react";
import { getUser, isTokenExpired, isDriver } from "@/lib/user";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = getUser();
      if (user && !isTokenExpired(user)) {
        navigate(isDriver(user) ? "/courier/home" : "/home", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <AppLogo size="lg" />
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}
