"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ShareBar from "./ShareBar";
import { API_URL, SITE_URL } from "@/lib/site";

/** Voting poll with live percentages and share buttons. `standalone` = the /poll/[id] page. */
export default function PollWidget({ poll: initial, standalone = false }) {
  const [poll, setPoll] = useState(initial);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    try {
      setVoted(JSON.parse(localStorage.getItem("mp_voted") || "[]").includes(initial._id));
    } catch {}
  }, [initial._id]);

  const total = poll.options.reduce((s, o) => s + (o.votes || 0), 0);

  const vote = async (optionId) => {
    if (voted) return;
    try {
      const res = await fetch(`${API_URL}/poll/vote/${poll._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      if (!res.ok) throw new Error();
      setPoll(await res.json());
      const list = JSON.parse(localStorage.getItem("mp_voted") || "[]");
      localStorage.setItem("mp_voted", JSON.stringify([...list, poll._id]));
      setVoted(true);
      toast.success("आपका वोट दर्ज हो गया");
    } catch {
      toast.error("वोट नहीं हो पाया, दोबारा कोशिश करें");
    }
  };

  const pollUrl = `${SITE_URL}/poll/${poll._id}`;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-red-600">जनता की राय · पोल</p>
      <h3 className="mb-3 text-lg font-bold leading-snug">{poll.question}</h3>
      <div className="space-y-2">
        {poll.options.map((o) => {
          const pct = total ? Math.round(((o.votes || 0) * 100) / total) : 0;
          return (
            <button
              key={o._id}
              onClick={() => vote(o._id)}
              disabled={voted}
              className="relative block w-full overflow-hidden rounded-lg border border-gray-300 px-3 py-2 text-left text-sm font-semibold transition hover:border-red-600 disabled:cursor-default"
            >
              {voted && <span className="absolute inset-y-0 left-0 bg-red-100" style={{ width: `${pct}%` }} />}
              <span className="relative flex justify-between">
                <span>{o.text}</span>
                {voted && <span className="text-red-600">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">कुल वोट: {total}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <ShareBar url={pollUrl} title={`पोल: ${poll.question}`} />
        {!standalone && (
          <Link href={`/poll/${poll._id}`} className="text-xs font-bold text-red-600 hover:underline">
            पोल पेज →
          </Link>
        )}
      </div>
    </div>
  );
}
