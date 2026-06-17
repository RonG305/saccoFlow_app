import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SplashPage from "./pages/auth/SplashPage";
import SignupPage from "./pages/auth/SignupPage";
import SigninPage from "./pages/auth/SigninPage";
import OtpPage from "./pages/auth/OtpPage";
import { MainLayout } from "./components/common/MainLayout";
import { CourierLayout } from "./components/Courier/CourierLayout";
import HomePage from "./pages/main/HomePage";
import SharesPage from "./pages/main/SharesPage";
import LoansPage from "./pages/main/LoansPage";
import AccountPage from "./pages/main/AccountPage";
import PrivacySecurityPage from "./pages/main/PrivacySecurityPage";
import CourierHome from "./pages/courier/CourierHome";
import CourierTrips from "./pages/courier/CourierTrips";
import CourierMap from "./pages/courier/CourierMap";
import CourierAccount from "./pages/courier/CourierAccount";

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-xl">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Sacco member UI */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/shares" element={<SharesPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/security" element={<PrivacySecurityPage />} />
          </Route>

          {/* Driver / Courier UI */}
          <Route element={<CourierLayout />}>
            <Route path="/courier/home" element={<CourierHome />} />
            <Route path="/courier/trips" element={<CourierTrips />} />
            <Route path="/courier/map" element={<CourierMap />} />
            <Route path="/account/security" element={<PrivacySecurityPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
