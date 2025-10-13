import { type ReactNode, useState } from "react";

import { useClickOutside } from "../../hooks/useClickOutside";

function Menu({ items }: { items: ReactNode[] }) {
  const [visible, setVisible] = useState(false);

  const ref = useClickOutside(() => setVisible(false));
  return (
    <div ref={ref}>
      <span
        className="text-text-muted hover:text-white hover:cursor-pointer h-6"
        onClick={() => setVisible(!visible)}
      >
        ⠇
      </span>
      {visible && (
        <div className="absolute bg-bg border-border border-1 rounded flex flex-col gap-1 text-text-muted">
          {items.map((item) => {
            return (
              <div
                onClick={() => {
                  setVisible(false);
                }}
                className="hover:bg-bg-light w-full px-4 py-2 hover:cursor-pointer hover:text-text"
                key={Math.random()}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;
