import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SplashPage from './pages/auth/SplashPage'
import SignupPage from './pages/auth/SignupPage'
import SigninPage from './pages/auth/SigninPage'
import OtpPage from './pages/auth/OtpPage'
import { MainLayout } from './components/common/MainLayout'
import HomePage from './pages/main/HomePage'
import SharesPage from './pages/main/SharesPage'
import LoansPage from './pages/main/LoansPage'
import AccountPage from './pages/main/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-xl">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/otp" element={<OtpPage />} />

          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/shares" element={<SharesPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
