import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR за срещата",
  robots: { index: false, follow: false },
};

const URL = "https://vet-lapa.vercel.app";

export default function QrPage() {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=0&data=${encodeURIComponent(
    URL
  )}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-light">
        Ветеринарна клиника Лапа
      </p>
      <h1 className="mt-4 max-w-xl text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
        Сканирайте и отворете сайта на вашия телефон.
      </h1>

      <div className="mt-10 rounded-[2rem] border border-ink/8 bg-white p-8 shadow-lift">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="QR код към сайта" width={320} height={320} className="size-80" />
      </div>

      <p className="mt-8 text-lg text-ink-soft">{URL.replace("https://", "")}</p>
      <p className="mt-2 text-sm text-ink-soft/70">
        Демонстрационен проект · изработка Wavsy
      </p>
    </main>
  );
}
