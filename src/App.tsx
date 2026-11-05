import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layout/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ContactSuccessPage } from "./pages/ContactSuccessPage";
import { HomePage } from "./pages/HomePage";
import { GalleryPage } from "./pages/GalleryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ServicePage } from "./pages/ServicePage";
import { ServicesPage } from "./pages/ServicesPage";
import { WhyUsPage } from "./pages/WhyUsPage";

export function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
