import { TrendingUp, TrendingDown } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { getAllRates, getAllStocks } from "@/services/dashboardService";
import { Rates, CurrencyItem, ratesToCurrencyListWithChange } from "@/components/model/rates";
import { StockList, Stocks } from "@/components/model/stock";

export default function MarketData() {
const { role } = useAuth();
const { loading, setLoading } = useLoading();
const [reload, setReload] = useState(0);


const [dataRates, setDataRates] = useState<Rates>();
const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
const [stock, setStock] = useState<StockList>();
const [stockAsc, setStockAsc] = useState<Stocks[]>([]);
const [stockDesc, setStockDesc] = useState<Stocks[]>([]);
const [pageAsc, setPageAsc] = useState(0);
const [pageDesc, setPageDesc] = useState(0);
const pageSize = 5;

const [pageCurrencies, setPageCurrencies] = useState(0);
const pageSizeCurrencies = 10;


useEffect(() => {
      if (!role) return;
        getRates();
        getStocks();
  }, [role, reload]);


async function getRates() {
  setLoading(true);
  const  result = await getAllRates();
  setDataRates(result);
  const list = ratesToCurrencyListWithChange(result.todayRates, result.previousRates);
  setCurrencies(list);
  setLoading(false);
}

async function getStocks() {
  setLoading(true);
  const  response = await getAllStocks();
  setStock(response.results);
  let desc = orderByChangePercent(response.results, "asc", "negative");
  let asc  = orderByChangePercent(response.results, "desc", "positive");
  setStockDesc(desc);
  setStockAsc(asc);
  setLoading(false);
}
function orderByChangePercent(
  stocks: Stocks[],
  direction: "asc" | "desc",
  filter?: "positive" | "negative"
) {
  if (!Array.isArray(stocks)) return []

  return stocks
    .filter(stock => {
      const value = stock.regularMarketChangePercent ?? 0

      if (filter === "positive") return value > 0
      if (filter === "negative") return value < 0
      return true
    })
    .sort((a, b) => {
      const aValue = a.regularMarketChangePercent ?? 0
      const bValue = b.regularMarketChangePercent ?? 0

      return direction === "asc"
        ? aValue - bValue
        : bValue - aValue
    })
}


function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

function paginate<T>(items: T[], page: number, size: number) {
  const start = page * size;
  return items.slice(start, start + size);
}


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cotações e Investimentos do Dia</h1>
        <p className="text-muted-foreground">
          Acompanhe as principais cotações e movimentações do mercado
        </p>
      </div>

      {/* Currency Rates */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Cotações de Moedas</CardTitle>
        </CardHeader>
        <CardContent>
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
                {loading && <p>Carregando...</p>}

                {!loading && paginate(currencies, pageCurrencies, pageSizeCurrencies).map((currency) => (
                  <TableRow key={currency.code}>
                    <TableCell className="font-medium">
                      {currency.code}
                    </TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="text-right">
                      R$ { round((1 / currency.rate))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          currency.change >= 0 ? "default" : "destructive"
                        }
                        className={currency.change >= 0 ? "bg-success" : ""}
                      >
                        {currency.change >= 0 ? "+" : ""}
                        {round(currency.change)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile: lista */}
          <div className="md:hidden space-y-2">
            {paginate(currencies, pageCurrencies, pageSizeCurrencies).map((currency) => (
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
          <div className="flex justify-between items-center mt-4">
            <button
              className="btn cursor-pointer"
              disabled={pageCurrencies === 0}
              onClick={() => setPageCurrencies((p) => p - 1)}
            >
              Anterior
            </button>

            <span className="text-sm text-muted-foreground">
              Página {pageCurrencies + 1} de {Math.ceil(currencies.length / pageSizeCurrencies)}
            </span>

            <button
              className="btn cursor-pointer"
              disabled={(pageCurrencies + 1) * pageSizeCurrencies >= currencies.length}
              onClick={() => setPageCurrencies((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
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
              {paginate(stockAsc, pageAsc, pageSize).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {stock.longName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {stock.regularMarketPrice.toFixed(2)}</p>
                    <Badge variant="default" className="bg-success">
                      +{stock.regularMarketChangePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}
               <div className="flex justify-between mt-4">
                  <button
                    className="btn cursor-pointer"
                    disabled={pageAsc === 0}
                    onClick={() => setPageAsc((p) => p - 1)}
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-muted-foreground">
                    Página {pageAsc + 1} de {Math.ceil(stockAsc.length / pageSize)}
                  </span>

                  <button
                    className="btn cursor-pointer"
                    disabled={(pageAsc + 1) * pageSize >= stockAsc.length}
                    onClick={() => setPageAsc((p) => p + 1)}
                  >
                    Próxima
                  </button>
                </div>
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
              {paginate(stockDesc, pageDesc, pageSize).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {stock.longName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {stock.regularMarketPrice.toFixed(2)}</p>
                    <Badge variant="destructive">
                      {stock.regularMarketChangePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}
                <div className="flex justify-between mt-4">
                  <button
                    className="btn cursor-pointer"
                    disabled={pageDesc === 0}
                    onClick={() => setPageDesc((p) => p - 1)}
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-muted-foreground">
                    Página {pageDesc + 1} de {Math.ceil(stockDesc.length / pageSize)}
                  </span>

                  <button
                    className="btn cursor-pointer"
                    disabled={(pageDesc + 1) * pageSize >= stockDesc.length}
                    onClick={() => setPageDesc((p) => p + 1)}
                  >
                    Próxima
                  </button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
