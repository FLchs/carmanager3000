import { SidebarItem } from "./SidebarItem";

function Sidebar() {
  return (
    <div className="flex flex-col gap-2 bg-elevated min-w-44 h-screen p-2 border-r-1 border-highlight">
      <SidebarItem to="/">Home</SidebarItem>
      <SidebarItem to="/vehicles">Vehicles</SidebarItem>
    </div>
  );
}

export default Sidebar;
