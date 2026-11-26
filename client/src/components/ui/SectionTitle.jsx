import { Link } from "react-router-dom";

export default function SectionTitle({ children, href, className = "" }) {
  return (
    <div className={`flex items-center justify-between mb-4 border-b-2 border-red-600 ${className}`}>
      <h2 className="bg-red-600 text-white font-extrabold text-lg px-4 py-1.5 pr-7 [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)]">
        {children}
      </h2>
      {href && (
        <Link to={href} className="text-sm font-semibold text-red-600 hover:text-black pr-1">
          सभी देखें →
        </Link>
      )}
    </div>
  );
}
