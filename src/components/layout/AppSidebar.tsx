
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  Home, 
  BedDouble, 
  MessageSquare, 
  UserCheck, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppSidebar() {
  const { role, logout, switchRole } = useUser();
  const [currentRole, setCurrentRole] = useState(role);

  const handleRoleChange = (value: string) => {
    setCurrentRole(value as "student" | "admin" | null);
    switchRole(value as "student" | "admin" | null);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-hostel-purple rounded-md p-1">
            <BedDouble size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-hostel-purple">HostelHub</h2>
            <p className="text-xs text-muted-foreground">Guardian System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2">
            <Select onValueChange={handleRoleChange} value={currentRole || undefined}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Warden/Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/rooms" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <BedDouble size={20} />
                    <span>Room Allocation</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/complaints" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <MessageSquare size={20} />
                    <span>Complaints</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/visitors" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <UserCheck size={20} />
                    <span>Visitor Log</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/notices" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <Bell size={20} />
                    <span>Notice Board</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    className={({ isActive }) => 
                      isActive ? "text-hostel-purple font-medium" : "text-foreground"
                    }
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={logout}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
