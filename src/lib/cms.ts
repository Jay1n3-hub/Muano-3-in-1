export type AdminRole = "super_admin" | "administrator" | "editor";
export type EnquiryStatus = "new" | "in_progress" | "responded" | "closed";
export type EnquiryType = "quote" | "site_visit";

export interface AdminProfile {
  auth_user_id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
}

export interface Enquiry {
  id: string;
  reference_number: string;
  enquiry_type: EnquiryType;
  full_name: string;
  email: string;
  phone: string;
  service_required: string;
  property_type: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string;
  status: EnquiryStatus;
  internal_notes: string;
  submitted_at: string;
  updated_at: string;
}

export interface ManagedService {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  main_image: string;
  secondary_images: string[];
  image_alt_text: string;
  icon: string;
  features: string[];
  benefits: string[];
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
}

export interface GalleryProject {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  project_year: string;
  image_paths: string[];
  image_alt_text: string;
  display_order: number;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
