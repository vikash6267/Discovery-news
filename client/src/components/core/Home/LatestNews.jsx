import { useSelector } from "react-redux";
import { NewsCard } from "../../ui/NewsCard";
import { byLatest } from "../../ui/news";

function LatestNews() {
  const { allNews } = useSelector((state) => state.news);
  const top = [...allNews].filter((n) => n?.type === "top-news").sort(byLatest).slice(0, 5);
  if (!top.length) return null;

  return (
    <section className="my-6 grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <NewsCard news={top[0]} overlay heightClass="h-64 lg:h-[26rem]" titleClass="text-xl lg:text-3xl" words={18} />
      </div>
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        {top.slice(1, 5).map((n) => (
          <NewsCard key={n._id} news={n} overlay heightClass="h-40 lg:h-[12.4rem]" titleClass="text-sm" words={9} />
        ))}
      </div>
    </section>
  );
}

export default LatestNews;
