import { Outlet } from "react-router-dom";
import { CourierBottomNav } from "./CourierBottomNav";

export function CourierLayout() {
  return (
    <div className="flex min-h-screen w-screen overflow-x-hidden px-3 flex-col pb-16">
      <Outlet />
      <CourierBottomNav />
    </div>
  );
}
