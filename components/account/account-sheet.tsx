'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import { profileService, type ProfileUserResponse } from '@/api/services/access/profile';
import type { ApiResponse } from '@/types/api';
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

interface AccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSheet({ open, onOpenChange }: AccountSheetProps) {
  const [profile, setProfile] = useState<ProfileUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Name fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Username field
  const [username, setUsername] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);

  // Birthdate field
  const [birthDateText, setBirthDateText] = useState('');
  const [savingBirthDate, setSavingBirthDate] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch profile when sheet opens
  useEffect(() => {
    if (!open) return;

    async function fetchProfile() {
      setLoading(true);
      const { ok, data, messages }: ApiResponse<ProfileUserResponse> = await profileService.get();
      if (!ok || !data) {
        toast.error(messages);
      } else if (data.firstName) {
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setUsername(data.username ?? '');
        if (data.birthDay) {
          setBirthDateText(data.birthDay.split('T')[0] ?? '');
        }
      }
      setLoading(false);
    }

    fetchProfile();
  }, [open]);

  function handleOpenChange(value: boolean) {
    if (!value) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setActiveTab('personal');
      setErrors({});
    }
    onOpenChange(value);
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSaveName() {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSavingName(true);
    const { ok, messages } = await profileService.updateFullName({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    if (!ok) {
      toast.error(messages);
    } else {
      toast.success('نام با موفقیت ذخیره شد');
      setProfile((prev) =>
        prev ? { ...prev, firstName: firstName.trim(), lastName: lastName.trim() } : prev,
      );
    }
    setSavingName(false);
  }

  async function handleSaveUsername() {
    if (!username.trim()) {
      setErrors({ username: 'نام کاربری الزامی است' });
      return;
    }
    setSavingUsername(true);
    const { ok, messages } = await profileService.setUserName({ username: username.trim() });
    if (!ok) {
      toast.error(messages);
    } else {
      toast.success('نام کاربری با موفقیت ذخیره شد');
      setProfile((prev) => (prev ? { ...prev, username: username.trim() } : prev));
    }
    setSavingUsername(false);
  }

  async function handleSaveBirthDate() {
    if (!birthDateText.trim()) {
      setErrors((prev) => ({ ...prev, birthDate: 'تاریخ تولد الزامی است' }));
      return;
    }
    setSavingBirthDate(true);
    const { ok, messages } = await profileService.updateDateOfBirth({ birthDay: birthDateText.trim() });
    if (!ok) {
      toast.error(messages);
    } else {
      toast.success('تاریخ تولد با موفقیت ذخیره شد');
      setProfile((prev) => (prev ? { ...prev, birthDay: birthDateText.trim() } : prev));
    }
    setSavingBirthDate(false);
  }

  async function handleSavePassword() {
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
    if (!newPassword) newErrors.newPassword = 'رمز عبور جدید الزامی است';
    if (!confirmPassword) newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
    }
    if (newPassword && newPassword.length < 6) {
      newErrors.newPassword = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSavingPassword(true);
    const { ok, messages } = await profileService.changePassword({ currentPassword, newPassword });
    if (!ok) {
      toast.error(messages);
    } else {
      toast.success('رمز عبور با موفقیت تغییر کرد');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  }

  async function handleSave() {
    setErrors({});
    switch (activeTab) {
      case 'personal':
        await handleSaveName();
        break;
      case 'account':
        if (!hasUsername && username.trim()) await handleSaveUsername();
        if (birthDateText.trim()) await handleSaveBirthDate();
        break;
      case 'security':
        await handleSavePassword();
        break;
    }
  }

  const saveLabels: Record<string, [string, string]> = {
    personal: ['ذخیره مشخصات', 'در حال ذخیره...'],
    account: ['ذخیره اطلاعات', 'در حال ذخیره...'],
    security: ['تغییر رمز عبور', 'در حال تغییر...'],
  };

  const isSaving = savingName || savingUsername || savingBirthDate || savingPassword;
  const initials = profile ? profile.firstName.charAt(0) + profile.lastName.charAt(0) : '';
  const hasUsername = !!profile?.username;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>حساب کاربری</SheetTitle>
          <SheetDescription>مشاهده و ویرایش اطلاعات پروفایل</SheetDescription>
        </SheetHeader>

        {loading ? (
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
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    setActiveTab(v);
                    setErrors({});
                  }}
                  className="w-full"
                >
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
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          clearError('firstName');
                        }}
                        placeholder="نام"
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="lastName">
                        نام خانوادگی
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          clearError('lastName');
                        }}
                        placeholder="نام خانوادگی"
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName}</p>
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
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          clearError('username');
                        }}
                        placeholder="نام کاربری خود را وارد کنید"
                        disabled={hasUsername}
                        aria-invalid={!!errors.username}
                      />
                      {errors.username && (
                        <p className="text-xs text-destructive">{errors.username}</p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2.5">
                      <Label htmlFor="birthDate">تاریخ تولد</Label>
                      <Input
                        id="birthDate"
                        value={birthDateText}
                        onChange={(e) => {
                          setBirthDateText(e.target.value);
                          clearError('birthDate');
                        }}
                        placeholder="1380/01/15"
                        dir="ltr"
                        className="text-start"
                        aria-invalid={!!errors.birthDate}
                      />
                      {errors.birthDate && (
                        <p className="text-xs text-destructive">{errors.birthDate}</p>
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
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            clearError('currentPassword');
                          }}
                          placeholder="رمز عبور فعلی"
                          className="pe-9"
                          aria-invalid={!!errors.currentPassword}
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
                      {errors.currentPassword && (
                        <p className="text-xs text-destructive">{errors.currentPassword}</p>
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
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            clearError('newPassword');
                          }}
                          placeholder="رمز عبور جدید"
                          className="pe-9"
                          aria-invalid={!!errors.newPassword}
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
                      {errors.newPassword && (
                        <p className="text-xs text-destructive">{errors.newPassword}</p>
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
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearError('confirmPassword');
                          }}
                          placeholder="تکرار رمز عبور جدید"
                          className="pe-9"
                          aria-invalid={!!errors.confirmPassword}
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
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">{errors.confirmPassword}</p>
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
