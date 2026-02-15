import type { Metadata } from "next";
import { ShieldCheckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "گروه‌های دسترسی",
};

export default function AccessGroupsPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheckIcon className="size-6" />
        <h1 className="text-2xl font-bold">گروه‌های دسترسی</h1>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl p-6">
        <p className="text-muted-foreground">مدیریت گروه‌های دسترسی در اینجا نمایش داده می‌شود.</p>
      </div>
    </>
  );
}
