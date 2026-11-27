"use client";
import NewsForm from "@/components/admin/NewsForm";

export default function EditNewsPage({ params }) {
  return <NewsForm id={params.id} />;
}
