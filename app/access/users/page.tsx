import { UserIcon } from "lucide-react";

export default function UsersPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <UserIcon className="size-6" />
        <h1 className="text-2xl font-bold">کاربران</h1>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl p-6">
        <p className="text-muted-foreground">مدیریت کاربران در اینجا نمایش داده می‌شود.</p>
      </div>
    </>
  );
}
