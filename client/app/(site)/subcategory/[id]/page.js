import { redirect, notFound } from "next/navigation";
import { getMenu } from "@/lib/api";
import { MP } from "@/lib/news";

// Old links (/subcategory/<id>) keep working: only Madhya Pradesh stays a separate section,
// every other state belongs to the national ("देश") column.
export default async function SubcategoryRedirect({ params }) {
  const menu = await getMenu();
  const sub = menu.flatMap((c) => c.subCategories || []).find((s) => s._id === params.id);
  if (!sub) notFound();
  redirect(sub.name.trim() === MP ? "/category/mp" : "/category/national");
}
