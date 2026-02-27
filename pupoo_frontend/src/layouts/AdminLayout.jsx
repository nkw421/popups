import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminTopbar from "../admin/AdminTopbar";
import AuthOverlay from "../components/auth/AuthOverlay";

export default function AdminLayout() {
  return (
    <>
      <AuthOverlay />        {/* ← 이것만 추가 */}
      {/* 기존 사이드바, Outlet 등 */}
    </>
  );
}
export default function AdminLayout() {
  return (
    <div className="min-h-dvh bg-[var(--color-surface-2)]">
      <div className="flex min-h-dvh">
        <AdminSidebar />
        <div className="flex-1">
          <AdminTopbar />
          <div className="mx-auto max-w-7xl px-6 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
