import Link from "next/link";

export default function SectionTitle({ children, href, className = "", as: Tag = "h2" }) {
  return (
    <div className={`mb-4 flex items-center justify-between border-b-2 border-red-600 ${className}`}>
      <Tag className="bg-red-600 py-1.5 pl-4 pr-8 text-lg font-extrabold text-white [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)]">
        {children}
      </Tag>
      {href && (
        <Link href={href} className="pr-1 text-sm font-semibold text-red-600 hover:text-black">
          सभी देखें →
        </Link>
      )}
    </div>
  );
}
