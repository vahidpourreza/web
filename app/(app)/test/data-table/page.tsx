import { DataTable } from "@/components/data-table/data-table"
import { outlineColumns, type OutlineRow } from "@/components/data-table/outline-columns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockData: OutlineRow[] = [
  { id: "1",  header: "صفحه جلد",                              sectionType: "cover-page",         status: "in-process", target: 18, limit: 5,  reviewer: "علی رضایی" },
  { id: "2",  header: "فهرست مطالب",                           sectionType: "table-of-contents",  status: "done",       target: 29, limit: 24, reviewer: "علی رضایی" },
  { id: "3",  header: "خلاصه اجرایی",                          sectionType: "narrative",           status: "done",       target: 10, limit: 13, reviewer: "علی رضایی" },
  { id: "4",  header: "رویکرد فنی",                            sectionType: "narrative",           status: "done",       target: 27, limit: 23, reviewer: "سارا محمدی" },
  { id: "5",  header: "طراحی",                                 sectionType: "narrative",           status: "in-process", target: 2,  limit: 16, reviewer: "سارا محمدی" },
  { id: "6",  header: "قابلیت‌ها",                             sectionType: "narrative",           status: "in-process", target: 20, limit: 8,  reviewer: "سارا محمدی" },
  { id: "7",  header: "یکپارچه‌سازی با سیستم‌های موجود",        sectionType: "narrative",           status: "in-process", target: 19, limit: 21, reviewer: "سارا محمدی" },
  { id: "8",  header: "نوآوری و مزایا",                        sectionType: "narrative",           status: "done",       target: 25, limit: 26, reviewer: null },
  { id: "9",  header: "مروری بر راه‌حل‌های نوآورانه",           sectionType: "technical-content",  status: "done",       target: 7,  limit: 23, reviewer: null },
  { id: "10", header: "الگوریتم‌های پیشرفته و یادگیری ماشین",  sectionType: "narrative",           status: "done",       target: 30, limit: 28, reviewer: null },
  { id: "11", header: "امنیت داده و انطباق",                   sectionType: "narrative",           status: "in-process", target: 14, limit: 18, reviewer: "علی رضایی" },
  { id: "12", header: "معماری کلی سیستم",                      sectionType: "technical-content",  status: "done",       target: 22, limit: 20, reviewer: "سارا محمدی" },
  { id: "13", header: "طراحی تجربه کاربری",                    sectionType: "narrative",           status: "in-process", target: 8,  limit: 12, reviewer: null },
  { id: "14", header: "استراتژی یکپارچه‌سازی API",             sectionType: "technical-content",  status: "done",       target: 15, limit: 17, reviewer: "علی رضایی" },
  { id: "15", header: "معیارهای عملکرد",                       sectionType: "technical-content",  status: "in-process", target: 11, limit: 14, reviewer: null },
  { id: "16", header: "برنامه مقیاس‌پذیری",                    sectionType: "narrative",           status: "done",       target: 9,  limit: 11, reviewer: "سارا محمدی" },
  { id: "17", header: "مدیریت ریسک",                           sectionType: "narrative",           status: "in-process", target: 6,  limit: 9,  reviewer: "علی رضایی" },
  { id: "18", header: "توجیه بودجه",                           sectionType: "narrative",           status: "done",       target: 13, limit: 15, reviewer: null },
  { id: "19", header: "جدول زمانی و نقاط عطف",                 sectionType: "narrative",           status: "in-process", target: 4,  limit: 7,  reviewer: "سارا محمدی" },
  { id: "20", header: "برنامه نیروی انسانی",                   sectionType: "narrative",           status: "done",       target: 17, limit: 19, reviewer: null },
  { id: "21", header: "اطلاعات پیمانکار فرعی",                 sectionType: "narrative",           status: "in-process", target: 5,  limit: 8,  reviewer: null },
  { id: "22", header: "فرآیند تضمین کیفیت",                    sectionType: "narrative",           status: "done",       target: 12, limit: 14, reviewer: "علی رضایی" },
  { id: "23", header: "برنامه انتقال",                          sectionType: "narrative",           status: "in-process", target: 3,  limit: 6,  reviewer: null },
  { id: "24", header: "طراحی زیرساخت ابری",                    sectionType: "technical-content",  status: "done",       target: 21, limit: 22, reviewer: "سارا محمدی" },
  { id: "25", header: "استانداردهای همکاری‌پذیری",              sectionType: "technical-content",  status: "in-process", target: 16, limit: 18, reviewer: "علی رضایی" },
  { id: "26", header: "برنامه بازیابی از فاجعه",               sectionType: "technical-content",  status: "done",       target: 10, limit: 12, reviewer: null },
  { id: "27", header: "گواهینامه‌های انطباق",                   sectionType: "narrative",           status: "in-process", target: 7,  limit: 10, reviewer: null },
  { id: "28", header: "پیوست الف – رزومه‌ها",                  sectionType: "narrative",           status: "done",       target: 20, limit: 25, reviewer: "علی رضایی" },
  { id: "29", header: "پیوست ب – پروژه‌های گذشته",              sectionType: "narrative",           status: "done",       target: 18, limit: 20, reviewer: null },
  { id: "30", header: "پیوست ج – نامه‌های حمایتی",              sectionType: "narrative",           status: "in-process", target: 5,  limit: 7,  reviewer: null },
]

export default function DataTablePage() {
  return (
    <div className="p-6 space-y-4">
      <Tabs defaultValue="outline">
        <TabsList>
          <TabsTrigger value="outline">طرح کلی</TabsTrigger>
          <TabsTrigger value="past-performance" className="gap-1.5">
            عملکرد گذشته
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel" className="gap-1.5">
            پرسنل کلیدی
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">اسناد تمرکز</TabsTrigger>
        </TabsList>

        <TabsContent value="outline" className="mt-4">
          <DataTable columns={outlineColumns} data={mockData} />
        </TabsContent>

        <TabsContent value="past-performance" className="mt-4">
          <p className="text-muted-foreground text-sm">محتوای عملکرد گذشته اینجا قرار می‌گیرد.</p>
        </TabsContent>

        <TabsContent value="key-personnel" className="mt-4">
          <p className="text-muted-foreground text-sm">محتوای پرسنل کلیدی اینجا قرار می‌گیرد.</p>
        </TabsContent>

        <TabsContent value="focus-documents" className="mt-4">
          <p className="text-muted-foreground text-sm">محتوای اسناد تمرکز اینجا قرار می‌گیرد.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
