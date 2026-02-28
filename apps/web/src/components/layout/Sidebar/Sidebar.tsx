import { Car, ChevronsLeft, Home, Settings } from "lucide-react";
import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";
import { Item } from "./Item";
import Section from "./Section";

export const SidebarContext = createContext({
  collapsed: false,
  setCollapsed: (_b: boolean) => {},
});

function SidebarContextProvider({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar() {
  const { collapsed, setCollapsed } = useContext(SidebarContext);
  const toggleColapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [setCollapsed, collapsed]);

  return (
    <nav
      className={`sticky top-0 box-border h-screen overflow-hidden border-r border-border p-2 text-text-muted transition-all duration-500 ${collapsed ? "w-14" : "w-62"}`}
    >
      <div className="flex items-center justify-end gap-2 text-nowrap">
        <span className="ml-2 font-bold text-primary">CM3K</span>
        <button
          className="ml-auto cursor-pointer rounded-lg p-2 hover:bg-bg"
          onClick={toggleColapse}
        >
          <ChevronsLeft className={`transition-all ${collapsed && "rotate-180"}`} />
        </button>
      </div>
      <ul className={`group/sidebar ${collapsed && "is-collapsed"}`}>
        <Item icon={<Home className="shrink-0" />} label="Home" to="/" />
        <Item icon={<Car />} label="Vehicles" to="/vehicles" />
        <Section label="Settings" icon={<Settings />}>
          <Item label="Document types" to="/administration/document-types" />
        </Section>
      </ul>
    </nav>
  );
}

export default function A() {
  return (
    <SidebarContextProvider>
      <Sidebar />
    </SidebarContextProvider>
  );
}
