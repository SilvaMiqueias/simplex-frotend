import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  TrendingUp,
  Repeat2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const baseMenu = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transações", url: "/transactions", icon: ArrowLeftRight },
  { title: "Cotações/Investimentos", url: "/market-data", icon: TrendingUp },
  { title: "Conversão de Moedas", url: "/currency-converter", icon: Repeat2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { role } = useAuth();

const menuItems =
  role === "ROLE_CUSTOMER"
    ? [
        baseMenu[0],
        baseMenu[1],
        {
          title: "Orçamentos/Metas",
          url: "/budgets",
          icon: Target,
        },
        ...baseMenu.slice(2),
      ]
    : baseMenu;
    
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-sidebar"
    >
      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-0">
        {/* Logo */}
        <div className="px-3 mb-3 group-data-[collapsible=icon]:px-0">
          <div className="flex items-center gap-3 h-12 group-data-[collapsible=icon]:justify-center">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-medium overflow-hidden">
              <img
                src="/simplex.png"
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            {state === "expanded" && (
              <span className="font-semibold text-xl leading-none tracking-tight">
                Simplex
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <SidebarGroup className="pt-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    size="lg"
                    tooltip={item.title}
                    className={`
                      transition-smooth group-data-[collapsible=icon]:mx-auto
                      ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "hover:bg-secondary"
                      }
                    `}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3"
                    >
                      <item.icon strokeWidth={1.5} />
                      {state === "expanded" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
