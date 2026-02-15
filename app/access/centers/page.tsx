import type { Metadata } from "next";
import { BuildingIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "مراکز",
};

export default function CentersPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <BuildingIcon className="size-6" />
        <h1 className="text-2xl font-bold">مراکز</h1>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl p-6">
        <p className="text-muted-foreground">مدیریت مراکز در اینجا نمایش داده می‌شود.</p>
      </div>
    </>
  );
}
