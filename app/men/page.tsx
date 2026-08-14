import { menCategories } from "@/lib/products";
import { ListingPage } from "@/components/ListingPage";

export const metadata = {
  title: "Men",
  description: "Shop men's t-shirts, hoodies, joggers, shoes and accessories at StreamSports.",
};

export default async function MenPage({
  searchParams,
}: PageProps<"/men">) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  if (sp.sort) qs.set("sort", String(sp.sort));
  const activeKey = typeof sp.category === "string" ? sp.category : "all";

  return (
    <ListingPage
      gender="men"
      title="Men"
      categories={menCategories}
      activeKey={activeKey}
      searchParams={qs}
    />
  );
}
