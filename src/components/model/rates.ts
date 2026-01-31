export class Rates{
  today?: string;
  previous?: string;
  todayRates?: RatesDTO;
  previousRates?: RatesDTO;
}



export class RatesDTO {
  AUD?: number;
  BGN?: number;
  CAD?: number;
  CHF?: number;
  CNY?: number;
  CZK?: number;
  DKK?: number;
  EUR?: number;
  GBP?: number;
  HKD?: number;
  HUF?: number;
  IDR?: number;
  ILS?: number;
  INR?: number;
  ISK?: number;
  JPY?: number;
  KRW?: number;
  MXN?: number;
  MYR?: number;
  NOK?: number;
  NZD?: number;
  PHP?: number;
  PLN?: number;
  RON?: number;
  SEK?: number;
  SGD?: number;
  THB?: number;
  USD?: number;
  ZAR?: number;
}

export interface CurrencyItem {
  code: string;
  name: string;
  rate: number;
  change?: number;
}


export const currencyNames: Record<string, string> = {
  AUD: "Dólar Australiano",
  BGN: "Lev Búlgaro",
  CAD: "Dólar Canadense",
  CHF: "Franco Suíço",
  CNY: "Yuan Chinês",
  CZK: "Coroa Tcheca",
  DKK: "Coroa Dinamarquesa",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  HKD: "Dólar de Hong Kong",
  HUF: "Forint Húngaro",
  IDR: "Rupia Indonésia",
  ILS: "Novo Shekel Israelense",
  INR: "Rupia Indiana",
  ISK: "Coroa Islandesa",
  JPY: "Iene Japonês",
  KRW: "Won Sul-Coreano",
  MXN: "Peso Mexicano",
  MYR: "Ringgit Malaio",
  NOK: "Coroa Norueguesa",
  NZD: "Dólar Neozelandês",
  PHP: "Peso Filipino",
  PLN: "Zloty Polonês",
  RON: "Leu Romeno",
  SEK: "Coroa Sueca",
  SGD: "Dólar de Singapura",
  THB: "Baht Tailandês",
  USD: "Dólar Americano",
  ZAR: "Rand Sul-Africano",
};


export function ratesToCurrencyList(
  rates?: RatesDTO
): CurrencyItem[] {
  if (!rates) return [];

  return Object.entries(rates)
    .filter(([, rate]) => rate !== undefined)
    .map(([code, rate]) => ({
      code,
      name: currencyNames[code] ?? code,
      rate: rate!,
    }));
}

export function ratesToCurrencyListWithChange(
  today?: RatesDTO,
  previous?: RatesDTO
) {
  if (!today) return [];

  return Object.entries(today)
    .filter(([, rate]) => typeof rate === "number")
    .map(([code, rate]) => {
      const prev = previous?.[code as keyof RatesDTO];

      let change: number | undefined = undefined;

      if (
        typeof prev === "number" &&
        prev !== 0
      ) {
        change = ((rate! - prev) / prev) * 100;
      }

      return {
        code,
        name: currencyNames[code] ?? code,
        rate: rate!,
        change,
      };
    });
}


