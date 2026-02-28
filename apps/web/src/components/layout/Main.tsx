import { Outlet } from "@tanstack/react-router";

export default function Main() {
  return (
    <div className="flex-1 justify-start p-4 text-text">
      <Outlet />
    </div>
  );
}
