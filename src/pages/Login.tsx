import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithPassword } = useAuth();
  const { status } = useAuth();


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await loginWithPassword(email, password);

    /**
     * Se o backend exigir 2FA,
     * o status vira "2fa_pending"
     */
    if (status === "2fa_required" ||
      status === "2fa_setup") {
      navigate("/2fa");
      return;
    }

    /**
     * Se login completo (sem 2FA)
     */
    if (status === "authenticated") {
      navigate("/dashboard");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao fazer login");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/simplex-removebg-preview.png"
            alt="Simplex"
            className="mx-auto h-16 w-16 mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <Card className="shadow-large">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Acesse sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate("/signup")}
                >
                  Criar conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
