import { User, Mail, Phone, MapPin, Moon, Sun, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { UserDetail } from "@/components/model/user";

export default function Settings() {
 const { theme, setTheme } = useTheme();
 const { getUser, role, email } = useAuth();
 const [reload, setReload] = useState(0);
 const { setLoading } = useLoading();
 const [user, setUser] = useState<UserDetail | undefined>(); 
 

 useEffect(() => {
       if (!role) return;
         findUser();
   }, [role, reload]);
 
 
 async function findUser() {
        const  result = await getUser(email);
        setUser(result);
  }
  
  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perfil e Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Informações do Perfil</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/foto.png" alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center sm:items-start">
              <Button variant="outline" size="sm">
                Alterar Foto
              </Button>
              <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">
                JPG, PNG ou GIF (max. 2MB)
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  defaultValue="João da Silva"
                  value={user?.name}
                  className="pl-9"
                />
              </div>
            </div>

              <div className="grid gap-2 md:col-span-2 ">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="joao@example.com"
                    value={user?.username}
                    className="pl-9 w-full"
                  />
                </div>
              </div>
          </div>

          <div className="flex gap-3 sm:justify-end">
            <Button className="w-full sm:w-auto">Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
