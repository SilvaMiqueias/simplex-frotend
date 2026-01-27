import { useState, useEffect } from "react";
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
import { getRawRates } from "@/services/currencyService";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

interface Currency {
  code: string;
  name: string;
  rate: number;
}

const currencyNames: { [key: string]: string } = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  JPY: "Iene Japonês",
  AUD: "Dólar Australiano",
  CAD: "Dólar Canadense",
  CHF: "Franco Suíço",
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "BRL", name: "Real Brasileiro", rate: 1 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    loadRates();
  }, []);

  async function loadRates() {
    setIsLoading(true);
    setGlobalLoading(true);
    try {
      const data = await getRawRates();
      const currencyList: Currency[] = [
        { code: "BRL", name: "Real Brasileiro", rate: 1 },
      ];

      if (data.rates) {
        const mainCodes = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];
        for (const code of mainCodes) {
          const rate = (data.rates as any)[code.toLowerCase()] || (data.rates as any)[code];
          if (rate !== undefined) {
            currencyList.push({
              code,
              name: currencyNames[code] || code,
              rate: rate,
            });
          }
        }
      }

      setCurrencies(currencyList);
    } catch (error) {
      toast.error("Erro ao carregar cotações. Usando valores padrão.");
      setCurrencies([
        { code: "BRL", name: "Real Brasileiro", rate: 1 },
        { code: "USD", name: "Dólar Americano", rate: 0.17 },
        { code: "EUR", name: "Euro", rate: 0.16 },
        { code: "GBP", name: "Libra Esterlina", rate: 0.13 },
        { code: "JPY", name: "Iene Japonês", rate: 26.5 },
      ]);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversão de Moedas</h1>
        <p className="text-muted-foreground">
          Converta valores entre diferentes moedas (cotações em tempo real)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 ">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
            <CardTitle>Conversor</CardTitle>
            <Button
              variant="outline"
              onClick={swapCurrencies}
              className="w-full sm:w-auto"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Inverter
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative py-2">
              <div className="space-y-2">
                <Label>De</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-5">
                <Label>Para</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Resultado</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  {calculateConversion().toFixed(2)} {toCurrency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Taxa de câmbio: 1 {fromCurrency} ={" "}
                  {getExchangeRate().toFixed(4)} {toCurrency}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Tabela de Taxas (API Frankfurter)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {currencies.filter(c => c.code !== "BRL").map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="font-medium">
                    {currency.code} - {currency.name}
                  </span>
                  <span className="text-muted-foreground">
                    1 BRL = {currency.rate.toFixed(4)} {currency.code}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
