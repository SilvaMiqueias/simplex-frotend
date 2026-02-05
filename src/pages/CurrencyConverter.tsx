import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import { getAllRates } from "@/services/dashboardService";
import { CurrencyItem, Rates, ratesToCurrencyListWithChange } from "@/components/model/rates";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const { loading, setLoading } = useLoading();
  const { role } = useAuth();
  const [reload, setReload] = useState(0);
  const [dataRates, setDataRates] = useState<Rates>();
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  
  
  useEffect(() => {
        if (!role) return;
          getRates();
    }, [role, reload]);


  async function getRates() {
    setLoading(true);
    const  result = await getAllRates();
    setDataRates(result);
    const list = ratesToCurrencyListWithChange(result.todayRates, result.previousRates);
   setCurrencies([
          { code: "BRL", name: "Real Brasileiro", rate: 1 },
          ...list,
    ]);
    setLoading(false);
  }


  const getRate = (code: string) => {
    return currencies.find((c) => c.code === code)?.rate || 1;
  };

  const calculateConversion = () => {
    const amountNum = parseFloat(amount) || 0;
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);

    // Convert to BRL first, then to target currency
    const inBRL = fromCurrency === "BRL" ? amountNum : amountNum / fromRate;
    const result = toCurrency === "BRL" ? inBRL : inBRL * toRate;

    return result;
  };

  const getExchangeRate = () => {
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);

    if (fromCurrency === "BRL") {
      return toRate;
    } else if (toCurrency === "BRL") {
      return 1 / fromRate;
    } else {
      return toRate / fromRate;
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const ratesWithoutBRL = currencies.filter(
  (c) => c.code !== "BRL"
  );

  const totalPages = Math.ceil(
    ratesWithoutBRL.length / ITEMS_PER_PAGE
  );

  const paginatedRates = ratesWithoutBRL.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


   return (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold">Conversão de Moedas</h1>
      <p className="text-muted-foreground">
        Converta valores entre diferentes moedas
      </p>
    </div>

    {/* Loading */}
    {loading || currencies.length === 0 ? (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Carregando cotações…
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversor */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
            <CardTitle>Conversor</CardTitle>
            <Button
              variant="outline"
              onClick={swapCurrencies}
              className="w-full sm:w-auto"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Inverter
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* De */}
            <div className="space-y-2">
              <Label>De</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  disabled={loading}
                />

                <Select
                  value={fromCurrency}
                  onValueChange={setFromCurrency}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.code}
                        value={currency.code}
                      >
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Para */}
            <div className="space-y-2">
              <Label>Para</Label>
              <Select
                value={toCurrency}
                onValueChange={setToCurrency}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.code}
                      value={currency.code}
                    >
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resultado */}
            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                Resultado
              </p>

              <p className="text-3xl sm:text-4xl font-bold text-primary">
                {calculateConversion().toFixed(2)} {toCurrency}
              </p>

              <p className="text-sm text-muted-foreground">
                Taxa de câmbio: 1 {fromCurrency} ={" "}
                {getExchangeRate().toFixed(4)} {toCurrency}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Taxas */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Tabela de Taxas</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-2">
              {paginatedRates.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {currency.code} - {currency.name}
                      </span>
                      {currency.change !== undefined && (
                        <span
                          className={`text-sm ${
                            currency.change >= 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {currency.change >= 0 ? "▲" : "▼"}{" "}
                          {currency.change.toFixed(2)}%
                        </span>
                      )}
                    </div>

                    <span className="text-muted-foreground">
                      1 BRL = {currency.rate.toFixed(4)}{" "}
                      {currency.code}
                    </span>
                  </div>
                ))}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        Anterior
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(totalPages, p + 1)
                          )
                        }
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
              </div>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
);
}
