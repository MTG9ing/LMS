import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import navItems from "@/data/navItems";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AppSideBar() {
  const [openMenus, setOpenMenus] = useState({});
  const { open } = useSidebar();
  const toggleDropdown = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.children ? (
                    <SidebarMenuButton
                      asChild
                      onClick={() =>
                        item.children ? toggleDropdown(item.id) : null
                      }
                    >
                      <Link to={item.to}>
                        <item.icon className={!open && "text-green-600"} />
                        <span>{item.label}</span>
                        {item.children && (
                          <ChevronDown
                            className={`ml-auto transition-transform ${
                              openMenus[item.id] ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.to}>
                        <item.icon className={!open && "text-green-600"} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {item.children && openMenus[item.id] && (
                    <div className="flex flex-col">
                      {item.children.map((child) => (
                        <Link to={child.to} key={child.id}>
                          <SidebarMenuButton asChild>
                            <span>
                              <child.icon />
                              {child.label}
                            </span>
                          </SidebarMenuButton>
                        </Link>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
