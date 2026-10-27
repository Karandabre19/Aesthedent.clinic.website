import { services } from "../../lib/services.js";
import { insights } from "../../lib/insights.js";

export const publicRoutes = ["/", "/about", "/aesthedent-experience", "/contact", "/dental-clinic-in-kothrud", "/doctor", "/services", "/insights", ...services.map(s => `/services/${s.slug}`), ...insights.map(s => `/insights/${s.slug}`)];
export type MenuItem = { key: string; label: string; route: string | null; visible: boolean; opensInNewTab?: boolean };
const item = (key: string, label: string, route: string | null): MenuItem => ({ key, label, route, visible: true });
export const navigationDefaults = {
  header: [item("home", "Home", "/"), item("treatments", "Treatments", null), item("team", "Our Team", "/doctor"), item("insights", "Insights", "/insights"), item("about", "About", "/about"), item("contact", "Contact", "/contact")],
  treatments: services.map(s => item(s.slug, s.title, `/services/${s.slug}`)),
  footerServices: [item("implants", "Dental Implants", "/services/dental-implants"), item("root-canal", "Root Canal Treatment", "/services/root-canal"), item("rehabilitation", "Full Mouth Rehab", "/services/full-mouth-rehabilitation"), item("braces", "Braces & Aligners", "/services/orthodontic-treatment"), item("surgery", "Wisdom Tooth Surgery", "/services/wisdom-tooth-surgery")],
  footerQuick: [item("home", "Home", "/"), item("services", "All Services", "/services"), item("doctors", "Our Doctors", "/doctor"), item("about", "About Us", "/about"), item("contact", "Contact", "/contact")],
  legalLinks: [] as MenuItem[],
  allTreatmentsLabel: "View All Treatments",
  footer: { servicesHeading: "Services", quickHeading: "Quick Links", contactHeading: "Contact", intro: "Aesthedent - Reclaim Your Smile. Honest, clear dental care in Kothrud, Pune. We focus on reliable treatments and ensuring you understand everything before we start.", copyright: "© {year} Aesthedent Dental Clinic. All rights reserved." },
};
