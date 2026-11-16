import type { Locale } from "@/i18n-config";

type LocalizedText = Record<Locale, string>;

export type PickListItem = {
  id: string;
  brand: string;
  model: LocalizedText;
  reference: string;
  description: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  sourceUrl: string;
};

export const pickList: PickListItem[] = [
  {
    id: "omega-speedmaster-38",
    brand: "Omega",
    model: {
      it: "Speedmaster 38 Co-Axial Chronograph",
      en: "Speedmaster 38 Co-Axial Chronograph",
    },
    reference: "324.30.38.50.02.001",
    description: {
      it: "Cronografo automatico da 38 mm, con quadrante argentato e bracciale in acciaio.",
      en: "A 38 mm automatic chronograph with a silver dial and a stainless steel bracelet.",
    },
    image: "/assets/pick-list/omega-speedmaster-38.webp",
    imageAlt: {
      it: "Omega Speedmaster 38 visto frontalmente, con quadrante argentato e bracciale in acciaio",
      en: "Front view of the Omega Speedmaster 38 with a silver dial and steel bracelet",
    },
    sourceUrl:
      "https://www.omegawatches.com/watch-omega-speedmaster-38-co-axial-chronometer-chronograph-38-mm-32430385002001",
  },
  {
    id: "cartier-santos-medium",
    brand: "Cartier",
    model: {
      it: "Santos de Cartier, modello medio",
      en: "Santos de Cartier, medium model",
    },
    reference: "WSSA0029",
    description: {
      it: "Movimento automatico, cassa e bracciale in acciaio. Con cinturino in pelle intercambiabile tramite sistema QuickSwitch.",
      en: "Automatic movement, steel case and bracelet. With an interchangeable leather strap and QuickSwitch system.",
    },
    image: "/assets/pick-list/cartier-santos-medium.webp",
    imageAlt: {
      it: "Cartier Santos de Cartier modello medio visto frontalmente, con bracciale in acciaio e lancette blu",
      en: "Front view of the medium Santos de Cartier with a steel bracelet and blue hands",
    },
    sourceUrl:
      "https://www.cartier.com/en-us/watches/collections/santos-de-cartier/santos-de-cartier-watch-CRWSSA0029.html",
  },
];
