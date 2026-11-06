import {
  Camera,
  Fence,
  LockKeyhole,
  Megaphone,
  ShieldAlert,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface SecurityService {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  detail: string;
  features: string[];
  benefits: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
  seoTitle?: string;
  seoDescription?: string;
  icon: LucideIcon;
}

export const services: SecurityService[] = [
  {
    slug: "cctv-systems",
    title: "CCTV Systems",
    shortTitle: "CCTV",
    summary: "Camera systems planned for your property.",
    description: "Monitor your property with CCTV cameras planned for the areas you need to cover.",
    detail: "We plan camera placement, coverage and remote viewing options around your premises.",
    features: ["Site-specific camera placement", "Remote viewing options", "Scalable camera coverage", "Professional installation"],
    benefits: ["Greater visibility around your property", "Review activity when it suits you", "A system tailored to your needs"],
    image: "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Dome CCTV camera mounted on the exterior of a building",
    imagePosition: "58% center",
    icon: Camera,
  },
  {
    slug: "access-control",
    title: "Access Control",
    shortTitle: "Access Control",
    summary: "Manage entry to your property.",
    description: "Manage entry to your property with card, keypad or biometric access options.",
    detail: "We plan readers, credentials and access permissions around your entry points and daily operations.",
    features: ["Entry points planned around your site", "Access credentials selected for your needs", "Flexible permissions", "Integration planning"],
    benefits: ["More control over entry", "A smoother experience for authorised visitors", "Room to adapt as requirements change"],
    image: "https://images.unsplash.com/photo-1627227702786-f3268b95f980?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Keypad access reader on a secure entrance gate",
    imagePosition: "center 68%",
    icon: LockKeyhole,
  },
  {
    slug: "visitor-management",
    title: "Visitor Management Systems",
    shortTitle: "Visitor Management",
    summary: "Organise visitor registration and access.",
    description: "Organise visitor registration and access at your reception or entrance.",
    detail: "We assess your reception workflow and plan suitable check-in and visitor access equipment.",
    features: ["Visitor arrival and access planning", "Reception workflow assessment", "Suitable entry-point coordination", "Flexible options for different premises"],
    benefits: ["A more consistent visitor experience", "Clearer front-of-house processes", "A solution suited to your environment"],
    image: "https://images.unsplash.com/photo-1759143545924-beb85b33c0f1?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Receptionist using a tablet to welcome a visitor at reception",
    imagePosition: "center 57%",
    icon: UsersRound,
  },
  {
    slug: "pa-systems",
    title: "PA Systems",
    shortTitle: "PA Systems",
    summary: "Make announcements across your site.",
    description: "Broadcast announcements through indoor or outdoor public-address speakers.",
    detail: "We consider site use, speaker placement and coverage when planning your PA system.",
    features: ["Coverage planned for your spaces", "Indoor and outdoor requirements considered", "Equipment matched to the application", "Professional setup"],
    benefits: ["Clearer communication across your site", "A consistent announcement experience", "A system planned for your environment"],
    image: "https://images.unsplash.com/photo-1763420953483-86239ad9c206?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Professional public-address speaker array installed beneath a venue ceiling",
    imagePosition: "center 35%",
    icon: Megaphone,
  },
  {
    slug: "alarm-intrusion",
    title: "Alarm & Intrusion Systems",
    shortTitle: "Alarm Systems",
    summary: "Detect activity around your premises.",
    description: "Detect unauthorised entry with alarm systems planned around your property.",
    detail: "We plan detection zones and equipment around your property's layout and security requirements.",
    features: ["Property-specific risk assessment", "Intrusion detection planning", "Zones designed around your layout", "Professional installation and support"],
    benefits: ["An added layer of awareness", "Coverage tailored to your property", "Confidence supported by a considered plan"],
    image: "https://images.unsplash.com/photo-1697382608786-bcf4c113b86e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Illuminated electronic security keypad mounted on a wall",
    imagePosition: "center 52%",
    icon: ShieldAlert,
  },
  {
    slug: "electric-fencing",
    title: "Electric Fencing",
    shortTitle: "Electric Fencing",
    summary: "Add an electric security barrier.",
    description: "Secure your property's boundary with electric fencing planned for the site.",
    detail: "We assess the perimeter and installation requirements before planning your electric fencing.",
    features: ["Perimeter and site assessment", "Installation planned for the property", "Options for different boundary layouts", "Maintenance and support guidance"],
    benefits: ["A visible perimeter-security measure", "A design adapted to your boundary", "A more complete security plan"],
    image: "https://images.unsplash.com/photo-1787672358207-908761513e64?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Secure property perimeter with electric fencing above a boundary wall",
    imagePosition: "center 64%",
    icon: Fence,
  },
];
