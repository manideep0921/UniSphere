import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

function buildWhatsAppUrl(number: string) {
  const digitsOnly = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digitsOnly}`;
}

export function WhatsAppButton({ number }: { number?: string | null }) {
  const t = useTranslations("nav");

  if (!number) return null;

  return (
    <a
      href={buildWhatsAppUrl(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("chatOnWhatsApp")}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">{t("chatOnWhatsApp")}</span>
    </a>
  );
}
