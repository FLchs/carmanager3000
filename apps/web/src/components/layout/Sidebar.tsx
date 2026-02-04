import { Car, Home } from "lucide-react";

import { SidebarItem } from "./SidebarItem";

function Sidebar() {
  return (
    <div className="bg-elevated border-highlight flex h-screen min-w-44 flex-col gap-2 border-r-1 p-2">
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
