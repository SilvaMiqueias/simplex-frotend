// Serviço para buscar dados de mercado usando a API Brapi (gratuita)
// https://brapi.dev - API de ações e fundos brasileiros

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export interface MarketData {
  topGainers: StockData[];
  topLosers: StockData[];
  loading: boolean;
  error: string | null;
}

const BRAPI_BASE_URL = "https://brapi.dev/api";

// Ações populares da B3 para consulta
const POPULAR_STOCKS = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3",
  "MGLU3", "WEGE3", "RENT3", "BBAS3", "B3SA3",
  "AZUL4", "COGN3", "CIEL3", "CYRE3", "GGBR4"
];

export async function fetchMarketData(): Promise<{ topGainers: StockData[]; topLosers: StockData[] }> {
  try {
    const symbols = POPULAR_STOCKS.join(",");
    const response = await fetch(`${BRAPI_BASE_URL}/quote/${symbols}?token=demo`);
    
    if (!response.ok) {
      throw new Error("Falha ao buscar dados do mercado");
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Formato de resposta inválido");
    }
    
    const stocks: StockData[] = data.results.map((stock: {
      symbol: string;
      shortName?: string;
      longName?: string;
      regularMarketPrice?: number;
      regularMarketChangePercent?: number;
    }) => ({
      symbol: stock.symbol,
      name: stock.shortName || stock.longName || stock.symbol,
      price: stock.regularMarketPrice || 0,
      change: stock.regularMarketChangePercent || 0,
    }));
    
    // Ordena por variação
    const sorted = [...stocks].sort((a, b) => b.change - a.change);
    
    const topGainers = sorted.filter(s => s.change > 0).slice(0, 3);
    const topLosers = sorted.filter(s => s.change < 0).slice(-3).reverse();
    
    return { topGainers, topLosers };
  } catch (error) {
    console.error("Erro ao buscar dados do mercado:", error);
    // Retorna dados vazios em caso de erro
    return { topGainers: [], topLosers: [] };
  }
}

// Fallback com dados mock caso a API falhe ou esteja indisponível
export const mockMarketData = {
  topGainers: [
    { symbol: "PETR4", name: "Petrobras", price: 38.45, change: 4.8 },
    { symbol: "VALE3", name: "Vale", price: 62.3, change: 3.2 },
    { symbol: "ITUB4", name: "Itaú", price: 28.9, change: 2.7 },
  ],
  topLosers: [
    { symbol: "MGLU3", name: "Magazine Luiza", price: 2.15, change: -5.2 },
    { symbol: "COGN3", name: "Cogna", price: 1.82, change: -4.1 },
    { symbol: "AZUL4", name: "Azul", price: 9.2, change: -3.8 },
  ],
};
