type DataLayerValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | DataLayerValue[]
  | { [key: string]: DataLayerValue };

export type GTMEvent = {
  event: string;
  [key: string]: DataLayerValue;
};

export function pushToDataLayer(event: GTMEvent) {
  if (typeof window === 'undefined') {
    return;
  }

  const gtmWindow = window as Window & { dataLayer?: GTMEvent[] };
  gtmWindow.dataLayer = gtmWindow.dataLayer || [];
  gtmWindow.dataLayer.push(event);
}
