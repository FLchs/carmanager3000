import { useState } from "react";

import { useClickOutside } from "../../hooks/useClickOutside";

type Item = {
  callback: () => Promise<void> | void;
  label: string;
};

function Menu({ items }: { items: Item[] }) {
  const [visible, setVisible] = useState(false);

  const ref = useClickOutside(() => setVisible(false));
  return (
    <div ref={ref}>
      <span
        className="text-muted hover:text-white hover:cursor-pointer h-6"
        onClick={() => setVisible(!visible)}
      >
        ⠇
      </span>
      {visible && (
        <div className="absolute bg-elevated border-highlight border-1 rounded flex flex-col gap-1">
          {items.map((item) => {
            return (
              <span
                onClick={() => {
                  setVisible(false);
                  item.callback();
                }}
                className="hover:bg-surface w-full px-2 hover:cursor-pointer"
                key={item.label}
              >
                {item.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Menu;
