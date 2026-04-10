declare module "react-gtm-module" {
  type GTMDataLayer = Record<string, unknown>;

  type GTMInitializeArgs = {
    gtmId: string;
    dataLayer?: GTMDataLayer;
    dataLayerName?: string;
    events?: Record<string, string>;
    auth?: string;
    preview?: string;
  };

  type GTMDataLayerArgs = {
    dataLayer: GTMDataLayer;
    dataLayerName?: string;
  };

  const TagManager: {
    initialize(args: GTMInitializeArgs): void;
    dataLayer(args: GTMDataLayerArgs): void;
  };

  export default TagManager;
}
