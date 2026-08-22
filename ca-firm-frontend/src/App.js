import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/design-system.css';
import ErrorBoundary from './components/ErrorBoundary';
import PublicLayout from './components/Layout/PublicLayout';
import ScrollToTop from './components/Layout/ScrollToTop';
import NotFound from './components/NotFound/NotFound';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import Terms from './components/Legal/Terms';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import ServiceDetail from './components/Services/ServiceDetail';
import Team from './components/Team/Team';
import Affiliation from './components/Affiliation/Affiliation';
import Contact from './components/Contact/Contact';
import ContactSuccess from './components/Contact/ContactSuccess';
import ApplyOnline from './components/Career/ApplyOnline';
import ApplicationSuccess from './components/Career/ApplicationSuccess';
import BlogIndex from './components/BlogPage/BlogIndex';
import BlogPage from './components/BlogPage/BlogPage';
import ComplianceCalendar from './components/ComplianceCalendar/ComplianceCalendar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedRoute/ProtectedAdminRoute';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import SuperAdminDashboard from './components/Admin/SuperAdmin/SuperAdminDashboard';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';

function App() {
    const [isApplyOnlineSubmitted, setIsApplyOnlineSubmitted] = useState(false);
    const [isContactSubmitted, setIsContactSubmitted] = useState(false);

    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/service/:slug" element={<ServiceDetail />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/affiliation" element={<Affiliation />} />
                        <Route path="/blog" element={<BlogIndex />} />
                        <Route path="/blog/:id" element={<BlogPage />} />
                        <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
                        <Route path="/contact" element={<Contact setIsSubmitted={setIsContactSubmitted} />} />
                        <Route path="/apply-online" element={<ApplyOnline setIsSubmitted={setIsApplyOnlineSubmitted} />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<Terms />} />

                        <Route element={<ProtectedRoute isAllowed={isApplyOnlineSubmitted} redirectPath="/apply-online" />}>
                            <Route path="/application-success" element={<ApplicationSuccess />} />
                        </Route>
                        <Route element={<ProtectedRoute isAllowed={isContactSubmitted} redirectPath="/contact" />}>
                            <Route path="/contact-success" element={<ContactSuccess />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route element={<ProtectedAdminRoute requiredRole="admin" redirectPath="/admin/login" />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                    <Route element={<ProtectedAdminRoute requiredRole="superadmin" redirectPath="/admin/login" />}>
                        <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
                    </Route>
                </Routes>
                <WhatsAppWidget />
            </Router>
        </ErrorBoundary>
    );
}

export default App;
