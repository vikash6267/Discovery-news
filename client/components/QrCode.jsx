import QRCode from "qrcode";

/** Crisp inline-SVG QR code generated on the server (no external service). */
export default async function QrCode({ value, size = 96, label, className = "" }) {
  const svg = await QRCode.toString(value, { type: "svg", margin: 1, width: size, color: { dark: "#111111", light: "#ffffff" } });
  return (
    <a href={value} target="_blank" rel="noopener noreferrer" className={`inline-block text-center ${className}`} aria-label={label || value}>
      <span className="block rounded-lg bg-white p-1 shadow-md" style={{ width: size + 8, height: size + 8 }} dangerouslySetInnerHTML={{ __html: svg }} />
      {label && <span className="mt-1 block text-[11px] font-semibold">{label}</span>}
    </a>
  );
}
