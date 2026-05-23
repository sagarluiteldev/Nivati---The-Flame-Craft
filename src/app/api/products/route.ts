import { getPublicCatalogProducts } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getPublicCatalogProducts();

  return Response.json(products);
}
