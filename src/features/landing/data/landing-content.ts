export type LandingCategory = {
  id: string;
  label: string;
  iconName: string;
  iconFilled?: boolean;
  tone: "primary" | "secondary" | "tertiary" | "error";
};

export type ColorSwatch = {
  id: string;
  className: string;
  selected?: boolean;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  tag: string;
  imageUrl: string;
  available: boolean;
};

export const topTabs = ["LLAVEROS", "LÁMPARAS", "LAPICEROS", "YOYOS"];

export const categories: LandingCategory[] = [
  { id: "llaveros", label: "Llaveros", iconName: "key", iconFilled: true, tone: "primary" },
  { id: "lamparas", label: "Lámparas", iconName: "lightbulb", iconFilled: true, tone: "secondary" },
  { id: "lapiceros", label: "Lapiceros", iconName: "edit", iconFilled: true, tone: "tertiary" },
  { id: "placas", label: "Placas", iconName: "pets", iconFilled: true, tone: "error" },
];

export const swatches: ColorSwatch[] = [
  { id: "pink", className: "bg-pink-400", selected: true },
  { id: "cyan", className: "bg-cyan-400" },
  { id: "purple", className: "bg-purple-400" },
  { id: "yellow", className: "bg-yellow-400" },
  { id: "slate", className: "bg-slate-800" },
];

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "1",
    name: "Inicial Floral Custom",
    price: 45000,
    tag: "Único",
    available: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5TGhJUrKJA8UFqGISxSW9wV1rEu5VPIpSX1OkEL3j9dfPm3RPb_v2tshC9s5ofCx4Ipvv0JloT_Vkw_kOTtqTF7L0a25YoOfNC7u8ttJQdP2jMgIK1GfZ6rpxJfd5sI4gLD2qmhhQ8QF1tcOaAwO3M_yniP8sm4miriEYLQQXvcjQWU4QM37o-D56huPuoreOLpQiOay9HVz2fWqvO2xt7Ewy7x6mVEOYLc-GsOEPhpkwORs5c4onaaoZ0lruqiry6oSnQrk3USNi",
  },
  {
    id: "2",
    name: "Lámpara Noche Estelar",
    price: 120000,
    tag: "Resplandeciente",
    available: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZBsdIru2Pgiz6TqeAIFM4f5q-Kbkq2VmcNQb0i1WicwlUSBiAsv4-mXFSjSoKjN1LPJ6Fqer-w6dxHPpSO98LAzdi_GmXEAooU6YpMFxwOp7bFE1gq1OGQnj2WEZIBZCcWenPo9Zwlo9ZcR-gooVw0Vloxa3N3cBcmGSxv2izRnfuKr2c2huINhJBh7EMMC3mYJJlfkibNzuptxMuqGPulHiv0O8rZhcDizVH41LvMWXjpG2joM6VwzCezE3wRslw7JSjMk-dOPo6",
  },
  {
    id: "3",
    name: "Placa Mascota Galaxy",
    price: 35000,
    tag: "Popular",
    available: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5TGhJUrKJA8UFqGISxSW9wV1rEu5VPIpSX1OkEL3j9dfPm3RPb_v2tshC9s5ofCx4Ipvv0JloT_Vkw_kOTtqTF7L0a25YoOfNC7u8ttJQdP2jMgIK1GfZ6rpxJfd5sI4gLD2qmhhQ8QF1tcOaAwO3M_yniP8sm4miriEYLQQXvcjQWU4QM37o-D56huPuoreOLpQiOay9HVz2fWqvO2xt7Ewy7x6mVEOYLc-GsOEPhpkwORs5c4onaaoZ0lruqiry6oSnQrk3USNi",
  },
  {
    id: "4",
    name: "Portavasos Ámbar Set",
    price: 65000,
    tag: "Nuevo",
    available: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZBsdIru2Pgiz6TqeAIFM4f5q-Kbkq2VmcNQb0i1WicwlUSBiAsv4-mXFSjSoKjN1LPJ6Fqer-w6dxHPpSO98LAzdi_GmXEAooU6YpMFxwOp7bFE1gq1OGQnj2WEZIBZCcWenPo9Zwlo9ZcR-gooVw0Vloxa3N3cBcmGSxv2izRnfuKr2c2huINhJBh7EMMC3mYJJlfkibNzuptxMuqGPulHiv0O8rZhcDizVH41LvMWXjpG2joM6VwzCezE3wRslw7JSjMk-dOPo6",
  },
];

export type TrustBadge = {
  id: string;
  iconName: string;
  label: string;
};

export const trustBadges: TrustBadge[] = [
  { id: "shipping", iconName: "local_shipping", label: "Envío nacional" },
  { id: "handmade", iconName: "volunteer_activism", label: "Hecho a mano" },
  { id: "secure", iconName: "verified_user", label: "Pago seguro" },
];

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Camila R.", text: "Mi llavero quedó hermoso, los colores son increíbles. ¡Lo amo! 💕", rating: 5 },
  { id: "t2", name: "Valentina M.", text: "La lámpara es lo más lindo que he comprado. Llegó perfecta y super rápido.", rating: 5 },
  { id: "t3", name: "Andrea L.", text: "Excelente calidad y atención. Ya es mi tercer pedido 🌸", rating: 5 },
];

