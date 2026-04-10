"use client";

import { getGTM } from "@/lib/gtm";
import { useEffect } from "react";

function Page({ children }) {
  useEffect(() => {
    let isMounted = true;

    getGTM().then((gtm) => {
      if (!isMounted || !gtm) {
        return;
      }

      gtm.dataLayer({
        dataLayer: {
          event: "home_view",
        },
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return children;
}

export default Page;
