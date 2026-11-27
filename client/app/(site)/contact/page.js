import SectionTitle from "@/components/SectionTitle";
import ContactForm from "@/components/ContactForm";
import SocialIcons from "@/components/SocialIcons";

export const metadata = { title: "संपर्क करें / विज्ञापन", description: "MP Update से संपर्क करें या विज्ञापन दें।", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1">संपर्क करें / विज्ञापन</SectionTitle>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <ContactForm />
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="mb-2 text-sm font-bold text-gray-600">सोशल मीडिया पर भी जुड़ें</p>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
}
