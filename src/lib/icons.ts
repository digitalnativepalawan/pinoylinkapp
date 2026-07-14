import {
  Link2,
  MessageCircle,
  ShoppingBag,
  Music2,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Calendar,
  Coffee,
  Briefcase,
  FileText,
  Mail,
  Linkedin,
  Phone,
  Globe,
  Store,
  Star,
  Sun,
  CreditCard,
  QrCode,
  Users,
} from "lucide-react";

export const ICONS = {
  Link2,
  MessageCircle,
  ShoppingBag,
  Music2,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Calendar,
  Coffee,
  Briefcase,
  FileText,
  Mail,
  Linkedin,
  Phone,
  Globe,
  Store,
  Star,
  Sun,
  CreditCard,
  QrCode,
  Users,
} as const;

export type IconName = keyof typeof ICONS;

export function getIcon(name: string | null | undefined) {
  if (name && name in ICONS) return ICONS[name as IconName];
  return Globe;
}

export const ICON_OPTIONS: { name: IconName; label: string }[] = [
  { name: "MessageCircle", label: "Chat" },
  { name: "Facebook", label: "Facebook" },
  { name: "Instagram", label: "Instagram" },
  { name: "Music2", label: "TikTok" },
  { name: "Youtube", label: "YouTube" },
  { name: "ShoppingBag", label: "Shopee" },
  { name: "Store", label: "Lazada" },
  { name: "Mail", label: "Email" },
  { name: "Phone", label: "Phone" },
  { name: "MapPin", label: "Location" },
  { name: "Calendar", label: "Booking" },
  { name: "Globe", label: "Website" },
  { name: "Link2", label: "Link" },
  { name: "Users", label: "Community" },
  { name: "Star", label: "Featured" },
];
