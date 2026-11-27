"use client";
// Small building blocks shared by the admin pages.

export function PageTitle({ children, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-extrabold sm:text-2xl">{children}</h2>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

export const Card = ({ children, className = "" }) => <div className={`min-w-0 rounded-xl bg-white p-3 shadow-sm sm:p-5 ${className}`}>{children}</div>;

export const inputCls = "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-red-600";
export const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
  </label>
);

export function Btn({ children, color = "red", className = "", ...rest }) {
  const colors = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    dark: "bg-gray-900 hover:bg-black text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };
  return (
    <button {...rest} className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50 ${colors[color]} ${className}`}>
      {children}
    </button>
  );
}

const STATUS = {
  approved: ["प्रकाशित", "bg-green-100 text-green-700"],
  pending: ["समीक्षा में", "bg-yellow-100 text-yellow-800"],
  rejected: ["अस्वीकृत", "bg-red-100 text-red-700"],
  draft: ["ड्राफ्ट", "bg-gray-100 text-gray-600"],
};
export function StatusBadge({ status }) {
  const [label, cls] = STATUS[status] || STATUS.draft;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{label}</span>;
}

export const Empty = ({ children }) => <p className="py-10 text-center text-gray-500">{children}</p>;
