import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProceduresPage from '@/pages/ProceduresPage';
import ProcedureDetailPage from '@/pages/ProcedureDetailPage';
import ResultsPage from '@/pages/ResultsPage';
import CoursesPage from '@/pages/CoursesPage';
import TeamPage from '@/pages/TeamPage';
import ContactPage from '@/pages/ContactPage';
import BookingPage from '@/pages/BookingPage';
import StickyBookingButton from '@/components/StickyBookingButton';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import { ContentProvider } from '@/contexts/ContentContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminHero from '@/pages/admin/AdminHero';
import AdminProcedures from '@/pages/admin/AdminProcedures';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminFAQ from '@/pages/admin/AdminFAQ';
import AdminResults from '@/pages/admin/AdminResults';
import AdminReels from '@/pages/admin/AdminReels';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminAdmins from '@/pages/admin/AdminAdmins';
import AdminMenu from '@/pages/admin/AdminMenu';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/procedures" element={<ProceduresPage />} />
          <Route path="/procedure/:procedureId" element={<ProcedureDetailPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
      <Footer />
      <StickyBookingButton />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <ScrollToTop />
          <Helmet>
            <title>Entourage - ბაია კონდრატიევას ესთეტიკური ცენტრი</title>
            <meta name="description" content="პრემიუმ ესთეტიკური ცენტრი თბილისში - ბოტოქსი, ფილერები, ბიორევიტალიზაცია და სხვა თანამედროვე პროცედურები" />
          </Helmet>
          
          <Routes>
            {/* Admin Routes */}
            <Route path="/panali/login" element={<AdminLogin />} />
            <Route path="/panali" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="procedures" element={<AdminProcedures />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="reels" element={<AdminReels />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="admins" element={<AdminAdmins />} />
              <Route path="menu" element={<AdminMenu />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;