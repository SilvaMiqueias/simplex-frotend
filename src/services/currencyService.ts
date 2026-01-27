import { api } from "./api";

export interface RatesResponse {
  base: string;
  date: string;
  rates: {
    USD?: number;
    EUR?: number;
    GBP?: number;
    JPY?: number;
    AUD?: number;
    CAD?: number;
    CHF?: number;
    CNY?: number;
    [key: string]: number | undefined;
  };
  previousRates?: {
    USD?: number;
    EUR?: number;
    GBP?: number;
    JPY?: number;
    AUD?: number;
    CAD?: number;
    CHF?: number;
    CNY?: number;
    [key: string]: number | undefined;
  };
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
}

const currencyNames: { [key: string]: string } = {
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  JPY: "Iene Japonês",
  AUD: "Dólar Australiano",
  CAD: "Dólar Canadense",
  CHF: "Franco Suíço",
  CNY: "Yuan Chinês",
  ARS: "Peso Argentino",
  MXN: "Peso Mexicano",
};

export async function getCurrencyRates(): Promise<CurrencyRate[]> {
  const response = await api.get<RatesResponse>("/api/v1/currency/rates-with-variation");
  const data = response.data;
  
  const rates: CurrencyRate[] = [];
  
  if (data.rates) {
    const mainCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];
    
    for (const code of mainCurrencies) {
      const currentRate = data.rates[code];
      const previousRate = data.previousRates?.[code];
      
      if (currentRate !== undefined) {
        let change = 0;
        if (previousRate !== undefined && previousRate !== 0) {
          change = ((currentRate - previousRate) / previousRate) * 100;
        }
        
        rates.push({
          code,
          name: currencyNames[code] || code,
          rate: currentRate,
          change: change,
        });
      }
    }
  }
  
  return rates;
}

export async function getRawRates(): Promise<RatesResponse> {
  const response = await api.get<RatesResponse>("/api/v1/currency/rates-with-variation");
  return response.data;
}
