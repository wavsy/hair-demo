"use client";

import Icon from "./Icon";
import { useI18n } from "./I18n";
import { CLINIC } from "@/lib/content";

export default function MobileBar() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-cream/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex gap-2">
        <a
          href={`tel:${CLINIC.phoneHref}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand/15 bg-white py-3.5 font-semibold text-brand"
        >
          <Icon name="phone" className="size-5" />
          {t.mobile.call}
        </a>
        <a
          href="#chas"
          className="flex flex-[1.3] items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white"
        >
          <Icon name="calendar" className="size-5" />
          {t.mobile.book}
        </a>
      </div>
    </div>
  );
}
