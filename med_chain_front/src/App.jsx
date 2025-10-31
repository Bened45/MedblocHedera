import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage.jsx';
import PatientDataPage from './pages/PatientDataPage.jsx';
import EnrollPatientPage from './pages/EnrollPatientPage.jsx';
import ScanQrPage from './pages/ScanQrPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import VerifyMedicationPage from './pages/VerifyMedicationPage.jsx';
import HospitalRegistrationPage from './pages/HospitalRegistrationPage.jsx';
import Layout from './components/Layout.jsx';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

/**
 * A layout component that wraps all protected pages.
 * It checks for authentication and renders the main layout with child routes
 * or redirects to the login page.
 */
const ProtectedLayout = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const hasViewedOnboarding = localStorage.getItem('hasViewedOnboarding') === 'true';

  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={hasViewedOnboarding ? <Navigate to="/login" /> : <OnboardingPage />} />

          {/* Protected Routes within Layout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/enroll" element={<EnrollPatientPage />} />
            <Route path="/scan" element={<ScanQrPage />} />
            <Route path="/verify-medication" element={<VerifyMedicationPage />} />
            <Route path="/hospital-registration" element={<HospitalRegistrationPage />} />
            <Route path="/patient-data/:patientId" element={<PatientDataPage />} />
          </Route>

          {/* Fallback / Root Redirect */}
          <Route path="*" element={<Navigate to={hasViewedOnboarding ? '/dashboard' : '/onboarding'} />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;