import { makePlaceholder } from "./placeholder";

export type Gender = "men" | "women";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  category: string;
  subcategory: string;
  priceInr: number;
  priceUsd: number;
  compareAtInr?: number;
  compareAtUsd?: number;
  emoji: string;
  image: string;
  image2?: string;
  imageAlt: string;
  colours: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  sellingFast?: boolean;
  newIn?: boolean;
  description: string;
  composition: string;
  badges?: string[];
}

const sizesApparel = ["S", "M", "L", "XL", "XXL"];
const sizesShoes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

let seed = 0;

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function p(opts: {
  name: string;
  gender: Gender;
  category: string;
  subcategory: string;
  inr: number;
  usd: number;
  compareAtInr?: number;
  compareAtUsd?: number;
  emoji: string;
  colours: string[];
  sizes?: string[];
  sellingFast?: boolean;
  newIn?: boolean;
  description: string;
  composition: string;
  rating?: number;
  reviews?: number;
  img?: string;
}): Product {
  const id = `ss-${String(++seed).padStart(3, "0")}`;
  const slug = `${opts.gender}-${opts.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${id}`;
  const label = `${opts.name.split(" ").slice(0, 4).join(" ")}`;
  return {
    id,
    slug,
    name: opts.name,
    brand: "StreamSports",
    gender: opts.gender,
    category: opts.category,
    subcategory: opts.subcategory,
    priceInr: opts.inr,
    priceUsd: opts.usd,
    compareAtInr: opts.compareAtInr,
    compareAtUsd: opts.compareAtUsd,
    emoji: opts.emoji,
    image: opts.img ? `/assets/images/products/${opts.img}.jpg` : makePlaceholder(opts.emoji, label, 0),
    image2: opts.img ? `/assets/images/products/${opts.img}-2.jpg` : makePlaceholder(opts.emoji, `${label} · back view`, 1),
    imageAlt: `${opts.name} in ${opts.colours[0]} by StreamSports`,
    colours: opts.colours,
    sizes: opts.sizes ?? (opts.emoji === "👟" ? sizesShoes : sizesApparel),
    rating: opts.rating ?? 4 + (hashCode(opts.name) % 10) / 10,
    reviews: opts.reviews ?? (hashCode(opts.name) % 380) + 40,
    sellingFast: opts.sellingFast,
    newIn: opts.newIn,
    description: opts.description,
    composition: opts.composition,
  };
}

export const products: Product[] = [
  // ---------------- MEN / T-SHIRTS ----------------
  p({
    name: "oversized back print t-shirt in black",
    gender: "men",
    category: "clothing",
    subcategory: "t-shirts",
    inr: 499, usd: 9,
    emoji: "👕",
    img: "men-tee-backprint",
    colours: ["#111111", "#ffffff", "#9aa3ad"],
    sellingFast: true,
    description:
      "The everyday oversized tee, upgraded. Heavyweight cotton with a bold back print, dropped shoulders and a boxy, street-ready fit.",
    composition: "100% combed cotton, 240 GSM",
  }),
  p({
    name: "classic fit crew neck t-shirt in white",
    gender: "men",
    category: "clothing",
    subcategory: "t-shirts",
    inr: 399, usd: 7,
    emoji: "👕",
    img: "men-tee-crew-white",
    colours: ["#ffffff", "#111111"],
    sellingFast: true,
    description:
      "Our sharpest core tee. A clean crew neck in pure cotton with a classic regular fit that works under a hoodie or on its own.",
    composition: "100% cotton, 180 GSM",
  }),
  p({
    name: "graphic varsity t-shirt in navy",
    gender: "men",
    category: "clothing",
    subcategory: "t-shirts",
    inr: 649, usd: 11,
    compareAtInr: 899, compareAtUsd: 16,
    emoji: "👕",
    img: "men-tee-varsity-navy",
    colours: ["#1c2e4a", "#111111", "#ffffff"],
    description:
      "Varsity energy in a soft graphic tee. Oversized print with a retro stitch effect and a mid-weight cotton drape.",
    composition: "100% cotton",
  }),
  p({
    name: "muscle fit performance tee in charcoal",
    gender: "men",
    category: "clothing",
    subcategory: "t-shirts",
    inr: 599, usd: 11,
    emoji: "🏋️",
    img: "men-tee-muscle-charcoal",
    colours: ["#33383e", "#111111", "#f3f3f3"],
    newIn: true,
    description:
      "Built for the gym and the street. Breathable quick-dry fabric with a tapered muscle fit that moves with you.",
    composition: "85% polyester, 15% elastane",
  }),
  p({
    name: "striped short sleeve t-shirt in cream",
    gender: "men",
    category: "clothing",
    subcategory: "t-shirts",
    inr: 549, usd: 9,
    emoji: "👕",
    img: "men-tee-striped-cream",
    colours: ["#f2e8d5", "#111111"],
    description:
      "Cream stripes, soft hand-feel, easy fit. A laid-back staple with a ribbed collar and neat hem.",
    composition: "100% cotton",
  }),

  // ---------------- MEN / HOODIES & SWEATSHIRTS ----------------
  p({
    name: "heavyweight fleece hoodie in black",
    gender: "men",
    category: "clothing",
    subcategory: "hoodies-sweatshirts",
    inr: 1299, usd: 24,
    emoji: "🧥",
    img: "men-hoodie-black",
    colours: ["#111111", "#5b6470", "#ffffff"],
    sellingFast: true,
    description:
      "A 400 GSM heavyweight hoodie with a brushed interior, kangaroo pocket and drop shoulder. Built to last, made to layer.",
    composition: "80% cotton, 20% polyester, 400 GSM",
  }),
  p({
    name: "oversized fleece sweatshirt in heather grey",
    gender: "men",
    category: "clothing",
    subcategory: "hoodies-sweatshirts",
    inr: 1099, usd: 20,
    emoji: "🧥",
    img: "men-sweatshirt-grey",
    colours: ["#9aa3ad", "#111111"],
    description:
      "Relaxed, cosy and clean. A mid-weight crewneck sweatshirt with dropped shoulders and a soft brushed back.",
    composition: "70% cotton, 30% polyester",
  }),
  p({
    name: "zip-through track hoodie in black",
    gender: "men",
    category: "clothing",
    subcategory: "hoodies-sweatshirts",
    inr: 1399, usd: 25,
    emoji: "🧥",
    img: "men-zip-hoodie-black",
    colours: ["#111111", "#7c1f2b"],
    newIn: true,
    description:
      "Classic track-jacket DNA in a modern zip hoodie. Full zip, side pockets and tonal trims.",
    composition: "65% cotton, 35% polyester",
  }),

  // ---------------- MEN / JOGGERS & TROUSERS ----------------
  p({
    name: "tapered track joggers in black",
    gender: "men",
    category: "clothing",
    subcategory: "joggers-trousers",
    inr: 999, usd: 18,
    emoji: "👖",
    img: "men-jogger-black",
    colours: ["#111111", "#5b6470"],
    sellingFast: true,
    description:
      "The weekend uniform. Tapered joggers with ribbed cuffs, drawcord waist and two zip pockets.",
    composition: "70% cotton, 30% polyester",
  }),
  p({
    name: "cargo joggers in olive",
    gender: "men",
    category: "clothing",
    subcategory: "joggers-trousers",
    inr: 1199, usd: 22,
    emoji: "👖",
    img: "men-cargo-olive",
    colours: ["#5a5a3e", "#111111"],
    description:
      "Cargo pockets, utility straps and a relaxed tapered leg. Utility done streetwear-clean.",
    composition: "60% cotton, 40% nylon",
  }),
  p({
    name: "straight leg chino in beige",
    gender: "men",
    category: "clothing",
    subcategory: "joggers-trousers",
    inr: 1499, usd: 27,
    emoji: "👖",
    img: "men-chino-beige",
    colours: ["#d8c9a8", "#111111", "#5b6470"],
    description:
      "Sharp enough for the office, soft enough for the sofa. A classic straight chino in a mid-weight twill.",
    composition: "98% cotton, 2% elastane",
  }),

  // ---------------- MEN / SHORTS ----------------
  p({
    name: "gym training shorts in black",
    gender: "men",
    category: "clothing",
    subcategory: "shorts",
    inr: 799, usd: 14,
    emoji: "🩳",
    img: "men-shorts-black",
    colours: ["#111111", "#5b6470"],
    sellingFast: true,
    description:
      "Lightweight 5-inch training shorts with an inner liner, side pockets and a drawcord waist.",
    composition: "90% polyester, 10% elastane",
  }),
  p({
    name: "cargo shorts in khaki",
    gender: "men",
    category: "clothing",
    subcategory: "shorts",
    inr: 899, usd: 16,
    emoji: "🩳",
    img: "men-shorts-khaki",
    colours: ["#a8987a", "#111111"],
    description:
      "Carry everything. Six-pocket cargo shorts in a durable cotton twill with an adjustable waist.",
    composition: "100% cotton",
  }),

  // ---------------- MEN / JACKETS ----------------
  p({
    name: "bomber jacket in olive",
    gender: "men",
    category: "clothing",
    subcategory: "jackets",
    inr: 2499, usd: 40,
    compareAtInr: 2999, compareAtUsd: 40,
    emoji: "🧥",
    img: "men-jacket-olive",
    colours: ["#5a5a3e", "#111111"],
    sellingFast: true,
    description:
      "A wardrobe anchor. Classic bomber silhouette with a satin shell, ribbed cuffs and stand collar.",
    composition: "100% nylon shell, poly-filled",
  }),
  p({
    name: "oversized denim jacket in mid blue",
    gender: "men",
    category: "clothing",
    subcategory: "jackets",
    inr: 2199, usd: 38,
    emoji: "🧥",
    img: "men-denim-jacket",
    colours: ["#3d5a80", "#1c2e4a"],
    description:
      "Heavyweight denim with an oversized fit, button front and classic chest pockets.",
    composition: "100% cotton denim, 13oz",
  }),

  // ---------------- MEN / SHOES ----------------
  p({
    name: "court low sneakers in white",
    gender: "men",
    category: "shoes",
    subcategory: "sneakers",
    inr: 1999, usd: 35,
    emoji: "👟",
    img: "men-sneaker-white",
    colours: ["#ffffff", "#111111", "#5b6470"],
    sellingFast: true,
    description:
      "Clean court styling in a cushioned leather sneaker. Perforated panels, gum-tinted sole.",
    composition: "Leather upper, rubber sole",
  }),
  p({
    name: "running trainers in black with volt accent",
    gender: "men",
    category: "shoes",
    subcategory: "sneakers",
    inr: 2499, usd: 40,
    emoji: "👟",
    img: "men-sneaker-black",
    colours: ["#111111", "#c7f03c", "#ffffff"],
    newIn: true,
    description:
      "Daily-mile cushioning with a breathable knit upper and a responsive midsole.",
    composition: "Knit upper, EVA midsole, rubber outsole",
  }),
  p({
    name: "retro suede trainers in grey",
    gender: "men",
    category: "shoes",
    subcategory: "sneakers",
    inr: 2199, usd: 38,
    emoji: "👟",
    img: "men-sneaker-grey",
    colours: ["#9aa3ad", "#111111", "#c0392b"],
    description:
      "Vintage runner lines, premium suede and a classic gum sole. A timeless throw-on.",
    composition: "Suede upper, rubber sole",
  }),
  p({
    name: "lightweight slides in black",
    gender: "men",
    category: "shoes",
    subcategory: "sandals",
    inr: 449, usd: 8,
    emoji: "🩴",
    img: "men-slides-black",
    colours: ["#111111", "#ffffff"],
    description:
      "Featherlight EVA slides with a contoured footbed. Gym, shower, errands, done.",
    composition: "100% EVA",
  }),
  p({
    name: "cushioned flip flops in navy",
    gender: "men",
    category: "shoes",
    subcategory: "sandals",
    inr: 399, usd: 7,
    emoji: "🩴",
    img: "men-flipflops-navy",
    colours: ["#1c2e4a", "#111111"],
    description: "Soft-cushion flip flops with quick-dry straps for everyday ease.",
    composition: "EVA upper and sole",
  }),

  // ---------------- MEN / ACCESSORIES ----------------
  p({
    name: "6-panel baseball cap in black",
    gender: "men",
    category: "accessories",
    subcategory: "caps",
    inr: 449, usd: 8,
    emoji: "🧢",
    img: "men-cap-black",
    colours: ["#111111", "#5b6470", "#7c1f2b"],
    sellingFast: true,
    description:
      "An everyday staple. Curved brim, adjustable strap and an embroidered logo.",
    composition: "100% cotton twill",
  }),
  p({
    name: "bucketed street cap in khaki",
    gender: "men",
    category: "accessories",
    subcategory: "caps",
    inr: 499, usd: 9,
    emoji: "🧢",
    img: "men-cap-khaki",
    colours: ["#a8987a", "#111111"],
    description: "Reworked bucket cap with a deep crown and tonal stitch detail.",
    composition: "100% cotton",
  }),
  p({
    name: "nylon waist bag in black",
    gender: "men",
    category: "accessories",
    subcategory: "bags",
    inr: 899, usd: 16,
    emoji: "🎒",
    img: "men-waistbag-black",
    colours: ["#111111", "#5b6470"],
    description: "Compact cross-body waist bag with padded back panel and phone pocket.",
    composition: "100% nylon, water-repellent",
  }),
  p({
    name: "classic belt in tan",
    gender: "men",
    category: "accessories",
    subcategory: "belts",
    inr: 599, usd: 11,
    emoji: "🪢",
    img: "men-belt-tan",
    colours: ["#c19a6b", "#111111"],
    description: "Full-grain leather belt with a brushed metal buckle. One width, all fits.",
    composition: "Genuine leather",
  }),
  p({
    name: "retro round sunglasses in tortoise",
    gender: "men",
    category: "accessories",
    subcategory: "sunglasses",
    inr: 799, usd: 14,
    compareAtInr: 999, compareAtUsd: 18,
    emoji: "🕶️",
    img: "men-sunglasses-tortoise",
    colours: ["#7b5a2d", "#111111"],
    description: "Retro round frames with UV400 lenses and a hard case.",
    composition: "Acetate frame, UV400 polycarbonate lenses",
  }),

  // ---------------- WOMEN / TOPS ----------------
  p({
    name: "ribbed fitted top in black",
    gender: "women",
    category: "clothing",
    subcategory: "tops",
    inr: 449, usd: 8,
    emoji: "👚",
    img: "women-top-ribbed-black",
    colours: ["#111111", "#ffffff", "#b56576"],
    sellingFast: true,
    description: "A second-skin ribbed top with a square neck and body-hugging fit.",
    composition: "95% cotton, 5% elastane",
  }),
  p({
    name: "oversized graphic tee in off white",
    gender: "women",
    category: "clothing",
    subcategory: "tops",
    inr: 499, usd: 9,
    emoji: "👚",
    img: "women-tee-offwhite",
    colours: ["#f6f3ef", "#111111"],
    description: "Slouchy graphic tee with a dropped shoulder and vintage wash.",
    composition: "100% cotton",
  }),
  p({
    name: "crop top with ruching in white",
    gender: "women",
    category: "clothing",
    subcategory: "tops",
    inr: 549, usd: 9,
    emoji: "👚",
    img: "women-top-crop-white",
    colours: ["#ffffff", "#111111", "#e8d8de"],
    newIn: true,
    description: "Sweetheart crop with side ruching for a flattering, easy fit.",
    composition: "92% polyester, 8% elastane",
  }),

  // ---------------- WOMEN / DRESSES ----------------
  p({
    name: "satin slip dress in champagne",
    gender: "women",
    category: "clothing",
    subcategory: "dresses",
    inr: 1899, usd: 33,
    emoji: "👗",
    img: "women-dress-satin-champagne",
    colours: ["#e5d6b8", "#111111"],
    sellingFast: true,
    description: "Liquid satin slip dress with adjustable straps and a bias-cut drape.",
    composition: "100% polyester satin",
  }),
  p({
    name: "everyday mini dress in black",
    gender: "women",
    category: "clothing",
    subcategory: "dresses",
    inr: 1499, usd: 27,
    emoji: "👗",
    img: "women-dress-mini-black",
    colours: ["#111111", "#7c1f2b", "#ffffff"],
    description: "The black mini you'll reach for every time. Ribbed knit, easy A-line.",
    composition: "95% cotton, 5% elastane",
  }),
  p({
    name: "floral midi dress in blue",
    gender: "women",
    category: "clothing",
    subcategory: "dresses",
    inr: 1699, usd: 30,
    compareAtInr: 1999, compareAtUsd: 35,
    emoji: "👗",
    img: "women-dress-midi-navy",
    colours: ["#9fc1d9", "#b56576"],
    description: "Flowy midi with a smocked bodice and soft floral print.",
    composition: "100% viscose",
  }),

  // ---------------- WOMEN / HOODIES ----------------
  p({
    name: "cozy oversized hoodie in lilac",
    gender: "women",
    category: "clothing",
    subcategory: "hoodies-sweatshirts",
    inr: 1299, usd: 24,
    emoji: "🧥",
    img: "women-hoodie-navy",
    colours: ["#d9c8e3", "#111111", "#f6f3ef"],
    description: "Cloud-soft oversized hoodie with a kangaroo pocket and chunky cuffs.",
    composition: "75% cotton, 25% polyester",
  }),
  p({
    name: "cropped crew sweatshirt in cream",
    gender: "women",
    category: "clothing",
    subcategory: "hoodies-sweatshirts",
    inr: 1099, usd: 20,
    emoji: "🧥",
    img: "women-crew-cream",
    colours: ["#f2e8d5", "#111111"],
    newIn: true,
    description: "Cropped and cosy crewneck with ribbed hem for a flattering cut.",
    composition: "70% cotton, 30% polyester",
  }),

  // ---------------- WOMEN / LEGGINGS & JOGGERS ----------------
  p({
    name: "high waist sculpt leggings in black",
    gender: "women",
    category: "clothing",
    subcategory: "leggings-joggers",
    inr: 899, usd: 16,
    emoji: "🩳",
    img: "women-leggings-black",
    colours: ["#111111", "#5b6470"],
    sellingFast: true,
    description: "Squat-proof sculpt leggings with a high waistband and hidden pocket.",
    composition: "78% nylon, 22% elastane",
  }),
  p({
    name: "wide leg joggers in grey",
    gender: "women",
    category: "clothing",
    subcategory: "leggings-joggers",
    inr: 999, usd: 18,
    emoji: "👖",
    img: "women-jogger-wide-grey",
    colours: ["#9aa3ad", "#111111"],
    description: "Comfort joggers with a relaxed wide leg and soft brushed back.",
    composition: "70% cotton, 30% polyester",
  }),
  p({
    name: "biker shorts in black",
    gender: "women",
    category: "clothing",
    subcategory: "leggings-joggers",
    inr: 599, usd: 11,
    emoji: "🩳",
    img: "women-bikershorts-black",
    colours: ["#111111", "#5b6470", "#b56576"],
    description: "Stretch biker shorts that stay put from studio to street.",
    composition: "78% nylon, 22% elastane",
  }),

  // ---------------- WOMEN / SHOES ----------------
  p({
    name: "chunky platform trainers in white",
    gender: "women",
    category: "shoes",
    subcategory: "sneakers",
    inr: 2499, usd: 40,
    emoji: "👟",
    img: "women-trainer-chunky-white",
    colours: ["#ffffff", "#111111"],
    sellingFast: true,
    description: "Towering chunky sole, low-top profile, all-day cushion.",
    composition: "Leather upper, EVA sole",
  }),
  p({
    name: "low top retro trainers in beige",
    gender: "women",
    category: "shoes",
    subcategory: "sneakers",
    inr: 2199, usd: 38,
    emoji: "👟",
    img: "women-trainer-retro-beige",
    colours: ["#e9dcc3", "#111111", "#b56576"],
    description: "Retro runner styling with a tonal beige palette and gum outsole.",
    composition: "Suede + mesh upper, rubber sole",
  }),
  p({
    name: "sporty knit trainers in pink",
    gender: "women",
    category: "shoes",
    subcategory: "sneakers",
    inr: 1999, usd: 35,
    emoji: "👟",
    img: "women-trainer-knit-pink",
    colours: ["#e8b4c2", "#ffffff"],
    newIn: true,
    description: "Featherlight knit trainers with a cushioned sock-fit collar.",
    composition: "Knit upper, EVA midsole",
  }),
  p({
    name: "minimal slides in white",
    gender: "women",
    category: "shoes",
    subcategory: "sandals",
    inr: 449, usd: 8,
    emoji: "🩴",
    img: "women-slides-white",
    colours: ["#ffffff", "#111111", "#e8b4c2"],
    description: "Clean white slides with a soft padded footbed.",
    composition: "100% EVA",
  }),

  // ---------------- WOMEN / ACCESSORIES ----------------
  p({
    name: "soft bucket hat in beige",
    gender: "women",
    category: "accessories",
    subcategory: "caps",
    inr: 499, usd: 9,
    emoji: "🧢",
    img: "women-cap-neutral",
    colours: ["#e9dcc3", "#111111"],
    description: "A soft, crushable bucket hat for every sunny-day plan.",
    composition: "100% cotton",
  }),
  p({
    name: "crossbody bag in black",
    gender: "women",
    category: "accessories",
    subcategory: "bags",
    inr: 999, usd: 18,
    emoji: "🎒",
    img: "women-crossbody-black",
    colours: ["#111111", "#c19a6b"],
    sellingFast: true,
    description: "Compact crossbody with an adjustable strap and card slots.",
    composition: "Polyurethane",
  }),
  p({
    name: "oversized sunglasses in black",
    gender: "women",
    category: "accessories",
    subcategory: "sunglasses",
    inr: 849, usd: 15,
    emoji: "🕶️",
    img: "women-sunglasses-black",
    colours: ["#111111", "#7b5a2d"],
    description: "Celebrity-sized frames with gradient UV400 lenses.",
    composition: "Acetate frame, UV400 lenses",
  }),
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((prod) => prod.slug === slug);
}

export function getProductsByCategory(
  gender: Gender,
  category?: string,
  subcategory?: string
): Product[] {
  return products.filter(
    (prod) =>
      prod.gender === gender &&
      (!category || prod.category === category) &&
      (!subcategory || prod.subcategory === subcategory)
  );
}

export const menCategories: { key: string; label: string }[] = [
  { key: "all", label: "All Men's" },
  { key: "t-shirts", label: "T-Shirts & Vests" },
  { key: "hoodies-sweatshirts", label: "Hoodies & Sweatshirts" },
  { key: "joggers-trousers", label: "Joggers & Trousers" },
  { key: "shorts", label: "Shorts" },
  { key: "jackets", label: "Jackets" },
  { key: "sneakers", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
];

export const womenCategories: { key: string; label: string }[] = [
  { key: "all", label: "All Women's" },
  { key: "tops", label: "Tops" },
  { key: "dresses", label: "Dresses" },
  { key: "hoodies-sweatshirts", label: "Hoodies & Sweatshirts" },
  { key: "leggings-joggers", label: "Leggings & Joggers" },
  { key: "sneakers", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
];

export function listSubcategories(
  gender: Gender,
  category?: string
): string[] {
  return Array.from(
    new Set(
      products
        .filter(
          (prod) => prod.gender === gender && (!category || prod.category === category)
        )
        .map((prod) => prod.subcategory)
    )
  );
}
