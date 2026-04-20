import { getGlobalContent, getPageContent } from "@/lib/content/get";
import type { PageKey } from "@/lib/content/schema";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import MobileBottomNav from "./MobileBottomNav";
import MobileTopHeader from "./MobileTopHeader";
import IntroVideo from "./IntroVideo";
import ExitPopup from "./ExitPopup";

export default async function SiteChrome({
  children,
  pageKey,
  hideCtaBanner = false,
}: {
  children: React.ReactNode;
  pageKey?: PageKey;
  hideCtaBanner?: boolean;
}) {
  const global = await getGlobalContent();
  const page = pageKey ? await getPageContent(pageKey) : null;
  const exitPopup = page && "exitPopup" in page ? page.exitPopup : null;

  return (
    <>
      <Header globalContent={global} />
      <MobileTopHeader globalContent={global} />
      <main>{children}</main>
      <Footer hideCta={hideCtaBanner} globalContent={global} />
      <WhatsAppButton
        number={global.whatsapp.number}
        enabled={global.whatsapp.floatingEnabled}
        title={global.whatsapp.bubbleTitle}
        text={global.whatsapp.bubbleText}
        message={global.whatsapp.defaultMessage}
      />
      {exitPopup && pageKey && (
        <ExitPopup config={exitPopup} pageKey={pageKey} />
      )}
      <MobileBottomNav globalContent={global} />
      <IntroVideo />
    </>
  );
}
