import { Car, ChevronsLeft, Home, Settings } from "lucide-react";
import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";
import { Item } from "./Item";
import { SectionItem } from "./SectionItem";

export const SidebarContext = createContext({
  collapsed: false,
  setCollapsed: (_collapsed: boolean) => {},
  toggleCollapse: () => {},
});

function SidebarContextProvider({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((isCollapsed) => !isCollapsed);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

function SidebarContent() {
  const { collapsed, toggleCollapse } = useContext(SidebarContext);

  return (
    <nav
      className={`sticky top-0 box-border h-screen shrink-0 overflow-hidden border-r border-border p-2 text-text-muted transition-all duration-500 ${collapsed ? "w-14" : "w-62"}`}
    >
      <div className="flex items-center justify-end gap-2 text-nowrap">
        <span className="ml-2 font-bold text-primary">CM3K</span>
        <button
          className="ml-auto cursor-pointer rounded-lg p-2 hover:bg-bg"
          onClick={toggleCollapse}
        >
          <ChevronsLeft className={`transition-all ${collapsed && "rotate-180"}`} />
        </button>
      </div>
      <ul>
        <Item icon={<Home />} label="Home" to="/" />
        <Item icon={<Car />} label="Vehicles" to="/vehicles" />
        <SectionItem to="/administration" label="Settings" icon={<Settings />}>
          <Item label="Document types" to="/administration/document-types" />
        </SectionItem>
      </ul>
    </nav>
  );
}

export default function Sidebar() {
  return (
    <SidebarContextProvider>
      <SidebarContent />
    </SidebarContextProvider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
