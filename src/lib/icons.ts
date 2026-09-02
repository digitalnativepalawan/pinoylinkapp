import {
  Globe,
  Link2,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Star,
  Sun,
  CreditCard,
  QrCode,
  Users,
  Sparkles,
  Home,
  ShoppingBag,
  Store,
  Music2,
  Coffee,
  Linkedin,
  Twitch,
  ShoppingCart,
  Zap,
  Wallet,
  Headphones,
  Mic,
  Camera,
  PenTool,
  Palette,
  Code,
  Smartphone,
  Laptop,
  Monitor,
  Radio,
  Bookmark,
  Heart,
  Cake,
  Baby,
  Car,
  Truck,
  Plane,
  Train,
  Ship,
  Building,
  Hospital,
  School,
  GraduationCap,
  Coins,
  Banknote,
  Receipt,
  Tag,
  Gift,
  Trophy,
  Shield,
  Lock,
  Clock,
} from "lucide-react";

export const ICONS = {
  Globe,
  Link2,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Star,
  Sun,
  CreditCard,
  QrCode,
  Users,
  Sparkles,
  Home,
  ShoppingBag,
  Store,
  Music2,
  Coffee,
  Linkedin,
  Twitch,
  // Brand icons removed from lucide-react 0.575 — map to closest equivalents
  Spotify: Headphones,
  Tiktok: Music2,
  Telegram: MessageCircle,
  Discord: MessageCircle,
  Shopify: Store,
  ShoppingCart,
  Zap,
  Wallet,
  Headphones,
  Mic,
  Camera,
  PenTool,
  Palette,
  Code,
  Smartphone,
  Laptop,
  Monitor,
  Radio,
  Bookmark,
  Heart,
  Cake,
  Baby,
  Car,
  Truck,
  Plane,
  Train,
  Ship,
  Building,
  Hospital,
  School,
  GraduationCap,
  Coins,
  Banknote,
  Receipt,
  Tag,
  Gift,
  Trophy,
  Shield,
  Lock,
  Clock,
} as const;

export type IconName = keyof typeof ICONS;

export function getIcon(name: string | null | undefined) {
  if (!name) return Globe;
  const normalized = name
    .replace(/^WhatsApp$/i, "MessageCircle")
    .replace(/^GCash$/i, "Wallet")
    .replace(/^Maya$/i, "Wallet")
    .replace(/^PayMaya$/i, "Wallet")
    .replace(/^PayPal$/i, "CreditCard")
    .replace(/^Shopee$/i, "ShoppingBag")
    .replace(/^Lazada$/i, "Store")
    .replace(/^Stripe$/i, "CreditCard")
    .replace(/^CashApp$/i, "Wallet")
    .replace(/^Venmo$/i, "Wallet")
    .replace(/^X$/i, "Facebook")
    .replace(/^Threads$/i, "Instagram")
    .replace(/^Snapchat$/i, "Camera")
    .replace(/^Pinterest$/i, "Image")
    .replace(/^Reddit$/i, "MessageCircle")
    .replace(/^Tumblr$/i, "Image")
    .replace(/^Medium$/i, "FileText")
    .replace(/^Blogger$/i, "Home")
    .replace(/^Substack$/i, "Mail")
    .replace(/^Telegram$/i, "MessageCircle")
    .replace(/^Discord$/i, "MessageCircle")
    .replace(/^ShoppingCart$/i, "Store")
    .replace(/^Video$/i, "Camera")
    .replace(/^Image$/i, "Camera")
    .replace(/^Award$/i, "Trophy")
    .replace(/^Medal$/i, "Trophy")
    .replace(/^Droplets$/i, "Umbrella")
    .replace(/^Flame$/i, "Zap")
    .replace(/^TreePine$/i, "Plant")
    .replace(/^Flower2$/i, "Plant")
    .replace(/^Leaf$/i, "Plant")
    .replace(/^Waves$/i, "Bluetooth")
    .replace(/^Mountain$/i, "Zap")
    .replace(/^Snowflake$/i, "Cloud")
    .replace(/^Umbrella$/i, "Cloud")
    .replace(/^Mic$/i, "Mic")
    .replace(/^Headphones$/i, "Headphones")
    .replace(/^PenTool$/i, "PenTool")
    .replace(/^Palette$/i, "Palette")
    .replace(/^Code$/i, "Code")
    .replace(/^Bookmark$/i, "Bookmark")
    .replace(/^Shield$/i, "Shield")
    .replace(/^Lock$/i, "Lock")
    .replace(/^Clock$/i, "Clock")
    .replace(/^Tag$/i, "Tag")
    .replace(/^Gift$/i, "Gift")
    .replace(/^Trophy$/i, "Trophy")
    .replace(/^Smartphone$/i, "Smartphone")
    .replace(/^Laptop$/i, "Laptop")
    .replace(/^Monitor$/i, "Monitor")
    .replace(/^Radio$/i, "Radio")
    .replace(/^Car$/i, "Car")
    .replace(/^Truck$/i, "Truck")
    .replace(/^Plane$/i, "Plane")
    .replace(/^Train$/i, "Train")
    .replace(/^Ship$/i, "Ship")
    .replace(/^Building$/i, "Building")
    .replace(/^Hospital$/i, "Hospital")
    .replace(/^School$/i, "School")
    .replace(/^GraduationCap$/i, "GraduationCap")
    .replace(/^Baby$/i, "Baby")
    .replace(/^Cake$/i, "Cake")
    .replace(/^Heart$/i, "Heart")
    .replace(/^Coins$/i, "Coins")
    .replace(/^Banknote$/i, "Banknote")
    .replace(/^Receipt$/i, "Receipt")
    .replace(/^Zap$/i, "Zap")
    .replace(/^Sun$/i, "Sun")
    .replace(/^Coffee$/i, "Coffee")
    .replace(/^Calendar$/i, "Calendar")
    .replace(/^MapPin$/i, "MapPin")
    .replace(/^Briefcase$/i, "Briefcase")
    .replace(/^FileText$/i, "FileText")
    .replace(/^Stars$/i, "Star")
    .replace(/^Sparkles$/i, "Sparkles")
    .replace(/^Home$/i, "Home")
    .replace(/^Link2$/i, "Link2")
    .replace(/^Globe$/i, "Globe")
    .replace(/^MessageCircle$/i, "MessageCircle")
    .replace(/^Facebook$/i, "Facebook")
    .replace(/^Instagram$/i, "Instagram")
    .replace(/^Youtube$/i, "Youtube")
    .replace(/^Mail$/i, "Mail")
    .replace(/^Phone$/i, "Phone")
    .replace(/^Users$/i, "Users")
    .replace(/^ShoppingBag$/i, "ShoppingBag")
    .replace(/^Store$/i, "Store")
    .replace(/^Music2$/i, "Music2")
    .replace(/^Coffee$/i, "Coffee")
    .replace(/^Linkedin$/i, "Linkedin")
    .replace(/^Twitch$/i, "Twitch")
    .replace(/^Spotify$/i, "Spotify")
    .replace(/^Tiktok$/i, "Tiktok")
    .replace(/^Wallet$/i, "Wallet")
    .replace(/^CreditCard$/i, "CreditCard")
    .replace(/^QrCode$/i, "QrCode")
    .replace(/^ShoppingCart$/i, "ShoppingCart")
    .replace(/^Zap$/i, "Zap")
    .replace(/^Headphones$/i, "Headphones")
    .replace(/^Camera$/i, "Camera")
    .replace(/^PenTool$/i, "PenTool")
    .replace(/^Palette$/i, "Palette")
    .replace(/^Code$/i, "Code")
    .replace(/^Smartphone$/i, "Smartphone")
    .replace(/^Laptop$/i, "Laptop")
    .replace(/^Monitor$/i, "Monitor")
    .replace(/^Radio$/i, "Radio")
    .replace(/^Bookmark$/i, "Bookmark")
    .replace(/^Heart$/i, "Heart")
    .replace(/^Cake$/i, "Cake")
    .replace(/^Baby$/i, "Baby")
    .replace(/^Car$/i, "Car")
    .replace(/^Truck$/i, "Truck")
    .replace(/^Plane$/i, "Plane")
    .replace(/^Train$/i, "Train")
    .replace(/^Ship$/i, "Ship")
    .replace(/^Building$/i, "Building")
    .replace(/^Hospital$/i, "Hospital")
    .replace(/^School$/i, "School")
    .replace(/^GraduationCap$/i, "GraduationCap")
    .replace(/^Coins$/i, "Coins")
    .replace(/^Banknote$/i, "Banknote")
    .replace(/^Receipt$/i, "Receipt")
    .replace(/^Tag$/i, "Tag")
    .replace(/^Gift$/i, "Gift")
    .replace(/^Trophy$/i, "Trophy")
    .replace(/^Shield$/i, "Shield")
    .replace(/^Lock$/i, "Lock")
    .replace(/^Clock$/i, "Clock");
  if (normalized in ICONS) return ICONS[normalized as IconName];
  return Globe;
}

export const ICON_OPTIONS: { name: IconName; label: string }[] = [
  // Messaging / chat
  { name: "MessageCircle", label: "Messenger / Chat" },
  { name: "Mail", label: "Email" },
  { name: "Phone", label: "Phone / Call" },
  { name: "Users", label: "Community / Group" },

  // Social
  { name: "Facebook", label: "Facebook" },
  { name: "Instagram", label: "Instagram" },
  { name: "Youtube", label: "YouTube" },
  { name: "Linkedin", label: "LinkedIn" },
  { name: "Tiktok", label: "TikTok" },
  { name: "Twitch", label: "Twitch" },
  { name: "Spotify", label: "Spotify" },
  { name: "Twitter", label: "X / Twitter" },
  { name: "Telegram", label: "Telegram" },
  { name: "Discord", label: "Discord" },

  // Shopping / commerce
  { name: "ShoppingBag", label: "Shopee" },
  { name: "Store", label: "Lazada" },
  { name: "Shopify", label: "Shopify" },
  { name: "ShoppingCart", label: "Cart / Checkout" },
  { name: "Tag", label: "Sale / Promo" },
  { name: "Gift", label: "Gift / Voucher" },

  // Filipino / local payments
  { name: "Wallet", label: "GCash / Maya" },
  { name: "CreditCard", label: "Card / PayPal" },
  { name: "Banknote", label: "Cash" },
  { name: "Coins", label: "Coins" },
  { name: "PiggyBank", label: "Savings / Fund" },
  { name: "Receipt", label: "Invoice / Receipt" },
  { name: "QrCode", label: "Scan to Pay" },

  // Content / creator
  { name: "Music2", label: "Music / Audio" },
  { name: "Headphones", label: "Podcast" },
  { name: "Mic", label: "Voice / Podcast" },
  { name: "Camera", label: "Photo / Camera" },
  { name: "PenTool", label: "Writing / Blog" },
  { name: "Palette", label: "Art / Design" },
  { name: "Code", label: "Code / Dev" },
  { name: "Bookmark", label: "Read Later" },
  { name: "Home", label: "Home / Story" },
  { name: "FileText", label: "Menu / PDF" },
  { name: "Sparkles", label: "Featured" },
  { name: "Star", label: "Rating / Star" },
  { name: "Trophy", label: "Achievement" },

  // Business / services
  { name: "Briefcase", label: "Portfolio / Work" },
  { name: "Coffee", label: "Cafe / Coffee" },
  { name: "Calendar", label: "Booking" },
  { name: "MapPin", label: "Location / Directions" },
  { name: "Clock", label: "Open Hours" },
  { name: "Car", label: "Delivery / Service" },
  { name: "Building", label: "Office / Business" },
  { name: "Heart", label: "Donate / Love" },
  { name: "Cake", label: "Food / Bakery" },
  { name: "Baby", label: "Kids / Family" },
  { name: "School", label: "School" },
  { name: "GraduationCap", label: "Education" },
  { name: "Hospital", label: "Health" },
  { name: "Shield", label: "Trust / Safety" },

  // Quick actions
  { name: "Zap", label: "Quick / Fast" },
  { name: "Globe", label: "Website / Link" },
  { name: "Link2", label: "Link" },
  { name: "Smartphone", label: "Mobile App" },
  { name: "Laptop", label: "Desktop" },
  { name: "Radio", label: "Radio / Stream" },
] as const;
