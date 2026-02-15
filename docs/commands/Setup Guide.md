# 🚀 Setup Guide

This guide walks you through installing **pnpm**, configuring Windows
Defender exclusion, and bootstrapping a **Next.js** project using
**shadcn/ui** with RTL support.

---

## 1️⃣ Install PNPM

Open **PowerShell as Administrator** and run:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

---

## 2️⃣ Add Windows Defender Exclusion for PNPM Store

To improve performance and prevent scanning issues:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

---

## 3️⃣ Create Next.js Project with shadcn/ui (RTL Enabled)

Run the following command:

```powershell
pnpm dlx shadcn@latest create --rtl --preset "https://ui.shadcn.com/init?base=radix&style=nova&baseColor=neutral&theme=blue&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=small&template=next&rtl=true" --template next
```

### ⚙️ Configuration Details

- **Base:** Radix
- **Style:** Nova
- **Theme:** Blue
- **Base Color:** Neutral
- **Icon Library:** Lucide
- **Font:** Inter
- **Menu Accent:** Subtle
- **Menu Color:** Default
- **Border Radius:** Small
- **Framework Template:** Next.js
- **RTL Support:** Enabled

---

## ✅ You're Ready!

After completion:

```powershell
cd your-project-name
pnpm install
pnpm dev
```
