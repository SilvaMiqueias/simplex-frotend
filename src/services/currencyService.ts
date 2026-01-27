import api from "./api";

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
  const response = await api.get<RatesResponse>("/currency/rates-with-variation");
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

export async function getRatesWithVariation(): Promise<CurrencyRate[]> {
  try {
    return await getCurrencyRates();
  } catch (error) {
    // Fallback: tenta API externa diretamente
    const response = await fetch("https://api.frankfurter.dev/v1/latest?base=BRL");
    const data = await response.json();
    
    const rates: CurrencyRate[] = [];
    const mainCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];
    
    for (const code of mainCurrencies) {
      const rate = data.rates?.[code];
      if (rate !== undefined) {
        rates.push({
          code,
          name: currencyNames[code] || code,
          rate,
          change: 0,
        });
      }
    }
    
    return rates;
  }
}

export async function getRawRates(): Promise<RatesResponse> {
  try {
    const response = await api.get<RatesResponse>("/currency/rates-with-variation");
    return response.data;
  } catch (error) {
    // Fallback: API externa diretamente
    const response = await fetch("https://api.frankfurter.dev/v1/latest?base=BRL");
    const data = await response.json();
    return {
      base: "BRL",
      date: data.date,
      rates: data.rates,
    };
  }
}
