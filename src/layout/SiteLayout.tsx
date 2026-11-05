import { createContext, useContext, useState, type ReactNode } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { EnquiryDialog, type RequestType } from "../components/EnquiryDialog";
import { ScrollReset } from "../components/ScrollReset";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export interface SiteActions {
  openEnquiry: (type?: RequestType, service?: string) => void;
}

const SiteActionsContext = createContext<SiteActions | null>(null);

export function useSiteActions(): SiteActions {
  const context = useContext(SiteActionsContext);
  if (!context) throw new Error("useSiteActions must be used within SiteLayout.");
  return context;
}

export function usePageActions(): SiteActions {
  return useOutletContext<SiteActions>();
}

export function SiteLayout({ children }: { children?: ReactNode }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("quote");
  const [service, setService] = useState<string>();

  function openEnquiry(type: RequestType = "quote", serviceName?: string) {
    setRequestType(type);
    setService(serviceName);
    setEnquiryOpen(true);
  }

  const actions = { openEnquiry };

  return (
    <SiteActionsContext.Provider value={actions}>
      <ScrollReset />
      <div className="min-h-screen w-full" id="top">
        <SiteHeader onRequestQuote={() => openEnquiry()} />
        {children ?? <Outlet context={actions} />}
        <SiteFooter />
      </div>
      {enquiryOpen && (
        <EnquiryDialog
          onClose={() => setEnquiryOpen(false)}
          open={enquiryOpen}
          requestType={requestType}
          service={service}
        />
      )}
    </SiteActionsContext.Provider>
  );
}
