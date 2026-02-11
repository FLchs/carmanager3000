import { Car, Home, SettingsIcon } from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { SidebarSectionItem } from "./SidebarSection/SidebarSectionItem";

function Sidebar() {
  return (
    <div className="bg-elevated flex h-screen min-w-44 flex-col gap-2 border-r border-highlight p-2">
      <SidebarItem to="/">
        <Home size={18} /> Home
      </SidebarItem>
      <SidebarItem to="/vehicles">
        <Car size={18} /> Vehicles
      </SidebarItem>
      <SidebarSection
        // className="mt-auto"
        item={
          <>
            <SettingsIcon size={18} /> Administration
          </>
        }
      >
        <SidebarSectionItem to="/administration/document-types">Document types</SidebarSectionItem>
        <SidebarSectionItem to="/vehicles">Operation types</SidebarSectionItem>
      </SidebarSection>
    </div>
  );
}

export default Sidebar;
