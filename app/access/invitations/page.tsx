import { MailPlusIcon } from "lucide-react";

export default function InvitationsPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <MailPlusIcon className="size-6" />
        <h1 className="text-2xl font-bold">دعوت‌نامه‌ها</h1>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl p-6">
        <p className="text-muted-foreground">مدیریت دعوت‌نامه‌ها در اینجا نمایش داده می‌شود.</p>
      </div>
    </>
  );
}
