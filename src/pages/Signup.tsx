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
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { createUserCustomer, loginWithPassword, status } = useAuth();
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
   
    try{
      await createUserCustomer(name, email, password);
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar usuário");
    }finally{
      navigate("/login");
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
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground">
            Comece a gerenciar suas finanças hoje
          </p>
        </div>

        <Card className="shadow-large">
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>Preencha os dados abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                Criar conta
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary"
                onClick={() => navigate("/login")}
              >
                Fazer login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
