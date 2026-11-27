import { redirect, notFound } from "next/navigation";
import { getMenu } from "@/lib/api";
import { MP, isDivision } from "@/lib/news";

// Old links (/subcategory/<id>) keep working: a district opens its division page filtered to that district;
// the old "मध्य प्रदेश" sub-category opens the MP overview; every other state belongs to the national column.
export default async function SubcategoryRedirect({ params }) {
  const menu = await getMenu();
  for (const c of menu) {
    const sub = (c.subCategories || []).find((s) => s._id === params.id);
    if (!sub) continue;
    if (isDivision(c)) redirect(`/category/${c._id}?district=${sub._id}`);
    redirect(sub.name.trim() === MP ? "/category/mp" : "/category/national");
  }
  notFound();
}
