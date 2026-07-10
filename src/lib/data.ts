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
  category: string | string[];
}

export const products: Product[] = [
  // ── Signature Jar Candles (Best Sellers) ───────────────────────
  {
    id: "teddy-bear-signature",
    title: "Teddy Bear Large",
    price: 649,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_3917.JPG",
    gallery: ["/images/IMG_3917.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "An adorable large teddy bear candle, ideal for children's rooms or as a charming gift. Crafted with care and scented with warm vanilla.",
    scentNotes: {
      top: "Vanilla",
      mid: "Honey, Cream",
      base: "Tonka Bean, Musk"
    },
  },
  {
    id: "cake-signature",
    title: "Cake",
    price: 699,
    sizeTag: "col-span-1 md:col-span-2 row-span-2",
    img: "/images/Generated Image November 07, 2025 - 4.jpg",
    gallery: ["/images/Generated Image November 07, 2025 - 4.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A beautifully detailed cake candle with frosting swirls and decorative elements. Too pretty to light, but scented with sweet vanilla cake fragrance.",
    scentNotes: {
      top: "Vanilla, Sugar",
      mid: "Buttercream, Caramel",
      base: "Tonka Bean, Musk"
    },
  },
  {
    id: "fairy-house-signature",
    title: "Fairy House",
    price: 599,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_1078.jpg",
    gallery: ["/images/IMG_1078.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A magical fairy house candle with intricate architectural details. Perfect for creating an enchanted atmosphere in any room.",
    scentNotes: {
      top: "Floral, Bergamot",
      mid: "Rose, Lily, Honeysuckle",
      base: "Musk, Cedarwood"
    },
  },
  {
    id: "strawberry-jar-signature",
    title: "Strawberry Jar",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4332.jpg",
    gallery: ["/images/IMG_4332.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A delightfully fruity strawberry candle in premium jar format. Sweet and indulgent fragrance that fills your space.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Berry, Cream",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "rainbow-jar-signature",
    title: "Rainbow Jar",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4077.jpg",
    gallery: ["/images/IMG_4077.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A vibrant multi-colored rainbow candle with layered fragrances. Visually stunning and aromatic creation.",
    scentNotes: {
      top: "Citrus, Berry, Florals",
      mid: "Mixed Fruit Notes",
      base: "Musk, Cedarwood"
    },
  },

  // ── Concrete Jar Candles ───────────────────────────────────────
  {
    id: "concrete-moon",
    title: "Moon Candle",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4550.jpg",
    gallery: ["/images/IMG_4550.jpg"],
    tag: "",
    category: ["Signature Candles", "Concrete Jar Candles"],
    description: "A stunning moon-shaped concrete jar candle. Perfect for celestial lovers and modern minimalist spaces. Hand-poured with premium soy wax.",
    scentNotes: {
      top: "Moonflower, Bergamot",
      mid: "Night-blooming Jasmine",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "concrete-starfish",
    title: "Starfish Candle",
    price: 649,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4075.jpg",
    gallery: ["/images/IMG_4075.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A charming starfish-shaped concrete jar candle with ocean-inspired aesthetics. Brings coastal vibes to any space.",
    scentNotes: {
      top: "Sea Salt, Citrus",
      mid: "Ocean Mist, Driftwood",
      base: "Cedarwood, Amber"
    },
  },
  {
    id: "starfish-name",
    title: "Starfish Name Candle",
    price: 699,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4518.jpg",
    gallery: ["/images/IMG_4518.jpg"],  
    tag: "Customizable",
    category: "Concrete Jar Candles",
    description: "Our signature starfish concrete candle, now personalizable. Add your name or a special message to this oceanic craft piece.",
    scentNotes: {
      top: "Sea Salt, Citrus",
      mid: "Ocean Mist, Driftwood",
      base: "Cedarwood, Amber"
    },
  },
  {
    id: "concrete-bowl",
    title: "Mini Flower Bowl Candle",
    price: 799,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4079.jpg",
    gallery: ["/images/IMG_4079.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "An elegant bowl-shaped concrete vessel filled with premium scented wax. A functional art piece for your home.",
    scentNotes: {
      top: "Lavender, Eucalyptus",
      mid: "Sage, Mint",
      base: "Cedarwood, Vetiver"
    },
  },
  {
    id: "bowl-candle",
    title: "Name Bowl Candle",
    price: 799,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4141.jpg",
    gallery: ["/images/IMG_4141.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A timeless bowl-shaped candle in concrete finish. Simple elegance with premium scent blends for everyday enjoyment.",
    scentNotes: {
      top: "Vanilla, Amber",
      mid: "Sweet Floral, Rose",
      base: "Musk, Tonka"
    },
  },
  {
    id: "rose-bowl-candle",
    title: "Rose Bowl Candle",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4086.jpg",
    gallery: ["/images/IMG_4086.jpg"],
    tag: "",
    category: ["Signature Candles", "Concrete Jar Candles"],
    description: "A romantic rose-infused bowl candle in concrete finish. Perfect for creating an intimate and elegant atmosphere in any room.",
    scentNotes: {
      top: "Fresh Rose, Pink Peppercorn",
      mid: "Peony, Floral Blend",
      base: "Sandalwood, Musk"
    },
  },
  {
    id: "sea-theme-bowl-candle",
    title: "Sea Theme Bowl Candle",
    price: 799,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4140.jpg",
    gallery: ["/images/IMG_4140.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A captivating ocean-inspired bowl candle with coastal charm. Brings the refreshing essence of the sea into your home with natural scent blends.",
    scentNotes: {
      top: "Sea Salt, Bergamot",
      mid: "Ocean Mist, Driftwood",
      base: "Cedarwood, Amber"
    },
  },
  {
    id: "concrete-three-layers",
    title: "Three Layers Jar Candle",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4070.PNG",
    gallery: ["/images/IMG_4070.PNG"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "Three distinct layers of scented wax in a concrete jar. A visual and aromatic journey in one candle.",
    scentNotes: {
      top: "Bergamot, Grapefruit",
      mid: "Floral Blend, Rose",
      base: "Sandalwood, Patchouli"
    },
  },
  {
    id: "concrete-grid-jar",
    title: "Grid Jar Candle",
    price: 649,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4138.jpg",
    gallery: ["/images/IMG_4138.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A geometric grid-patterned concrete jar with clean, modern lines. Perfect for contemporary interiors.",
    scentNotes: {
      top: "Lemon, Lime",
      mid: "White Tea, Green Apple",
      base: "Clean Linen, Musk"
    },
  },
  {
    id: "big-bowl-nest-candle",
    title: "Concrete Nest Candle",
    price: 1775,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4067.jpg",
    gallery: ["/images/IMG_4067.jpg"],
    tag: "",
    category: ["Signature Candles", "Concrete Jar Candles"],
    description: "A large nested bowl-style concrete jar candle. Perfect for statement pieces and creating dramatic ambiance.",
    scentNotes: {
      top: "Cedarwood, Vetiver",
      mid: "Sage, Floral",
      base: "Amber, Musk"
    },
  },
  {
    id: "large-bowl-candle",
    title: "Large Bowl Candle",
    price: 1995,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4069.jpg",
    gallery: ["/images/IMG_4069.jpg"],
    tag: "",
    category: ["Signature Candles", "Concrete Jar Candles"],
    description: "An expansive concrete bowl candle with premium scent. A luxurious focal point for any room.",
    scentNotes: {
      top: "Bergamot, Grapefruit",
      mid: "White Florals, Tea",
      base: "Cedarwood, Sandalwood"
    },
  },
  {
    id: "strawberry-bowl-candle",
    title: "Strawberry Bowl Candle",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4343.jpg",
    gallery: ["/images/IMG_4343.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A delightful strawberry-inspired bowl candle with fruity fragrance. Perfect for adding a pop of color and scent to your space.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Ripe Berry, Cream",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "tulip-bowl-candle",
    title: "Tulip Bowl Candle",
    price: 1299,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4342.jpg",
    gallery: ["/images/IMG_4342.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A botanical tulip-inspired bowl candle with elegant floral notes. Perfect for spring and celebrating nature's beauty.",
    scentNotes: {
      top: "Fresh Tulip, Bergamot",
      mid: "Floral Blend, Rose",
      base: "Cedarwood, Musk"
    },
  },
  {
    id: "heart-bowl-concrete",
    title: "Heart Bowl Candle",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4643.jpg",
    gallery: ["/images/IMG_4643.jpg"],
    tag: "",
    category: "Concrete Jar Candles",
    description: "A beautifully crafted heart-shaped concrete bowl candle. Perfect for romantic occasions or as a heartfelt gift to someone special.",
    scentNotes: {
      top: "Vanilla, Rose",
      mid: "Jasmine, Ylang-Ylang",
      base: "Sandalwood, Musk"
    },
  },

  // ── Basic Jar Candles ───────────────────────────────────────────
  {
    id: "basic-small-100ml",
    title: "Small 100ml",
    price: 599,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4104.jpg",
    gallery: ["/images/IMG_4104.jpg"],
    tag: "",
    category: "Basic Jar Candles",
    description: "Perfect entry-sized candle in our classic jar. 100ml of pure scented luxury, ideal for testing fragrances or gifting.",
    scentNotes: {
      top: "Citrus, Bergamot",
      mid: "Floral, Rose",
      base: "Musk, Woods"
    },
  },
  {
    id: "sunflower-jar-with-lid",
    title: "Sunflower Jar with Lid",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4137.jpg",
    gallery: ["/images/IMG_4137.jpg"],
    tag: "",
    category: "Basic Jar Candles",
    description: "A beautiful basic jar candle with a protective lid featuring our signature sunflower motif. 200ml of premium scented wax.",
    scentNotes: {
      top: "Sunflower, Lemon",
      mid: "Summer Florals, Honey",
      base: "White Musk, Amber"
    },
  },
  {
    id: "hidden-message-basic",
    title: "Hidden Message Jar Candle",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4346.jpg",
    gallery: ["/images/IMG_4346.jpg"],
    tag: "Customizable",
    category: "Basic Jar Candles",
    description: "A unique jar candle with a secret message hidden beneath the wax. Reveal a special note as the candle burns.",
    scentNotes: {
      top: "Bergamot, Lavender",
      mid: "Jasmine, Ylang-Ylang",
      base: "Sandalwood, Musk"
    },
  },
  {
    id: "hot-coffee-basic",
    title: "Hot Coffee Candle",
    price: 849,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4336.jpg",
    gallery: ["/images/IMG_4336.jpg"],
    tag: "",
    category: "Basic Jar Candles",
    description: "The rich, comforting aroma of freshly brewed coffee in our classic jar format. Perfect for morning or workspace ambiance.",
    scentNotes: {
      top: "Roasted Coffee Bean",
      mid: "Caramel, Chocolate",
      base: "Vanilla, Cream"
    },
  },
  {
    id: "basic-medium-160ml",
    title: "Medium 160ml",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_5670.jpg",
    gallery: ["/images/IMG_5670.jpg"],
    tag: "",
    category: "Basic Jar Candles",
    description: "Our most popular size. 160ml of premium scented wax in a beautiful glass jar. Perfect balance of size and burn time.",
    scentNotes: {
      top: "Lavender, Lemon",
      mid: "Chamomile, Herb",
      base: "Cedarwood, Vetiver"
    },
  },
  {
    id: "basic-large-200ml",
    title: "Large 200ml",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4104.jpg",
    gallery: ["/images/IMG_4104.jpg"],
    tag: "",
    category: "Basic Jar Candles",
    description: "Our generous large size with 200ml of luxurious scented wax. Extended burn time and maximum fragrance distribution.",
    scentNotes: {
      top: "Vanilla, Caramel",
      mid: "Cinnamon, Spice",
      base: "Sandalwood, Amber"
    },
  },

  // ── Mould Candles ──────────────────────────────────────────────
  {
    id: "astronaut",
    title: "Astronaut",
    price: 499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_3918.JPG",
    gallery: ["/images/IMG_3918.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "A whimsical astronaut-shaped candle perfect for space enthusiasts. Hand-poured with premium soy wax, this decorative piece doubles as a functional candle.",
    scentNotes: {
      top: "Citrus, Bergamot",
      mid: "Lavender, Sage",
      base: "Sandalwood, Musk"
    },
  },
  {
    id: "rose-peony-small",
    title: "Rose Peony Small",
    price: 299,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4385.jpg",
    gallery: ["/images/IMG_4385.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A delicate small rose and peony blend in candle form. Perfect for adding elegance to any shelf or desk. Lightly scented with floral essences.",
    scentNotes: {
      top: "Rose, Peony",
      mid: "Lily, Geranium",
      base: "Musk, Soft Woods"
    },
  },
  {
    id: "rose-peony-large",
    title: "Rose Peony Large",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4371.jpg",
    gallery: ["/images/IMG_4371.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A generous-sized rose and peony candle with intricate petal detailing. Makes a stunning centerpiece while filling your space with romantic floral notes.",
    scentNotes: {
      top: "Rose, Peony",
      mid: "Lily, Geranium",
      base: "Musk, Soft Woods"
    },
  },
  {
    id: "rose-bloom-mould",
    title: "Rose Bloom",
    price: 349,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4315.jpg",
    gallery: ["/images/IMG_4315.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A stunning hand-sculpted rose candle with layered petals. Perfect as a gift or decorative centerpiece with real rose essence fragrance.",
    scentNotes: {
      top: "Rose Petals, Lavender",
      mid: "Peony, Pink Peppercorn",
      base: "Soft Musk, Tonka"
    },
  },
  {
    id: "rose-bloom-ii",
    title: "Rose Bloom II",
    price: 349,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4316.jpg",
    gallery: ["/images/IMG_4316.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "An alternative rose design with deeper petal sculpting. A premium decorative candle that captures the essence of a blooming garden.",
    scentNotes: {
      top: "Red Rose, Raspberry",
      mid: "Damask Rose, Iris",
      base: "Sandalwood, Amber"
    },
  },
  {
    id: "tulip-with-stem",
    title: "Tulip with Stem",
    price: 449,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_1476 2.jpg",
    gallery: ["/images/IMG_1476 2.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "An elegant tulip candle complete with a detailed stem. Brings spring charm to any space with its graceful botanical design.",
    scentNotes: {
      top: "Fresh Florals, Bergamot",
      mid: "Tulip, Green Stems",
      base: "Cedarwood, Vetiver"
    },
  },
  {
    id: "tulip-flower",
    title: "Tulip Flower",
    price: 249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_3246.JPG",
    gallery: ["/images/IMG_3246.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "A compact tulip-shaped candle perfect for small spaces. Minimal yet elegant, capturing the simple beauty of spring flowers.",
    scentNotes: {
      top: "Fresh Florals",
      mid: "Tulip Petals",
      base: "Green Moss, Cedarwood"
    },
  },
  {
    id: "bubbles",
    title: "Bubbles",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4087.JPG",
    gallery: ["/images/IMG_4087.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "A playful bubble-textured candle with a modern aesthetic. Each sphere is carefully crafted for a unique visual and tactile experience.",
    scentNotes: {
      top: "Citrus Zest",
      mid: "White Tea, Mint",
      base: "Linen, Musk"
    },
  },
  {
    id: "bubble-pillar",
    title: "Bubble Pillar",
    price: 499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4100.jpg",
    gallery: ["/images/IMG_4100.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A vertical arrangement of bubble-textured candle for a contemporary look. Ideal for creating sculptural interest on shelves or tables.",
    scentNotes: {
      top: "Grapefruit, Lemon",
      mid: "White Pepper, Cardamom",
      base: "Driftwood, Ambroxan"
    },
  },
  {
    id: "spiral",
    title: "Spiral",
    price: 299,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_3883.JPG",
    gallery: ["/images/IMG_3883.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "A mesmerizing spiral-patterned candle with a minimalist design. Perfect for adding kinetic visual interest to any room.",
    scentNotes: {
      top: "Eucalyptus, Mint",
      mid: "Bamboo, Aloe",
      base: "Cedar, Clean Linen"
    },
  },
  {
    id: "christmas-tree",
    title: "Christmas Tree",
    price: 499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_9999.jpg",
    gallery: ["/images/IMG_9999.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A festive Christmas tree-shaped candle with intricate layering. Perfect for holiday decor, scented with warm seasonal spices.",
    scentNotes: {
      top: "Pine, Fir Needle",
      mid: "Cinnamon, Clove",
      base: "Cedarwood, Amber"
    },
  },
  {
    id: "mini-flower",
    title: "Mini Flower",
    price: 149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_3248.JPG",
    gallery: ["/images/IMG_3248.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "Tiny flower-shaped candle perfect for decorative arrangements or small gifts. Sweet and charming with delicate floral scent.",
    scentNotes: {
      top: "Floral Blend",
      mid: "Rose, Lily",
      base: "Soft Musk"
    },
  },
  {
    id: "sunflower",
    title: "Sunflower",
    price: 149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4101.jpg",
    gallery: ["/images/IMG_4101.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A cheerful sunflower-shaped candle with bright golden tones. Spreads warmth and joy with its sunny disposition and citrus scent.",
    scentNotes: {
      top: "Lemon, Orange",
      mid: "Sunflower, Heliotrope",
      base: "Vanilla, Honey"
    },
  },
  {
    id: "daisy",
    title: "Daisy Flower",
    price: 149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4092.JPG",
    gallery: ["/images/IMG_4092.JPG"],
    tag: "",
    category: "Mould Candles",
    description: "A simple yet elegant daisy candle with clean lines. Perfect for minimalist decor and scented with fresh, herbaceous notes.",
    scentNotes: {
      top: "Fresh Green, Grapefruit",
      mid: "Daisy, Chamomile",
      base: "Green Moss, Musk"
    },
  },
  {
    id: "cactus-1",
    title: "Cactus 1",
    price: 449,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4099.jpg",
    gallery: ["/images/IMG_4099.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A charming cactus-shaped candle capturing the essence of desert botanicals. Minimalist design with a spicy, warm fragrance.",
    scentNotes: {
      top: "Cactus Flower, Bergamot",
      mid: "Arid Spices",
      base: "Sandalwood, Patchouli"
    },
  },
  {
    id: "cactus-2",
    title: "Cactus 2",
    price: 199,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4308.jpg",
    gallery: ["/images/IMG_4308.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A smaller cactus variation with spiny texture details. A playful take on desert aesthetics with refreshing herbal notes.",
    scentNotes: {
      top: "Cactus, Mint",
      mid: "Green Pepper, Aloe",
      base: "Cedarwood, Vetiver"
    },
  },
  {
    id: "cactus-3",
    title: "Cactus 3",
    price: 149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4312.jpg",
    gallery: ["/images/IMG_4312.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A compact cactus candle, perfect for small desks or shelves. Lightly scented with cool, fresh desert botanicals.",
    scentNotes: {
      top: "Cactus, Citrus",
      mid: "Eucalyptus, Sage",
      base: "Dry Woods"
    },
  },
  {
    id: "cactus-4",
    title: "Cactus 4",
    price: 119,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4314.jpg",
    gallery: ["/images/IMG_4314.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A miniature cactus candle, ideal for gifting or decoration. Simple design with subtle botanical scent notes.",
    scentNotes: {
      top: "Fresh Green",
      mid: "Herbal Notes",
      base: "Soft Woods"
    },
  },
  {
    id: "couple",
    title: "Couple",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4145.jpg",
    gallery: ["/images/IMG_4145.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A romantic pair candle depicting two figures together. Perfect for anniversaries, weddings, or celebrating love with your special someone.",
    scentNotes: {
      top: "Rose, Jasmine",
      mid: "Gardenia, Patchouli",
      base: "Sandalwood, Amber"
    },
  },
  {
    id: "strawberry",
    title: "Strawberry",
    price: 119,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4204.jpg",
    gallery: ["/images/IMG_4204.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A delightful strawberry-shaped candle with a juicy, fruity aroma. Small and sweet, perfect for adding a pop of color and scent.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Ripe Berry, Cream",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "acanthus-pillar-candle",
    title: "Acanthus Pillar Candle",
    price: 349,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4148.jpg",
    gallery: ["/images/IMG_4148.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "An elegant acanthus-leaf inspired pillar candle with classical architecture aesthetics. A sophisticated decorative piece with premium scent.",
    scentNotes: {
      top: "Bergamot, Lavender",
      mid: "Rose, Floral Blend",
      base: "Cedarwood, Musk"
    },
  },
  {
    id: "empire-pillar-candle",
    title: "Empire Pillar Candle",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4068.jpg",
    gallery: ["/images/IMG_4068.jpg"],
    tag: "",
    category: "Mould Candles",
    description: "A grand empire-style pillar candle with timeless elegance. Perfect for creating a luxurious ambiance in any space.",
    scentNotes: {
      top: "Citrus, Bergamot",
      mid: "White Florals, Tea",
      base: "Sandalwood, Amber"
    },
  },

  // ── Premium Jar Candles ────────────────────────────────────────
  {
    id: "cactus-jar",
    title: "Cactus Jar",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4133.jpg",
    gallery: ["/images/IMG_4133.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A premium jar candle with cactus-inspired design and fragrance. Brings desert aesthetics to luxury home spaces.",
    scentNotes: {
      top: "Cactus Flower, Citrus",
      mid: "Dry Herbs, Aloe",
      base: "Sandalwood, Patchouli"
    },
  },
  {
    id: "daisy-jar",
    title: "Daisy Jar",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4089.jpg",
    gallery: ["/images/IMG_4089.jpg"],
    tag: "",
    category: "Signature Candles",
    description: "A beautiful daisy-themed premium jar candle with fresh floral notes. Perfect for spring and summer.",
    scentNotes: {
      top: "Fresh Florals, Bergamot",
      mid: "Daisy, Chamomile",
      base: "Green Moss, Musk"
    },
  },
  {
    id: "berry-wine",
    title: "Berry Wine",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4095.jpg",
    gallery: ["/images/IMG_4095.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A luxurious blend of berry and wine notes in our premium jar format. Sophisticated and deeply aromatic.",
    scentNotes: {
      top: "Blackberry, Raspberry",
      mid: "Red Wine, Berry",
      base: "Cedarwood, Amber"
    },
  },
  {
    id: "strawberry-wine-premium",
    title: "Strawberry Wine",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4335.jpg",
    gallery: ["/images/IMG_4335.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A delightful strawberry and wine aromatic blend in our premium jar. Sweet, sophisticated, and perfect for special occasions.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Red Wine, Rose",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "daisy-wine",
    title: "Daisy Wine",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4083.jpg",
    gallery: ["/images/IMG_4083.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "An elegant combination of delicate daisy and rich wine aromatics. A premium offering for the discerning customer.",
    scentNotes: {
      top: "Daisy, Floral",
      mid: "Wine, Berry Notes",
      base: "Sandalwood, Musk"
    },
  },
  {
    id: "sunflower-jar",
    title: "Sunflower Jar",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4093.jpg",
    gallery: ["/images/IMG_4093.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A bright and cheerful sunflower-themed premium jar candle. Infused with summery floral notes to brighten any room.",
    scentNotes: {
      top: "Sunflower, Lemon",
      mid: "Summer Florals, Honey",
      base: "White Musk, Amber"
    },
  },
  {
    id: "rose-jar-candle",
    title: "Rose Jar Candle",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4143.jpg",
    gallery: ["/images/IMG_4143.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A timeless rose-themed premium jar candle. Capturing the essence of a blooming garden with sophisticated floral layers.",
    scentNotes: {
      top: "Rose Petals, Bergamot",
      mid: "Red Rose, Geranium",
      base: "Velvet Musk, Sandalwood"
    },
  },
  {
    id: "couple-jar-candle",
    title: "Couple Jar Candle",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4091.jpg",
    gallery: ["/images/IMG_4091.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "An intimate and warm premium jar candle designed for shared spaces. A balanced blend of sweet and spicy notes.",
    scentNotes: {
      top: "Sweet Orange, Cinnamon",
      mid: "Vanilla, Warm Spices",
      base: "Patchouli, Amber"
    },
  },
  {
    id: "tree-jar-candle",
    title: "Tree Jar Candle",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4103.jpg",
    gallery: ["/images/IMG_4103.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A grounding, forest-inspired premium jar candle. Brings the serene experience of a wooded grove into your home.",
    scentNotes: {
      top: "Pine Needles, Eucalyptus",
      mid: "Cypress, Juniper",
      base: "Cedarwood, Moss"
    },
  },
  {
    id: "mini-flower-jar",
    title: "Mini Flower Jar",
    price: 1149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4082.jpg",
    gallery: ["/images/IMG_4082.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A delicate mini flower design in premium jar format. Perfect for adding subtle botanical beauty.",
    scentNotes: {
      top: "Mixed Florals",
      mid: "Lily, Rose, Peony",
      base: "Soft Musk, Tonka"
    },
  },
  {
    id: "tulip-jar",
    title: "Tulip Jar",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4330.jpg",
    gallery: ["/images/IMG_4330.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "An exquisite tulip-inspired premium candle with premium wax blend. A true luxury item for tulip lovers.",
    scentNotes: {
      top: "Tulip, Fresh Green",
      mid: "Spring Florals",
      base: "Cedarwood, Vetiver"
    },
  },
  {
    id: "tulip-stem-jar",
    title: "Tulip Stem Jar",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4142.jpg",
    gallery: ["/images/IMG_4142.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A botanical premium candle featuring tulip with detailed stem design. Elegant and refined.",
    scentNotes: {
      top: "Tulip, Bergamot",
      mid: "Green Stem, Herb",
      base: "Moss, Cedarwood"
    },
  },
  {
    id: "strawberry-jar",
    title: "Strawberry Jar",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4202.jpg",
    gallery: ["/images/IMG_4202.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A delightfully fruity strawberry candle in premium jar format. Sweet and indulgent fragrance.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Berry, Cream",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "dried-flower-jar",
    title: "Dried Flower Jar",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4078.jpg",
    gallery: ["/images/IMG_4078.jpg"],
    tag: "",
    category: "Premium Jar Candles",
    description: "A sophisticated dried flower design in premium candle format. Elegant botanical aesthetic.",
    scentNotes: {
      top: "Dried Florals, Lavender",
      mid: "Rose, Chamomile",
      base: "Tonka, Musk"
    },
  },

  // ── Gel & Soy Jar ──────────────────────────────────────────────
  {
    id: "iced-latte",
    title: "Iced Latte",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4136.jpg",
    gallery: ["/images/IMG_4136.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A refreshing iced latte-scented gel and soy candle. Perfect for coffee and cream lovers.",
    scentNotes: {
      top: "Cold Brew, Espresso",
      mid: "Cream, Vanilla",
      base: "Caramel, Musk"
    },
  },
  {
    id: "iced-strawberry",
    title: "Strawberry Iced Matcha",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4327.jpg",
    gallery: ["/images/IMG_4327.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A sweet iced strawberry gel and soy blend. Fruity and refreshing fragrance in candle form.",
    scentNotes: {
      top: "Fresh Strawberry",
      mid: "Berry Juice, Cream",
      base: "Vanilla, Sugar"
    },
  },
  {
    id: "iced-blueberry",
    title: "Blueberry Iced Matcha",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4325.jpg",
    gallery: ["/images/IMG_4325.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A smooth iced blueberry gel and soy candle. Perfect for berry enthusiasts.",
    scentNotes: {
      top: "Blueberry, Citrus",
      mid: "Berry, Cream",
      base: "Vanilla, Musk"
    },
  },
  {
    id: "heart-patches",
    title: "Heart Patches",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4085.jpg",
    gallery: ["/images/IMG_4085.jpg"],
    tag: "",
    category: "Signature Candles",
    description: "A romantic heart-patterned gel and soy candle. Perfect for love-themed occasions.",
    scentNotes: {
      top: "Rose, Peony",
      mid: "Floral Blend",
      base: "Musk, Vanilla"
    },
  },
  {
    id: "rose-bouquet-signature",
    title: "Rose Bouquet",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4084.jpg",
    gallery: ["/images/IMG_4084.jpg"],
    tag: "",
    category: "Signature Candles",
    description: "A beautiful bouquet of hand-sculpted roses in a signature concrete jar. A timeless floral masterpiece.",
    scentNotes: {
      top: "Rose Petals, Geranium",
      mid: "Peony, Rose Bloom",
      base: "Velvet Musk, Cedarwood"
    },
  },
  {
    id: "mix-flower-bouquet-signature",
    title: "Mix Flower Bouquet",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4545.jpg",
    gallery: ["/images/IMG_4545.jpg"],
    tag: "",
    category: "Signature Candles",
    description: "An elegant mix of various hand-sculpted flowers in our signature jar. A vibrant celebration of botanical beauty.",
    scentNotes: {
      top: "Mixed Florals, Bergamot",
      mid: "Lily, Jasmine, Lavender",
      base: "Soft Woods, Tonka"
    },
  },
  {
    id: "heart-burst",
    title: "Heart Burst",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4096.jpg",
    gallery: ["/images/IMG_4096.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "An explosive heart-burst design gel and soy candle. Vibrant and romantic.",
    scentNotes: {
      top: "Rose, Jasmine",
      mid: "Gardenia, Peony",
      base: "Sandalwood, Musk"
    },
  },
  {
    id: "jack-daniels",
    title: "Jack Daniels",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4147.jpg",
    gallery: ["/images/IMG_4147.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A bold whiskey-inspired gel and soy candle. Sophisticated notes for the connoisseur.",
    scentNotes: {
      top: "Whiskey, Oak",
      mid: "Vanilla, Spice",
      base: "Cedarwood, Tobacco"
    },
  },
  {
    id: "heart-delight",
    title: "Heart Delight",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4644.jpg",
    gallery: ["/images/IMG_4644.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A delightful heart-themed gel and soy candle, combining visual elegance with a sweet, comforting aroma. Perfect for creating a loving atmosphere and celebrating special moments.",
    scentNotes: {
      top: "Sweet Berry, Citrus",
      mid: "Vanilla, Floral",
      base: "Musk, Amber"
    },
  },
  {
    id: "mango-matcha-gel-soy",
    title: "Mango Matcha",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4329.jpg",
    gallery: ["/images/IMG_4329.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A unique fusion of tropical mango and earthy matcha green tea in a beautiful gel and soy blend.",
    scentNotes: {
      top: "Sweet Mango, Citrus",
      mid: "Matcha Tea, Jasmine",
      base: "Creamy Vanilla, Musk"
    },
  },
  {
    id: "love-cocktail-gel-soy",
    title: "Love Cocktail",
    price: 1399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4542.jpg",
    gallery: ["/images/IMG_4542.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A romantic and vibrant blend of cocktail-inspired aromatics in our signature gel and soy dual-wax jar.",
    scentNotes: {
      top: "Red Berries, Lime",
      mid: "Cocktail Blend, Peach",
      base: "Sugar, White Musk"
    },
  },
  {
    id: "iced-matcha-gel-soy",
    title: "Iced Matcha",
    price: 1249,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4326.jpg",
    gallery: ["/images/IMG_4326.jpg"],
    tag: "",
    category: "Gel&Soy Jar",
    description: "A refreshing iced matcha tea experience in our premium gel and soy blend. Crisp, clean, and invigorating.",
    scentNotes: {
      top: "Matcha Tea, Bergamot",
      mid: "Peppermint, Green Tea",
      base: "White Musk, Cedarwood"
    },
  },

  // ── Mini Jar ───────────────────────────────────────────────────
  {
    id: "mini-heart",
    title: "Mini Heart",
    price: 649,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4076.jpg",
    gallery: ["/images/IMG_4076.jpg"],
    tag: "",
    category: "Mini Jar",
    description: "A cute heart-shaped mini jar candle. Perfect for small spaces and gifting.",
    scentNotes: {
      top: "Rose, Pink Peppercorn",
      mid: "Floral, Peony",
      base: "Musk, Tonka"
    },
  },
  {
    id: "mini-heart-burst",
    title: "Mini Heart Patches",
    price: 649,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4073.jpg",
    gallery: ["/images/IMG_4073.jpg"],
    tag: "",
    category: "Mini Jar",
    description: "A vibrant heart-burst design in mini jar format. Compact and charming.",
    scentNotes: {
      top: "Rose, Bergamot",
      mid: "Jasmine, Floral",
      base: "Sandalwood, Musk"
    },
  },

  // ── Concrete Pots ─────────────────────────────────────────────
  {
    id: "concrete-pot-moon",
    title: "Moon Concrete Jar",
    price: 375,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4153.jpg",
    gallery: ["/images/IMG_4153.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A sleek moon-shaped concrete pot. Perfect for DIY candle making or decoration.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-starfish",
    title: "Starfish Concrete Bowl",
    price: 155,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4157.jpg",
    gallery: ["/images/IMG_4157.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A charming starfish-shaped concrete pot. Great for small DIY projects.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-bowl",
    title: "Concrete Bowl",
    price: 199,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4154.jpg",
    gallery: ["/images/IMG_4154.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A simple concrete bowl pot for candle making. Minimalist design.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-three-layers",
    title: "Three Layers Concrete Jar",
    price: 299,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4151.jpg",
    gallery: ["/images/IMG_4151.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A three-layered concrete pot structure. Perfect for advanced makers.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-grid-jar",
    title: "Grid Concrete Jar",
    price: 155,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4152.jpg",
    gallery: ["/images/IMG_4152.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A geometric grid-patterned concrete pot. Modern and versatile.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-big-bowl-nest",
    title: "Big Bowl Concrete Nest",
    price: 475,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4156.jpg",
    gallery: ["/images/IMG_4156.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A large nested bowl-style concrete pot. Great for statement candles.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "concrete-pot-large-bowl",
    title: "Large Concrete Bowl",
    price: 525,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4155.jpg",
    gallery: ["/images/IMG_4155.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "An expansive concrete bowl pot. Perfect for large DIY candle projects.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "candle-stand-1",
    title: "Candle Stand 1",
    price: 149,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4160.jpg",
    gallery: ["/images/IMG_4160.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A stylish concrete candle stand designed to display your favorite pillar candles. Minimalist and elegant.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "candle-stand-2",
    title: "Candle Stand 2",
    price: 199,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4159.jpg",
    gallery: ["/images/IMG_4159.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A modern concrete candle stand with geometric detailing. Perfect for showcasing candles in any space.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wooden-bowl",
    title: "Wooden Bowl",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4158.jpg",
    gallery: ["/images/IMG_4158.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A beautiful handcrafted wooden bowl perfect for displaying candles or DIY projects. Natural wood finish adds warmth to any decor.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "glass-jar-with-lid",
    title: "Glass Jar with Lid",
    price: 60,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4163.jpg",
    gallery: ["/images/IMG_4163.jpg"],
    tag: "",
    category: "Concrete Pots & More",
    description: "A premium glass jar with matching lid. Perfect for storing candles, DIY projects, or home organization.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },

  // ── Candle Making Kit ──────────────────────────────────────────
  {
    id: "candle-kit-full-set",
    title: "Full Set",
    price: 7499,
    sizeTag: "col-span-1 md:col-span-2 row-span-2",
    img: "/images/IMG_4201.jpg",
    gallery: ["/images/IMG_4201.jpg"],
    tag: "",
    category: "Candle Making Kit",
    description: "A comprehensive candle-making kit with everything needed to start your candle journey. Includes wax, wicks, oils, moulds, and tools.",
    scentNotes: {
      top: "Customize your own",
      mid: "Customize your own",
      base: "Customize your own"
    },
  },
  {
    id: "candle-kit-customized",
    title: "Customized Set",
    price: 0,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4187.PNG",
    gallery: ["/images/IMG_4187.PNG"],
    tag: "",
    category: "Candle Making Kit",
    description: "Create your personalized candle-making kit. Choose your own combination of wax, fragrance, and tools.",
    scentNotes: {
      top: "Customize your own",
      mid: "Customize your own",
      base: "Customize your own"
    },
  },

  // ── Candle Making (Supplies) ───────────────────────────────────
  {
    id: "stone-plaster-g-w",
    title: "Stone Plaster-G/W",
    price: 350,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4521.PNG",
    gallery: ["/images/IMG_4521.PNG"],
    tag: "",
    category: "Candle Making Materials",
    description: "Premium stone plaster for mould making. 350 per kg, ideal for creating custom moulds.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "pure-soy-wax",
    title: "Pure Soy Wax",
    price: 899,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4171.jpg",
    gallery: ["/images/IMG_4171.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "100% pure soy wax for sustainable candle making. Clean-burning and eco-friendly.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "gel-wax",
    title: "Gel Wax",
    price: 950,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4174.jpg",
    gallery: ["/images/IMG_4174.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "Premium gel wax for creating transparent and decorative candles.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "heart-mould",
    title: "Heart Mould",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4181.JPG",
    gallery: ["/images/IMG_4181.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A heart-shaped silicone mould for romantic candle designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "bubble-mould",
    title: "Bubble Mould",
    price: 365,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4175.JPG",
    gallery: ["/images/IMG_4175.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A bubble-pattern silicone mould for modern geometric designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "rose-mould",
    title: "Rose Mould",
    price: 485,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4188.JPG",
    gallery: ["/images/IMG_4188.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A detailed rose-shaped silicone mould for elegant floral candles.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "tulip-mould",
    title: "Tulip Mould",
    price: 485,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4547.jpg",
    gallery: ["/images/IMG_4547.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "A botanical tulip-shaped silicone mould for spring-inspired designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "mini-flower-mould",
    title: "Mini Flower Mould",
    price: 475,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4179.JPG",
    gallery: ["/images/IMG_4179.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A small flower-shaped silicone mould for delicate designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wax-thread",
    title: "Thread",
    price: 725,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4377.JPG",
    gallery: ["/images/IMG_4377.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "High-quality wax thread for wick applications and decorative details.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wick-holder",
    title: "Wick Holder",
    price: 15,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4379.JPG",
    gallery: ["/images/IMG_4379.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A precision wick holder for perfectly centered candle pouring.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "thank-you-stickers",
    title: "Thank You Stickers",
    price: 499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4529.jpg",
    gallery: ["/images/IMG_4529.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "Premium thank you stickers for finishing your handmade candle gifts.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "regular-melting-pot",
    title: "Regular Melting Pot",
    price: 1499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_5123.JPG",
    gallery: ["/images/IMG_5123.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A standard melting pot for safely heating and melting candle wax.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "professional-melting-pot",
    title: "Professional Melting Pot",
    price: 1999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_5125.JPG",
    gallery: ["/images/IMG_5125.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A premium, high-capacity professional melting pot for precision wax heating.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wax-color",
    title: "Color",
    price: 120,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4537.jpg",
    gallery: ["/images/IMG_4537.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "Premium candle coloring dyes in various shades for custom designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "fragrance-oil",
    title: "Fragrance",
    price: 699,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4636.jpg",
    gallery: ["/images/IMG_4636.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "High-quality fragrance oils for personalized scent creation (199-799).",
    scentNotes: {
      top: "Varies",
      mid: "Varies",
      base: "Varies"
    },
  },
  {
    id: "blending-needle",
    title: "Needle",
    price: 399,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4540.jpg",
    gallery: ["/images/IMG_4540.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "A precision blending needle for layering wax and creating patterns.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "warning-sticker-materials",
    title: "Warning Stickers",
    price: 999,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4548.PNG",
    gallery: ["/images/IMG_4548.PNG"],
    tag: "",
    category: "Candle Making Materials",
    description: "Essential safety warning stickers for the bottom of your finished candle jars.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "thermometer",
    title: "Thermometer",
    price: 775,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4526.JPG",
    gallery: ["/images/IMG_4526.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A precise thermometer for monitoring wax temperature during pouring.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "lid-jar",
    title: "Lid Jar",
    price: 60,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4163.jpg",
    gallery: ["/images/IMG_4163.jpg"],
    tag: "",
    category: "Candle Making Materials",
    description: "Replacement jar lids for 100ml and 200ml jars (55-60).",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "heat-gun",
    title: "Heat Gun",
    price: 1155,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4530.JPG",
    gallery: ["/images/IMG_4530.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A professional heat gun for smoothing wax surfaces and finishing touches.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "mould-sunflower",
    title: "Sunflower Mould",
    price: 549,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4374.JPG",
    gallery: ["/images/IMG_4374.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A radiant sunflower-shaped silicone mould for creating bright and cheerful floral candles.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "mould-daisy",
    title: "Daisy Mould",
    price: 499,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4372.JPG",
    gallery: ["/images/IMG_4372.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "A delicate daisy-shaped silicone mould for soft, elegant floral candle designs.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wick-sticker",
    title: "Wick Sticker",
    price: 99,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4380.JPG",
    gallery: ["/images/IMG_4380.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "Double-sided adhesive stickers for securely fixing wicks to the bottom of your jars.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
  {
    id: "wick-standard",
    title: "Candle Wick",
    price: 12,
    sizeTag: "col-span-1 row-span-1",
    img: "/images/IMG_4376.JPG",
    gallery: ["/images/IMG_4376.JPG"],
    tag: "",
    category: "Candle Making Materials",
    description: "High-quality cotton wicks with sustainer tabs for consistent and clean burning.",
    scentNotes: {
      top: "Unscented",
      mid: "Unscented",
      base: "Unscented"
    },
  },
];

export const COLORS = [
  { name: "Maroon", hex: "#800000" },
  { name: "Red", hex: "#D22B2B" },
  { name: "Pink", hex: "#F48FB1" },
  { name: "Purple", hex: "#9C27B0" },
  { name: "Yellow", hex: "#FFD54F" },
  { name: "Lavender", hex: "#E1BEE7" },
  { name: "Green", hex: "#66BB6A" },
  { name: "Blue", hex: "#42A5F5" },
  { name: "Custom", hex: "conic-gradient(from 0deg, #f87171, #fb923c, #fbbf24, #34d399, #60a5fa, #818cf8, #a78bfa, #f472b6, #f87171)" },
];

export const FRAGRANCES = [
  "White Musk", "Lavender", "Vanilla", "Green Apple", 
  "Cherry Blossom", "Rose", "Peach", "Sea Breeze", 
  "Jasmine", "Berry Blast", "Moringa", "White Coconut", 
  "Peppermint", "Cinnamon", "Orange", "Coffee", 
  "Sandalwood", "Fresh Lemon"
];
