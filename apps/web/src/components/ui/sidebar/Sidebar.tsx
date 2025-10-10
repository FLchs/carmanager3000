import { Car, Home } from "lucide-react";

import { SidebarItem } from "./SidebarItem";

function Sidebar() {
  return (
    <div className="flex flex-col gap-2 bg-elevated min-w-44 h-screen p-2 border-r-1 border-highlight">
      <SidebarItem to="/">
        <Home size={18} /> Home
      </SidebarItem>
      <SidebarItem to="/vehicles">
        <Car size={18} /> Vehicles
      </SidebarItem>
    </div>
  );
}

export default Sidebar;
