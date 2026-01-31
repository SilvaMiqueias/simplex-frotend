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
import { getAllRates } from "@/services/dashboardService";
import { Rates, CurrencyItem, ratesToCurrencyListWithChange } from "@/components/model/rates";


const mockCurrencies = [
  { code: "USD", name: "Dólar Americano", rate: 5.12, change: 1.2 },
  { code: "EUR", name: "Euro", rate: 5.45, change: -0.8 },
  { code: "GBP", name: "Libra Esterlina", rate: 6.28, change: 0.5 },
  { code: "JPY", name: "Iene Japonês", rate: 0.038, change: -0.3 },
  { code: "ARS", name: "Peso Argentino", rate: 0.0054, change: -2.1 },
];

const mockTopGainers = [
  { symbol: "PETR4", name: "Petrobras", price: 38.45, change: 4.8 },
  { symbol: "VALE3", name: "Vale", price: 62.3, change: 3.2 },
  { symbol: "ITUB4", name: "Itaú", price: 28.9, change: 2.7 },
];

const mockTopLosers = [
  { symbol: "MGLU3", name: "Magazine Luiza", price: 2.15, change: -5.2 },
  { symbol: "VVAR3", name: "Via Varejo", price: 1.82, change: -4.1 },
  { symbol: "AZUL4", name: "Azul", price: 9.2, change: -3.8 },
];

export default function MarketData() {
const { role } = useAuth();
const { loading, setLoading } = useLoading();
const [reload, setReload] = useState(0);


const [dataRates, setDataRates] = useState<Rates>();
const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);



useEffect(() => {
      if (!role) return;
        getRates();
  }, [role, reload]);


async function getRates() {
  setLoading(true);
  const  result = await getAllRates();
  setDataRates(result);
  const list = ratesToCurrencyListWithChange(result.todayRates, result.previousRates);
  setCurrencies(list);
  setLoading(false);
}

function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
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

                {!loading && currencies.map((currency) => (
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
            {mockCurrencies.map((currency) => (
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
              {mockTopGainers.map((stock) => (
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
              ))}
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
              {mockTopLosers.map((stock) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
