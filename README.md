# Magic Team — الموقع الاستعراضي + لوحة التحكم

## التشغيل
```bash
npm install
npm run dev -- -p 3100
```
- الموقع: http://localhost:3100/ar (والإنكليزي على `/en`) — صفحات: `/ar/services` · `/ar/work` · `/ar/team` · `/ar/contact`
- وضع العرض: `/ar/present` — أو عرض مخصص: `/ar/present/<slug>`
- لوحة التحكم: http://localhost:3100/admin — كلمة المرور من `ADMIN_PASSWORD` بملف `.env.local` (انسخ `.env.example`)

## وضع العرض
الأسهم أو Space للتنقل، `F` لملء الشاشة، `Home`/`End` للبداية والنهاية. العروض المخصصة تنسوّى من لوحة التحكم ← العروض المخصصة.

## البيانات
- المحتوى كله (عربي + إنكليزي) محفوظ بـ `data/content.json`، ويتولد من البيانات التجريبية (`lib/seed.ts`) أول مرة.
- رسائل نموذج التواصل: `data/messages.json`، والصور المرفوعة: `data/uploads/`.
- كل القراءة والكتابة تمر عبر `lib/store.ts` فقط. قبل الرفع على استضافة Serverless (مثل Vercel) لازم نبدل هذا الملف بقاعدة بيانات وتخزين (مثل Supabase)، لأن ملفات السيرفر هناك ما تنحفظ.

## الهوية
- الألوان والخطوط من دليل الهوية: `#200024` `#EB70FA` `#FAC3FD` `#B3E9FC` `#F5FCA9` `#9CFC8D`، Montserrat للإنكليزي.
- الخط العربي حالياً IBM Plex Sans Arabic (بديل مجاني لـ Helvetica Arabic). ضيف ملفات Helvetica Arabic المرخصة بـ `public/fonts` وبدّل التعريف بـ `lib/fonts.ts`.
- الشعار مستخرج كـ vector من ملف الهوية: `public/brand/logo.svg` و `mark.svg`.

## البنية
- `app/[locale]` الموقع والعروض · `app/admin` لوحة التحكم · `components/site` أقسام الموقع · `components/admin` المحرر
- `lib/pages.ts` يحدد صفحات الموقع وأي قسم بأي صفحة. ترتيب الأقسام وإخفاؤها من لوحة التحكم، والصفحة اللي كل أقسامها مخفية تختفي من القائمة.
- `lib/schema.ts` يعرّف حقول كل قسم بلوحة التحكم — إضافة حقل جديد = سطر واحد هنا.
