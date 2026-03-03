export interface Product {
  id: string;
  title: string;
  price: number;
  sizeTag: string;
  img: string;
  gallery: string[];
  tag: string;
  description: string;
  scentNotes: {
    top: string;
    mid: string;
    base: string;
  };
  burnTime: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "olive-fig",
    title: "Olive & Fig",
    price: 32,
    sizeTag: "col-span-1 md:col-span-2 row-span-2",
    img: "/images/collection_jars.png",
    gallery: ["/images/collection_jars.png", "/images/hero_candle.png"],
    tag: "Best Seller",
    category: "Signature Candles",
    description: "A Mediterranean escape. The green, earthy aroma of crushed olive leaves rounded out by the deep, jammy sweetness of ripe black figs. Perfect for late summer evenings.",
    scentNotes: {
      top: "Bergamot, Olive Leaf",
      mid: "Black Fig, Geranium",
      base: "Vetiver, Oakmoss"
    },
    burnTime: "45-50 hours"
  },
  {
    id: "sandalwood-rose",
    title: "Sandalwood Rose",
    price: 36,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/hero_candle.png",
    gallery: ["/images/hero_candle.png", "/images/collection_jars.png"],
    tag: "New",
    category: "Signature Candles",
    description: "A sophisticated take on a classic floral. Warm, creamy Australian sandalwood anchors the delicate, powdery softness of blooming damask rose.",
    scentNotes: {
      top: "Violet Leaf, Pink Peppercorn",
      mid: "Damask Rose, Iris",
      base: "Sandalwood, Amber"
    },
    burnTime: "45-50 hours"
  },
  {
    id: "matcha-mint",
    title: "Matcha Mint",
    price: 28,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/process_finish.png",
    gallery: ["/images/process_finish.png"],
    tag: "",
    category: "Signature Candles",
    description: "An invigorating morning ritual. Earthy, ceremonial-grade matcha blended with crisp peppermint and a touch of sweet vanilla milk.",
    scentNotes: {
      top: "Crushed Peppermint",
      mid: "Matcha Powder, Green Tea",
      base: "Vanilla Bean, White Musk"
    },
    burnTime: "40-45 hours"
  },
  {
    id: "starter-kit",
    title: "The Starter Kit",
    price: 85,
    sizeTag: "col-span-1 md:col-span-2 row-span-2",
    img: "/images/collection_kit.png",
    gallery: ["/images/collection_kit.png"],
    tag: "Kit",
    category: "DIY Kits",
    description: "Everything you need to pour your first luxury candle at home. Includes natural soy wax, essential oils, cotton wicks, and our signature ceramic vessel.",
    scentNotes: {
      top: "Customize your own",
      mid: "Customize your own",
      base: "Customize your own"
    },
    burnTime: "N/A"
  },
  {
    id: "bergamot-woods",
    title: "Bergamot Woods",
    price: 32,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/process_sourced.png",
    gallery: ["/images/process_sourced.png"],
    tag: "",
    category: "Signature Candles",
    description: "A walk through a citrus grove at dawn. Bright, zesty Calabrian bergamot mellowed by the grounding presence of cedar and dark woods.",
    scentNotes: {
      top: "Calabrian Bergamot, Lemon Zest",
      mid: "Jasmine, Black Pepper",
      base: "Cedarwood, Patchouli"
    },
    burnTime: "45-50 hours"
  },
  {
    id: "soy-wax-flakes",
    title: "Eco Soy Wax",
    price: 18,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/collection_materials.png",
    gallery: ["/images/collection_materials.png"],
    tag: "Supply",
    category: "Raw Materials",
    description: "100% natural, clean-burning soy wax flakes. Sustainably sourced and perfect for refilling your Nivati vessels.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
    burnTime: "Yields 2 standard candles"
  }
];
