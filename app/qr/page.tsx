import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR за срещата",
  robots: { index: false, follow: false },
};

const URL = "https://onde-salon.vercel.app";

export default function QrPage() {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=0&data=${encodeURIComponent(
    URL
  )}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-center">
      <p className="eyebrow">ONDÉ · салон за красота</p>
      <h1 className="display mt-6 max-w-xl text-4xl text-bone sm:text-5xl">
        Сканирайте и отворете сайта на телефона си.
      </h1>

      <div className="mt-12 border border-line bg-bone p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="QR код към сайта" width={320} height={320} className="size-80" />
      </div>

      <p className="mt-10 text-[15px] font-light text-muted">{URL.replace("https://", "")}</p>
      <p className="mt-2 text-[13px] font-light text-muted/60">
        Демонстрационен проект · изработка Wavsy
      </p>
    </main>
  );
}
