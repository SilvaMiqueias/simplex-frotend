export class Stocks{
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;

  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketDayRange: string;

  regularMarketChange: number;
  regularMarketChangePercent: number;

  regularMarketTime: string; 

  marketCap: number;
  regularMarketVolume: number;

  regularMarketPreviousClose: number;
  regularMarketOpen: number;

  fiftyTwoWeekRange: string;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;

  priceEarnings: number;
  earningsPerShare: number;

  logourl: string;
}

export interface StockList{
    results: Stocks[];
}