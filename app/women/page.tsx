import { womenCategories } from "@/lib/products";
import { ListingPage } from "@/components/ListingPage";

export const metadata = {
  title: "Women",
  description: "Shop women's tops, dresses, hoodies, leggings, shoes and accessories at StreamSports.",
};

export default async function WomenPage({
  searchParams,
}: PageProps<"/women">) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  if (sp.sort) qs.set("sort", String(sp.sort));
  const activeKey = typeof sp.category === "string" ? sp.category : "all";

  return (
    <ListingPage
      gender="women"
      title="Women"
      categories={womenCategories}
      activeKey={activeKey}
      searchParams={qs}
    />
  );
}
