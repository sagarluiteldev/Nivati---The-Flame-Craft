import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nivati — The Flame Craft",
    short_name: "Nivati",
    description: "Handcrafted natural soy wax candles, artisanal scents, and mindful crafting supplies.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#3B4132",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
