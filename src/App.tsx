import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layout/SiteLayout";
import { RequireAdmin } from "./admin/RequireAdmin";
import { PublishedSiteLayout } from "./context/PublishedSiteContext";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const WhyUsPage = lazy(() => import("./pages/WhyUsPage").then((module) => ({ default: module.WhyUsPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((module) => ({ default: module.ServicesPage })));
const ServicePage = lazy(() => import("./pages/ServicePage").then((module) => ({ default: module.ServicePage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then((module) => ({ default: module.GalleryPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((module) => ({ default: module.ContactPage })));
const ContactSuccessPage = lazy(() => import("./pages/ContactSuccessPage").then((module) => ({ default: module.ContactSuccessPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

const AdminLoginPage = lazy(() => import("./admin/AdminLoginPage").then((module) => ({ default: module.AdminLoginPage })));
const AdminLayout = lazy(() => import("./admin/AdminLayout").then((module) => ({ default: module.AdminLayout })));
const AdminDashboardPage = lazy(() => import("./admin/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })));
const AdminContentPage = lazy(() => import("./admin/AdminContentPage").then((module) => ({ default: module.AdminContentPage })));
const AdminServicesPage = lazy(() => import("./admin/AdminServicesPage").then((module) => ({ default: module.AdminServicesPage })));
const AdminGalleryPage = lazy(() => import("./admin/AdminGalleryPage").then((module) => ({ default: module.AdminGalleryPage })));
const AdminLogosPage = lazy(() => import("./admin/AdminLogosPage").then((module) => ({ default: module.AdminLogosPage })));
const AdminEnquiriesPage = lazy(() => import("./admin/AdminEnquiriesPage").then((module) => ({ default: module.AdminEnquiriesPage })));
const AdminSettingsPage = lazy(() => import("./admin/AdminSettingsPage").then((module) => ({ default: module.AdminSettingsPage })));
const AdminAnalyticsPage = lazy(() => import("./admin/AdminAnalyticsPage").then((module) => ({ default: module.AdminAnalyticsPage })));

export function App() {
  return (
    <Suspense fallback={<div className="admin-loading" role="status">Loading…</div>}>
    <Routes>
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="content/:page" element={<AdminContentPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="services/:id" element={<AdminServicesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="media" element={<Navigate replace to="/admin/gallery" />} />
          <Route path="logos" element={<AdminLogosPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>
      <Route element={<PublishedSiteLayout />}>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about/" element={<AboutPage />} />
          <Route path="why-us/" element={<WhyUsPage />} />
          <Route path="services/" element={<ServicesPage />} />
          <Route path="services/:slug/" element={<ServicePage />} />
          <Route path="gallery/" element={<GalleryPage />} />
          <Route path="contact/" element={<ContactPage />} />
          <Route path="contact-success/" element={<ContactSuccessPage />} />
          <Route path="not-found/" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
}
