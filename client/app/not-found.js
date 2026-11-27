import Link from "next/link";

export const metadata = { title: "पेज नहीं मिला", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-extrabold text-red-600">404</p>
        <h1 className="mt-2 text-2xl font-bold">यह पेज नहीं मिला</h1>
        <p className="mt-1 text-gray-500">खबर हटाई गई हो सकती है या लिंक गलत है।</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-red-600 px-6 py-2.5 font-bold text-white hover:bg-black">← होम पेज</Link>
      </div>
    </div>
  );
}
