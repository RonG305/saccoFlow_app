import { Outlet } from "react-router-dom";
import { CourierBottomNav } from "./CourierBottomNav";

export function CourierLayout() {
  return (
    <div className="flex min-h-screen px-1 w-screen overflow-x-hidden  mb-5 flex-col pb-16">
      <Outlet />
      <CourierBottomNav />
    </div>
  );
}
