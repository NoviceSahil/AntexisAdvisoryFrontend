import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './components/Footer/Footer'
import Team from './components/Team/Team';
import Affiliation from './components/Affiliation/Affiliation';
import AuditAndAssurance from './components/Services/AuditAndAssurance';
import BusinessAdvisory from './components/Services/BusinessAdvisory';
import BookKeeping from './components/Services/BookKeeping';
import GST from './components/Services/GST';
import TransferPricing from './components/Services/TransferPricing';
import CorporateFinancialAdvisory from './components/Services/CorporateFinancialAdvisory';
import RiskAdvisory from './components/Services/RiskAdvisory';
import CorporateLaw from './components/Services/CorporateLaw';
import ApplyOnline from './components/Career/ApplyOnline';
import ApplicationSuccess from './components/Career/ApplicationSuccess';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import ContactSuccess from './components/Contact/ContactSuccess';
import SuperAdminDashboard from './components/Admin/SuperAdmin/SuperAdminDashboard';
import ProtectedAdminRoute from './components/ProtectedRoute/ProtectedAdminRoute';
import BlogPage from './components/BlogPage/BlogPage';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';

function App() {
    const [isApplyOnlineSubmitted, setIsApplyOnlineSubmitted] = useState(false);
    const [isContactSubmitted, setIsContactSubmitted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(() => {
        return sessionStorage.getItem('isAdmin') === 'true';
    });

    const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
        return sessionStorage.getItem('isSuperAdmin') === 'true';
    });


    const handleSetIsAdmin = (value) => {
        setIsAdmin(value);
        sessionStorage.setItem('isAdmin', value);
    };

    const handleSetIsSuperAdmin = (value) => {
        setIsSuperAdmin(value);
        sessionStorage.setItem('isSuperAdmin', value);
    };

    return (
        <ErrorBoundary>
            <Router>
                <NavBar setIsAdmin={setIsAdmin} setIsSuperAdmin={setIsSuperAdmin} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:id" element={<BlogPage />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/affiliation" element={<Affiliation />} />
                    <Route path="/service/audit-and-assurance" element={<AuditAndAssurance />} />
                    <Route path="/service/business-advisory-internal-audit" element={<BusinessAdvisory />} />
                    <Route path="/service/book-keeping-and-outsourcing" element={<BookKeeping />} />
                    <Route path="/service/good-services-tax" element={<GST />} />
                    <Route path="/service/transfer-pricing" element={<TransferPricing />} />
                    <Route path="/service/corporate-financial-advisory" element={<CorporateFinancialAdvisory />} />
                    <Route path="/service/risk-advisory" element={<RiskAdvisory />} />
                    <Route path="/service/corporate-law-secretarial-support" element={<CorporateLaw />} />

                    <Route path="/admin/login" element={ <AdminLogin setIsAdmin={handleSetIsAdmin} setIsSuperAdmin={handleSetIsSuperAdmin}/> } />

                    <Route element={ <ProtectedAdminRoute isAllowed={isAdmin} redirectPath="/admin/login" /> } >
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route element={ <ProtectedAdminRoute isAllowed={isSuperAdmin} redirectPath="/admin/login" /> } >
                        <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
                    </Route>

                    {/* Update Contact route to use state setter */}
                    <Route path="/contact" element={<Contact setIsSubmitted={setIsContactSubmitted} />} />

                    {/* Update ApplyOnline route to use state setter */}
                    <Route path="/apply-online" element={<ApplyOnline setIsSubmitted={setIsApplyOnlineSubmitted} />}/>

                    {/* Protected success routes */}
                    <Route element={<ProtectedRoute isAllowed={isApplyOnlineSubmitted} redirectPath="/apply-online" />}>
                        <Route path="/application-success" element={<ApplicationSuccess />} />
                    </Route>

                    <Route element={<ProtectedRoute isAllowed={isContactSubmitted} redirectPath="/contact" />} >
                        <Route path="/contact-success" element={<ContactSuccess />} />
                    </Route>
                </Routes>
                <Footer />
                <WhatsAppWidget />
            </Router>
        </ErrorBoundary>
    );
}

export default App;
