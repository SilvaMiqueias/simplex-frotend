import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchMarketData, mockMarketData, StockData } from "@/services/marketService";
import { getRatesWithVariation, CurrencyRate } from "@/services/currencyService";

export default function MarketData() {
  const [topGainers, setTopGainers] = useState<StockData[]>(mockMarketData.topGainers);
  const [topLosers, setTopLosers] = useState<StockData[]>(mockMarketData.topLosers);
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carrega dados de mercado e moedas em paralelo
      const [marketResult, currencyResult] = await Promise.allSettled([
        fetchMarketData(),
        getRatesWithVariation()
      ]);
      
      if (marketResult.status === "fulfilled") {
        const { topGainers: gainers, topLosers: losers } = marketResult.value;
        if (gainers.length > 0) setTopGainers(gainers);
        if (losers.length > 0) setTopLosers(losers);
      }
      
      if (currencyResult.status === "fulfilled") {
        setCurrencies(currencyResult.value);
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      setError("Erro ao carregar dados. Usando dados de demonstração.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cotações e Investimentos do Dia</h1>
          <p className="text-muted-foreground">
            Acompanhe as principais cotações e movimentações do mercado
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Atualizado: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Currency Rates */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Cotações de Moedas</CardTitle>
        </CardHeader>
        <CardContent>
          {currencies.length === 0 && !loading ? (
            <p className="text-muted-foreground text-center py-4">
              Dados de moedas indisponíveis no momento.
            </p>
          ) : (
            <>
              {/* Desktop: tabela */}
              <div className="hidden md:block">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Moeda</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Cotação (BRL)</TableHead>
                      <TableHead className="text-right">Variação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currencies.map((currency) => (
                      <TableRow key={currency.code}>
                        <TableCell className="font-medium">
                          {currency.code}
                        </TableCell>
                        <TableCell>{currency.name}</TableCell>
                        <TableCell className="text-right">
                          R$ {currency.rate.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              currency.change >= 0 ? "default" : "destructive"
                            }
                            className={currency.change >= 0 ? "bg-success" : ""}
                          >
                            {currency.change >= 0 ? "+" : ""}
                            {currency.change.toFixed(2)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile: lista */}
              <div className="md:hidden space-y-2">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{currency.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {currency.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {currency.rate.toFixed(4)}</p>
                      <Badge
                        variant={currency.change >= 0 ? "default" : "destructive"}
                        className={currency.change >= 0 ? "bg-success" : ""}
                      >
                        {currency.change >= 0 ? "+" : ""}
                        {currency.change.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Gainers */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <CardTitle>Maiores Altas do Dia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topGainers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Sem dados de altas disponíveis
                </p>
              ) : (
                topGainers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {stock.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {stock.price.toFixed(2)}</p>
                      <Badge variant="default" className="bg-success">
                        +{stock.change.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <CardTitle>Maiores Baixas do Dia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLosers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Sem dados de baixas disponíveis
                </p>
              ) : (
                topLosers.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {stock.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {stock.price.toFixed(2)}</p>
                      <Badge variant="destructive">
                        {stock.change.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
