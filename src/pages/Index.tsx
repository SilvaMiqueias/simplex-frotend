import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from "@/context/LoadingContext";


const Index = () => {
  const navigate = useNavigate();

  const userName = "Simplex Teste";
  const userEmail = "simplesx@gmail.com";
  const userInitials = "ST";

  return (
    <LoadingProvider>
      <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Toaster />
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/50 flex items-center px-4 sm:px-6 md:px-8 glass sticky top-0 z-10">
            <SidebarTrigger className="hover:bg-secondary rounded-xl transition-smooth" />
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer rounded-full hover:shadow-medium transition-smooth">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/foto.png" alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64"
                >
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/foto.png" alt="Profile" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => navigate("/settings")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Meu perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onSelect={() => navigate("/login")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12">
            <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      </SidebarProvider>
    </LoadingProvider>
  );
};

export default Index;
