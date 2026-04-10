type GTMModule = (typeof import("react-gtm-module"))["default"];

let gtm: GTMModule | null = null;
let isInitialized = false;

export const getGTM = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!gtm) {
    const module = await import("react-gtm-module");
    gtm = module.default;
  }

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) {
    return null;
  }

  if (!isInitialized) {
    gtm.initialize({
      gtmId,
    });
    isInitialized = true;
  }

  return gtm;
};
