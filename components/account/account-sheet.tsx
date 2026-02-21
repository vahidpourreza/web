'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CameraIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  Loader2Icon,
  LockKeyholeIcon,
  UserIcon,
  UserCogIcon,
} from 'lucide-react';
import {
  useProfile,
  useUpdateFullName,
  useSetUsername,
  useUpdateDateOfBirth,
  useChangePassword,
} from '@/api/access/profile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// --- Zod Schemas ---

const personalSchema = z.object({
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
});

const accountSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  birthDate: z.string().min(1, 'تاریخ تولد الزامی است'),
});

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
    newPassword: z.string().min(6, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور جدید و تکرار آن مطابقت ندارند',
    path: ['confirmPassword'],
  });

type PersonalForm = z.infer<typeof personalSchema>;
type AccountForm = z.infer<typeof accountSchema>;
type SecurityForm = z.infer<typeof securitySchema>;

// --- Component ---

interface AccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSheet({ open, onOpenChange }: AccountSheetProps) {
  const [activeTab, setActiveTab] = useState('personal');

  // Password visibility toggles (UI-only, not form data)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Data ---

  const { data: profile, isLoading, isError, error, refetch } = useProfile({ enabled: open });
  const updateFullName = useUpdateFullName();
  const setUsername = useSetUsername();
  const updateDateOfBirth = useUpdateDateOfBirth();
  const changePassword = useChangePassword();

  // --- Forms ---

  const personalForm = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { username: '', birthDate: '' },
  });

  const securityForm = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // Reset forms when profile data loads
  useEffect(() => {
    if (!profile) return;
    personalForm.reset({ firstName: profile.firstName, lastName: profile.lastName });
    accountForm.reset({
      username: profile.username ?? '',
      birthDate: profile.birthDay ? (profile.birthDay.split('T')[0] ?? '') : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function handleOpenChange(value: boolean) {
    if (!value) {
      securityForm.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setActiveTab('personal');
    }
    onOpenChange(value);
  }

  // --- Submit Handlers ---

  async function onSubmitPersonal(data: PersonalForm) {
    await updateFullName.mutateAsync({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
    });
  }

  async function onSubmitAccount(data: AccountForm) {
    if (!hasUsername && data.username.trim()) {
      await setUsername.mutateAsync({ username: data.username.trim() });
    }
    if (data.birthDate.trim()) {
      await updateDateOfBirth.mutateAsync({ birthDay: data.birthDate.trim() });
    }
  }

  async function onSubmitSecurity(data: SecurityForm) {
    await changePassword.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    securityForm.reset();
  }

  async function handleSave() {
    switch (activeTab) {
      case 'personal':
        await personalForm.handleSubmit(onSubmitPersonal)();
        break;
      case 'account':
        await accountForm.handleSubmit(onSubmitAccount)();
        break;
      case 'security':
        await securityForm.handleSubmit(onSubmitSecurity)();
        break;
    }
  }

  const saveLabels: Record<string, [string, string]> = {
    personal: ['ذخیره مشخصات', 'در حال ذخیره...'],
    account: ['ذخیره اطلاعات', 'در حال ذخیره...'],
    security: ['تغییر رمز عبور', 'در حال تغییر...'],
  };

  const isSaving =
    personalForm.formState.isSubmitting ||
    accountForm.formState.isSubmitting ||
    securityForm.formState.isSubmitting ||
    updateFullName.isPending ||
    setUsername.isPending ||
    updateDateOfBirth.isPending ||
    changePassword.isPending;
  const initials = profile ? profile.firstName.charAt(0) + profile.lastName.charAt(0) : '';
  const hasUsername = !!profile?.username;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>حساب کاربری</SheetTitle>
          <SheetDescription>مشاهده و ویرایش اطلاعات پروفایل</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-sm text-destructive">
              {error?.message ?? 'خطا در بارگذاری اطلاعات'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </div>
        ) : profile ? (
          <>
            {/* Scrollable area — dir=ltr forces scrollbar to right side */}
            <div className="flex-1 min-h-0 overflow-y-auto" dir="ltr">
              <div dir="rtl" className="flex flex-col gap-4 px-4 py-4">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-20 w-20 text-lg">
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      className="absolute bottom-0 end-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm cursor-pointer"
                      title="تغییر عکس پروفایل"
                    >
                      <CameraIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{profile.mobile}</p>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="personal" className="flex-1">
                      <UserIcon className="size-3.5" />
                      مشخصات
                    </TabsTrigger>
                    <TabsTrigger value="account" className="flex-1">
                      <UserCogIcon className="size-3.5" />
                      حساب
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex-1">
                      <LockKeyholeIcon className="size-3.5" />
                      امنیت
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Tab */}
                  <TabsContent value="personal" className="flex flex-col gap-4 pt-2">
                    <div className="space-y-2.5">
                      <Label htmlFor="firstName">
                        نام
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        {...personalForm.register('firstName')}
                        placeholder="نام"
                        aria-invalid={!!personalForm.formState.errors.firstName}
                      />
                      {personalForm.formState.errors.firstName && (
                        <p className="text-xs text-destructive">
                          {personalForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="lastName">
                        نام خانوادگی
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        {...personalForm.register('lastName')}
                        placeholder="نام خانوادگی"
                        aria-invalid={!!personalForm.formState.errors.lastName}
                      />
                      {personalForm.formState.errors.lastName && (
                        <p className="text-xs text-destructive">
                          {personalForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Account Tab */}
                  <TabsContent value="account" className="flex flex-col gap-5 pt-2">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="username">نام کاربری</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="size-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>نام کاربری فقط یک بار قابل تنظیم است</TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="username"
                        {...accountForm.register('username')}
                        placeholder="نام کاربری خود را وارد کنید"
                        disabled={hasUsername}
                        aria-invalid={!!accountForm.formState.errors.username}
                      />
                      {accountForm.formState.errors.username && (
                        <p className="text-xs text-destructive">
                          {accountForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2.5">
                      <Label htmlFor="birthDate">تاریخ تولد</Label>
                      <Input
                        id="birthDate"
                        {...accountForm.register('birthDate')}
                        placeholder="1380/01/15"
                        dir="ltr"
                        className="text-start"
                        aria-invalid={!!accountForm.formState.errors.birthDate}
                      />
                      {accountForm.formState.errors.birthDate && (
                        <p className="text-xs text-destructive">
                          {accountForm.formState.errors.birthDate.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security" className="flex flex-col gap-4 pt-2">
                    <div className="space-y-2.5">
                      <Label htmlFor="currentPassword">
                        رمز عبور فعلی
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...securityForm.register('currentPassword')}
                          placeholder="رمز عبور فعلی"
                          className="pe-9"
                          aria-invalid={!!securityForm.formState.errors.currentPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showCurrentPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {securityForm.formState.errors.currentPassword && (
                        <p className="text-xs text-destructive">
                          {securityForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="newPassword">
                        رمز عبور جدید
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          {...securityForm.register('newPassword')}
                          placeholder="رمز عبور جدید"
                          className="pe-9"
                          aria-invalid={!!securityForm.formState.errors.newPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {securityForm.formState.errors.newPassword && (
                        <p className="text-xs text-destructive">
                          {securityForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="confirmPassword">
                        تکرار رمز عبور جدید
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...securityForm.register('confirmPassword')}
                          placeholder="تکرار رمز عبور جدید"
                          className="pe-9"
                          aria-invalid={!!securityForm.formState.errors.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {securityForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {securityForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t p-4 space-y-2">
              <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2Icon className="animate-spin" />}
                {isSaving
                  ? (saveLabels[activeTab]?.[1] ?? 'در حال ذخیره...')
                  : (saveLabels[activeTab]?.[0] ?? 'ذخیره')}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleOpenChange(false)}>
                بستن
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
