"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopHeader from "./MobileTopHeader";
import ExitPopup, { type ExitPopupConfig } from "./ExitPopup";
import type { GlobalContent, PageKey } from "@/lib/content/schema";

const emptyExit: ExitPopupConfig = {
  enabled: false,
  title: "",
  description: "",
  image: "",
  ctaLabel: "",
  ctaHref: "",
};

export default function ClientSiteChrome({
  children,
  pageKey,
  hideCtaBanner = false,
}: {
  children: React.ReactNode;
  pageKey?: PageKey;
  hideCtaBanner?: boolean;
}) {
  const [global, setGlobal] = useState<GlobalContent | null>(null);
  const [exitPopup, setExitPopup] = useState<ExitPopupConfig | null>(null);

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((data) => setGlobal(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pageKey) return;
    fetch(`/api/public/page/${pageKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.exitPopup) setExitPopup(data.exitPopup);
      })
      .catch(() => {});
  }, [pageKey]);

  return (
    <>
      <Header globalContent={global ?? undefined} />
      <MobileTopHeader globalContent={global ?? undefined} />
      <main>{children}</main>
      <Footer hideCta={hideCtaBanner} globalContent={global ?? undefined} />
      <WhatsAppButton
        number={global?.whatsapp.number ?? "5547999999999"}
        enabled={global?.whatsapp.floatingEnabled ?? true}
        title={global?.whatsapp.bubbleTitle ?? "Fale com a ACOMAC"}
        text={global?.whatsapp.bubbleText ?? "Tire suas dúvidas pelo WhatsApp"}
        message={
          global?.whatsapp.defaultMessage ??
          "Olá! Vim pelo site e gostaria de mais informações."
        }
      />
      {pageKey && (
        <ExitPopup config={exitPopup ?? emptyExit} pageKey={pageKey} />
      )}
      <MobileBottomNav globalContent={global ?? undefined} />
    </>
  );
}
