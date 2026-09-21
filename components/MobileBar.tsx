"use client";

import Icon from "./Icon";
import { useI18n } from "./I18n";
import { SALON } from "@/lib/content";

export default function MobileBar() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex gap-2">
        <a
          href={`tel:${SALON.phoneHref}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-3.5 text-[14px] font-light text-bone"
        >
          <Icon name="phone" className="size-4" />
          {t.mobile.call}
        </a>
        <a
          href="#chas"
          className="flex flex-[1.3] items-center justify-center gap-2 rounded-full bg-bone py-3.5 text-[14px] font-medium text-ink"
        >
          <Icon name="calendar" className="size-4" />
          {t.mobile.book}
        </a>
      </div>
    </div>
  );
}
