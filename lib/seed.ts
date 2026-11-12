import type { CaseStudy, Content, Metric } from "./types";

const m = (
  ar: string,
  en: string,
  before: number,
  after: number,
  opts: Partial<Pick<Metric, "prefix" | "suffix" | "decimals" | "lowerIsBetter">> = {},
): Metric => ({
  label: { ar, en },
  before,
  after,
  prefix: opts.prefix ?? "",
  suffix: opts.suffix ?? "",
  decimals: opts.decimals ?? 0,
  lowerIsBetter: opts.lowerIsBetter ?? false,
});

const img = (id: string, part: string) => `/mock/cases/${id}-${part}.svg`;

const cases: CaseStudy[] = [
  {
    id: "dijla",
    client: "Dijla Roasters",
    logo: "/mock/logos/dijla.svg",
    industry: { ar: "سلسلة مقاهي", en: "Coffee chain" },
    color: "yellow",
    duration: { ar: "٨ أشهر", en: "8 months" },
    headline: { ar: "من مقهى محلي إلى ترند المدينة", en: "From a local café to the city's trend" },
    cover: img("dijla", "cover"),
    challenge: {
      title: { ar: "التحدي", en: "The challenge" },
      body: {
        ar: "قهوة ممتازة، بس محد يعرفها. حساب إنستغرام بـ ٤ آلاف متابع، إعلانات عشوائية، وفروع جديدة تفتح بدون جمهور ينتظرها.",
        en: "Great coffee that nobody knew about. 4K followers, random ads, and new branches opening with no audience waiting.",
      },
      image: img("dijla", "challenge"),
    },
    idea: {
      title: { ar: "الفكرة", en: "The idea" },
      body: {
        ar: "حوّلنا كل كوب إلى قصة: حملة \"فنجانك يحچي\" — كل زبون يصوّر كوبه ويحچي قصته، والأحسن يطلع على شاشة الفرع.",
        en: "We turned every cup into a story: \"Your cup talks\" — customers film their cup and share a story; the best ones play on the branch screen.",
      },
      image: img("dijla", "idea"),
    },
    execution: {
      title: { ar: "التنفيذ", en: "The execution" },
      body: {
        ar: "٤٠ ريلز بالشهر، تعاون مع ١٢ صانع محتوى، حملات ميتا وتيك توك موجهة حسب كل فرع، ونظام ولاء مربوط بالواتساب.",
        en: "40 reels a month, 12 creator collabs, Meta & TikTok campaigns targeted per branch, and a WhatsApp-linked loyalty flow.",
      },
      image: img("dijla", "execution"),
    },
    result: {
      title: { ar: "النتيجة", en: "The result" },
      body: {
        ar: "الطوابير صارت إعلان مجاني. ٣ فروع جديدة افتتحت ممتلئة من أول يوم.",
        en: "The queues became free advertising. 3 new branches opened fully booked from day one.",
      },
      image: img("dijla", "result"),
    },
    metrics: [
      m("المتابعين", "Followers", 4200, 86000, { suffix: "+" }),
      m("الطلبات الشهرية", "Monthly orders", 1200, 9800),
      m("تكلفة العميل", "Cost per lead", 4.5, 0.9, { prefix: "$", decimals: 1, lowerIsBetter: true }),
      m("نسبة التفاعل", "Engagement rate", 1.1, 7.4, { suffix: "%", decimals: 1 }),
    ],
  },
  {
    id: "noor",
    client: "Noor Dental",
    logo: "/mock/logos/noor.svg",
    industry: { ar: "عيادات أسنان", en: "Dental clinics" },
    color: "cyan",
    duration: { ar: "٦ أشهر", en: "6 months" },
    headline: { ar: "ابتسامات محجوزة لشهرين قدّام", en: "Smiles booked two months ahead" },
    cover: img("noor", "cover"),
    challenge: {
      title: { ar: "التحدي", en: "The challenge" },
      body: {
        ar: "منافسة عالية، إعلانات مكلفة، وأغلب الرسائل تسأل عن السعر وتختفي بدون حجز.",
        en: "Heavy competition, expensive ads, and most inquiries asked about price then vanished without booking.",
      },
      image: img("noor", "challenge"),
    },
    idea: {
      title: { ar: "الفكرة", en: "The idea" },
      body: {
        ar: "بدل ما نبيع السعر، بعنا الثقة: سلسلة \"قبل وبعد\" حقيقية مع قصص المراجعين وطبيب يجاوب أسئلة الناس لايف كل أسبوع.",
        en: "Instead of selling price, we sold trust: real before/after stories and a weekly live Q&A with the doctor.",
      },
      image: img("noor", "idea"),
    },
    execution: {
      title: { ar: "التنفيذ", en: "The execution" },
      body: {
        ar: "صفحة حجز سريعة، رد آلي ذكي على الرسائل، فريق متابعة داخل العيادة، وحملات إعادة استهداف لكل شخص سأل ولم يحجز.",
        en: "A fast booking page, smart auto-replies, an in-clinic follow-up team, and retargeting for everyone who asked but didn't book.",
      },
      image: img("noor", "execution"),
    },
    result: {
      title: { ar: "النتيجة", en: "The result" },
      body: {
        ar: "الجدول ممتلئ لشهرين، والعيادة فتحت فرع ثاني.",
        en: "The schedule is full for two months and the clinic opened a second branch.",
      },
      image: img("noor", "result"),
    },
    metrics: [
      m("الحجوزات الشهرية", "Monthly bookings", 60, 410),
      m("تكلفة الحجز", "Cost per booking", 12, 2.8, { prefix: "$", decimals: 1, lowerIsBetter: true }),
      m("تقييمات جوجل", "Google reviews", 35, 640),
      m("نسبة التحويل", "Conversion rate", 3, 21, { suffix: "%" }),
    ],
  },
  {
    id: "sama",
    client: "Sama Homes",
    logo: "/mock/logos/sama.svg",
    industry: { ar: "تطوير عقاري", en: "Real estate" },
    color: "lilac",
    duration: { ar: "١٠ أشهر", en: "10 months" },
    headline: { ar: "مشروع سكني بيع قبل ما يكمل", en: "A residential project sold out before completion" },
    cover: img("sama", "cover"),
    challenge: {
      title: { ar: "التحدي", en: "The challenge" },
      body: {
        ar: "مشروع سكني جديد بمنطقة ناشئة، والناس ما تثق بالبيع على الخارطة.",
        en: "A new residential project in an emerging area, and buyers didn't trust off-plan sales.",
      },
      image: img("sama", "challenge"),
    },
    idea: {
      title: { ar: "الفكرة", en: "The idea" },
      body: {
        ar: "\"شوف بيتك يكبر\": بث أسبوعي لمراحل البناء، جولات ثلاثية الأبعاد، وعائلات حقيقية تحچي ليش اختارت سما.",
        en: "\"Watch your home grow\": weekly construction updates, 3D tours, and real families sharing why they chose Sama.",
      },
      image: img("sama", "idea"),
    },
    execution: {
      title: { ar: "التنفيذ", en: "The execution" },
      body: {
        ar: "حملات ليدز مؤهلة، داشبورد مبيعات مباشر، فعاليات مفتوحة بالموقع، وفريق ماجك يشتغل يومياً ويا فريق المبيعات.",
        en: "Qualified lead campaigns, a live sales dashboard, on-site open days, and the Magic team working daily with sales.",
      },
      image: img("sama", "execution"),
    },
    result: {
      title: { ar: "النتيجة", en: "The result" },
      body: {
        ar: "٣٧ وحدة انباعت قبل التسليم وقائمة انتظار للمرحلة الثانية.",
        en: "37 units sold before handover, with a waiting list for phase two.",
      },
      image: img("sama", "result"),
    },
    metrics: [
      m("العملاء المحتملين", "Qualified leads", 90, 1450),
      m("الوحدات المباعة", "Units sold", 4, 37),
      m("العائد على الإعلان", "ROAS", 1.2, 6.8, { suffix: "x", decimals: 1 }),
      m("زيارات الموقع", "Site visits", 300, 5200),
    ],
  },
  {
    id: "bab",
    client: "Bab Burger",
    logo: "/mock/logos/bab.svg",
    industry: { ar: "مطاعم", en: "Restaurants" },
    color: "green",
    duration: { ar: "٤ أشهر", en: "4 months" },
    headline: { ar: "برگر صار حديث السوشيال", en: "A burger the whole feed talked about" },
    cover: img("bab", "cover"),
    challenge: {
      title: { ar: "التحدي", en: "The challenge" },
      body: {
        ar: "سوق مزدحم بالمطاعم، ومنيو حلو بس ما عنده شخصية تميزه.",
        en: "A crowded restaurant market and a good menu with no personality.",
      },
      image: img("bab", "challenge"),
    },
    idea: {
      title: { ar: "الفكرة", en: "The idea" },
      body: {
        ar: "شخصية جريئة ومضحكة للعلامة + تحدي \"باب البرگر الكبير\" اللي خلّى الناس تجي تصوّر.",
        en: "A bold, funny brand voice plus the \"Big Bab challenge\" that made people come to film.",
      },
      image: img("bab", "idea"),
    },
    execution: {
      title: { ar: "التنفيذ", en: "The execution" },
      body: {
        ar: "محتوى يومي، تعاون مع ٢٠ مؤثر أكل، حملات توصيل مستهدفة بأوقات الجوع، وعروض حصرية لتطبيق التوصيل.",
        en: "Daily content, 20 food creators, delivery campaigns timed to hunger hours, and exclusive app deals.",
      },
      image: img("bab", "execution"),
    },
    result: {
      title: { ar: "النتيجة", en: "The result" },
      body: {
        ar: "الطلبات تضاعفت ٥ مرات والتحدي وصل لأكثر من مليوني مشاهدة.",
        en: "Orders grew 5x and the challenge passed two million views.",
      },
      image: img("bab", "result"),
    },
    metrics: [
      m("الطلبات اليومية", "Daily orders", 80, 420),
      m("المشاهدات", "Views", 15000, 2100000),
      m("تقييم التطبيق", "App rating", 3.6, 4.8, { decimals: 1 }),
      m("تكلفة الطلب", "Cost per order", 3.2, 0.7, { prefix: "$", decimals: 1, lowerIsBetter: true }),
    ],
  },
];

export const seed: Content = {
  settings: {
    siteName: "Magic Team",
    seoTitle: { ar: "Magic Team — وكالة تسويق تصنع علامات يستحيل تجاهلها", en: "Magic Team — We make brands impossible to ignore" },
    seoDescription: {
      ar: "وكالة تسويق إبداعية: استراتيجية، إدارة حملات، محتوى، وهوية بصرية.",
      en: "A creative marketing agency: strategy, campaign management, content and branding.",
    },
    email: "hello@magicteam.co",
    phone: "+964 770 000 0000",
    whatsapp: "9647700000000",
    address: { ar: "بغداد، العراق", en: "Baghdad, Iraq" },
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    linkedin: "https://linkedin.com/",
    notice: { ar: "نسخة تصميم أولية · المحتوى والأرقام تجريبية", en: "Design preview · content and numbers are sample data" },
    sections: [
      { key: "hero", visible: true },
      { key: "clients", visible: true },
      { key: "featured", visible: true },
      { key: "team", visible: true },
      { key: "cases", visible: true },
      { key: "beforeAfter", visible: true },
      { key: "manifesto", visible: true },
      { key: "services", visible: true },
      { key: "contact", visible: true },
    ],
  },
  hero: {
    title: { ar: "إبداع ما يمشي", en: "Creativity that" },
    highlight: { ar: "على القواعد.", en: "refuses to behave." },
    tagline: { ar: "CREATIVITY THAT REFUSES TO BEHAVE.", en: "STRATEGY FIRST. MAGIC AFTER." },
    subtitle: {
      ar: "نبني علامات تجارية يصعب تجاهلها، من الاستراتيجية والهوية لحد المحتوى والحملات، وحتى الموقع والنظام اللي يشغّل مشروعك.",
      en: "We build brands that are hard to ignore — from strategy and identity to content and campaigns, all the way to the website and systems that run your business.",
    },
    ctaPrimary: { ar: "شوف أعمالنا", en: "See our work" },
    ctaSecondary: { ar: "خل نحچي عن مشروعك", en: "Let's talk about your project" },
    pills: [
      { label: { ar: "MARKETING", en: "MARKETING" }, color: "lilac" },
    ],
    cards: [
      { image: "/brand/posts/post-1.jpg", alt: "Your ad was generated using AI?" },
      { image: "/brand/posts/post-2.jpg", alt: "Your audience is scrolling" },
      { image: "/brand/posts/post-3.jpg", alt: "Make ordinary disappear" },
    ],
  },
  clients: {
    eyebrow: { ar: "عملاؤنا", en: "Clients" },
    title: { ar: "علامات وثقت بنا", en: "Brands that trusted us" },
    subtitle: {
      ar: "من المقاهي للعيادات للعقارات — علامات اختارت تكون مختلفة.",
      en: "From cafés to clinics to real estate — brands that chose to be different.",
    },
    logos: [
      { name: "Dijla Roasters", logo: "/mock/logos/dijla.svg" },
      { name: "Noor Dental", logo: "/mock/logos/noor.svg" },
      { name: "Sama Homes", logo: "/mock/logos/sama.svg" },
      { name: "Zaha Atelier", logo: "/mock/logos/zaha.svg" },
      { name: "Bab Burger", logo: "/mock/logos/bab.svg" },
      { name: "Nakheel Fitness", logo: "/mock/logos/nakheel.svg" },
      { name: "Qamar Travel", logo: "/mock/logos/qamar.svg" },
      { name: "Ward Beauty", logo: "/mock/logos/ward.svg" },
      { name: "Lumen Optics", logo: "/mock/logos/lumen.svg" },
      { name: "Tamr Sweets", logo: "/mock/logos/tamr.svg" },
    ],
  },
  featured: {
    "eyebrow": {
      "ar": "خدمات مميزة",
      "en": "Signature services"
    },
    "title": {
      "ar": "خدمات مميزة",
      "en": "Two services we run like nobody else"
    },
    "subtitle": {
      "ar": "من رف السوبرماركت لحد مكاتب شركتك — ماجك تنزل للأرض ويا علامتك.",
      "en": "From the supermarket shelf to your own offices — Magic gets on the ground with your brand."
    },
    "cta": {
      "ar": "خل نحچي عن مشروعك",
      "en": "Let's talk about your project"
    },
    "trade": {
      "tab": {
        "ar": "التريد ماركتنج",
        "en": "Trade marketing"
      },
      "audience": {
        "ar": "للسوبرماركتات، سلاسل التجزئة وشركات المنتجات",
        "en": "For supermarkets, retail chains and FMCG brands"
      },
      "title": {
        "ar": "نربح الزبون بآخر ثلاث ثواني قبل ما يشتري",
        "en": "We win the shopper in the last three seconds before they buy"
      },
      "body": {
        "ar": "أغلب قرارات الشراء تنحسم داخل المحل. نخطط وننفّذ حضور منتجك من باب المحل لحد الكاشير: ترتيب الرفوف، الستاندات، التذوق، العروض، والبروموترز — ونتابع كل فرع بالصور والأرقام.",
        "en": "Most buying decisions are made inside the store. We plan and run your product's presence from the door to the checkout: shelves, displays, sampling, promotions and promoters — and we track every branch with photos and numbers."
      },
      "fits": {
        "ar": "سوبرماركت، هايبرماركت، سلاسل تجزئة، موزعين، شركات أغذية ومنظفات",
        "en": "Supermarkets, Hypermarkets, Retail chains, Distributors, FMCG brands"
      },
      "mapTitle": {
        "ar": "رحلة الزبون داخل المحل",
        "en": "The shopper's journey in-store"
      },
      "zones": [
        {
          "title": {
            "ar": "المدخل والواجهة",
            "en": "Entrance & storefront"
          },
          "body": {
            "ar": "أول شي يشوفه الزبون. نخلي العرض واضح من الباب حتى يدخل وهو ناوي يدور على منتجك.",
            "en": "The first thing shoppers see. We make the offer clear from the door so they walk in looking for your product."
          },
          "tags": {
            "ar": "بانرات، ستيكرات أرضية، بوسترات العروض",
            "en": "Banners, Floor stickers, Offer posters"
          },
          "icon": "door",
          "color": "cyan",
          "image": "/mock/featured/zone-entrance-v2.jpg"
        },
        {
          "title": {
            "ar": "العروض والأسعار",
            "en": "Promotions & pricing"
          },
          "body": {
            "ar": "نصمم عروض تحرّك المبيعات بدون ما تكسر قيمة العلامة، ونتأكد إنها مطبّقة صح بكل فرع.",
            "en": "We design offers that move volume without cheapening the brand — and make sure every branch runs them right."
          },
          "tags": {
            "ar": "باندلز، اشتري ٢ واحصل ١، كوبونات",
            "en": "Bundles, Buy 2 get 1, Coupons"
          },
          "icon": "tag",
          "color": "green",
          "image": "/mock/featured/zone-promo-v2.jpg"
        },
        {
          "title": {
            "ar": "التذوق والتفعيل",
            "en": "Sampling & activation"
          },
          "body": {
            "ar": "بروموترز مدرّبين من ماجك يعرّفون الزبون بالمنتج، يذوقونه، ويحوّلون التجربة لشراء بنفس اللحظة.",
            "en": "Trained Magic promoters introduce, sample and turn the experience into a purchase on the spot."
          },
          "tags": {
            "ar": "بروموترز، تذوق، مسابقات وجوائز",
            "en": "Promoters, Sampling, Games & prizes"
          },
          "icon": "users",
          "color": "yellow",
          "image": "/mock/featured/zone-sampling-v2.jpg"
        },
        {
          "title": {
            "ar": "الرفوف وترتيب المنتج",
            "en": "Shelf & planogram"
          },
          "body": {
            "ar": "نفاوض على أحسن مكان بمستوى العين، نرتب المنتج حسب بلانوغرام مدروس، ونضيف مواد تلفت النظر على الرف.",
            "en": "We negotiate eye-level placement, arrange products to a planned planogram, and add eye-catching shelf materials."
          },
          "tags": {
            "ar": "بلانوغرام، شيلف توكرز، ووبلرز",
            "en": "Planogram, Shelf talkers, Wobblers"
          },
          "icon": "grid",
          "color": "lilac",
          "image": "/mock/featured/zone-shelves-v2.jpg"
        },
        {
          "title": {
            "ar": "رأس الجندول والستاندات",
            "en": "End-caps & displays"
          },
          "body": {
            "ar": "ستاندات مصممة لعلامتك ومساحات عرض إضافية بأكثر الممرات زحمة — ظهور مضاعف بنفس المحل.",
            "en": "Branded stands and extra display space in the busiest aisles — double the visibility in the same store."
          },
          "tags": {
            "ar": "ستاندات، عرض ثانوي، تصميم وتصنيع",
            "en": "Stands, Secondary display, Design & build"
          },
          "icon": "store",
          "color": "orchid",
          "image": "/mock/featured/zone-endcap-v2.jpg"
        },
        {
          "title": {
            "ar": "الكاشير والمتابعة",
            "en": "Checkout & tracking"
          },
          "body": {
            "ar": "منتجات الشراء السريع جنب الكاشير، فلايرز ويا الفاتورة، وتقارير أسبوعية بالصور والمبيعات من كل فرع.",
            "en": "Impulse placement by the till, flyers with the receipt, and weekly photo and sales reports from every branch."
          },
          "tags": {
            "ar": "شراء اندفاعي، فلايرز، تقارير الفروع",
            "en": "Impulse buys, Flyers, Branch reports"
          },
          "icon": "receipt",
          "color": "cyan",
          "image": "/mock/featured/zone-checkout-v2.jpg"
        }
      ],
      "stats": [
        {
          "value": {
            "ar": "+٣٨٪",
            "en": "+38%"
          },
          "label": {
            "ar": "مبيعات الرف بعد التفعيل",
            "en": "Shelf sales after activation"
          }
        },
        {
          "value": {
            "ar": "٧٠٪",
            "en": "70%"
          },
          "label": {
            "ar": "من قرارات الشراء تصير داخل المحل",
            "en": "of buying decisions happen in-store"
          }
        },
        {
          "value": {
            "ar": "+٤٠",
            "en": "40+"
          },
          "label": {
            "ar": "فرع نتابعه أسبوعياً",
            "en": "branches audited weekly"
          }
        }
      ],
      "image": "/mock/featured/trade-cover-v3.jpg"
    },
    "embedded": {
      "tab": {
        "ar": "فريق ماجك داخل شركتك",
        "en": "Magic team in-house"
      },
      "audience": {
        "ar": "للشركات الكبيرة وأصحاب الفروع المتعددة",
        "en": "For large companies and multi-branch businesses"
      },
      "title": {
        "ar": "موظفين ماجك، يداومون بمقر شركتك",
        "en": "Magic people, working from your offices"
      },
      "body": {
        "ar": "نعيّن لك فريق من ماجك يشتغل من داخل شركتك وفروعك: يحضر اجتماعاتكم، يعرف منتجاتكم وموظفيكم، ويطلّع المحتوى والحملات بنفس اليوم. هم موظفين ماجك — إدارتهم، تدريبهم ومتابعتهم علينا — بس شغلهم كله إلك.",
        "en": "We place a Magic team inside your company and branches: they join your meetings, know your products and people, and ship content and campaigns the same day. They're Magic employees — we hire, train and manage them — but all their work is yours."
      },
      "fits": {
        "ar": "شركات بفروع متعددة، سلاسل مطاعم، مستشفيات، مصانع، مجموعات تجارية",
        "en": "Multi-branch companies, Restaurant chains, Hospitals, Factories, Business groups"
      },
      "hq": {
        "ar": "مقركم الرئيسي",
        "en": "Your headquarters"
      },
      "hqTask": {
        "ar": "مدير حساب + استراتيجي + مصمم يقودون الشغل ويا الإدارة يومياً",
        "en": "Account lead, strategist and designer running the work with management daily"
      },
      "branches": [
        {
          "name": {
            "ar": "فرع المنصور",
            "en": "Mansour branch"
          },
          "task": {
            "ar": "مصور وصانع محتوى يغطون العروض والزبائن يومياً",
            "en": "A photographer and creator covering offers and customers daily"
          },
          "people": 2,
          "image": "/mock/featured/place-1-v2.jpg"
        },
        {
          "name": {
            "ar": "فرع الكرادة",
            "en": "Karrada branch"
          },
          "task": {
            "ar": "مسوّق ميداني يتابع العروض والتفعيلات داخل الفرع",
            "en": "A field marketer running in-branch offers and activations"
          },
          "people": 1,
          "image": "/mock/featured/place-2-v2.jpg"
        },
        {
          "name": {
            "ar": "فرع أربيل",
            "en": "Erbil branch"
          },
          "task": {
            "ar": "صانع محتوى ومدير مجتمع يحچون بلهجة جمهور الشمال",
            "en": "A creator and community manager speaking to the northern audience"
          },
          "people": 2,
          "image": "/mock/featured/place-3-v2.jpg"
        },
        {
          "name": {
            "ar": "فرع البصرة",
            "en": "Basra branch"
          },
          "task": {
            "ar": "مصور ومنسق حملات يغطون الافتتاحات والمناسبات",
            "en": "A photographer and campaign coordinator covering openings and events"
          },
          "people": 2,
          "image": "/mock/featured/place-4-v2.jpg"
        }
      ],
      "steps": [
        {
          "title": {
            "ar": "نفهم شركتكم",
            "en": "We study your company"
          },
          "body": {
            "ar": "نزور المقر والفروع ونحدد شنو تحتاجون بكل مكان.",
            "en": "We visit HQ and branches and map what each place needs."
          }
        },
        {
          "title": {
            "ar": "نبني الفريق",
            "en": "We build the team"
          },
          "body": {
            "ar": "نختار الأشخاص المناسبين وندربهم على علامتكم.",
            "en": "We pick the right people and train them on your brand."
          }
        },
        {
          "title": {
            "ar": "يداومون عندكم",
            "en": "They work on-site"
          },
          "body": {
            "ar": "الفريق يداوم بمقركم وفروعكم بنفس أوقات دوامكم.",
            "en": "The team works from your HQ and branches, on your hours."
          }
        },
        {
          "title": {
            "ar": "نقيس ونطوّر",
            "en": "We measure & improve"
          },
          "body": {
            "ar": "تقارير أسبوعية، ومتابعة من إدارة ماجك على الأداء.",
            "en": "Weekly reports, with Magic management tracking performance."
          }
        }
      ],
      "compareRemote": {
        "ar": "وكالة من بعيد",
        "en": "Remote agency"
      },
      "compareInside": {
        "ar": "فريق ماجك عندك",
        "en": "Magic team in-house"
      },
      "compare": [
        {
          "label": {
            "ar": "سرعة التنفيذ",
            "en": "Speed"
          },
          "remote": {
            "ar": "أيام من المراسلات",
            "en": "Days of back-and-forth"
          },
          "inside": {
            "ar": "نفس اليوم",
            "en": "Same day"
          }
        },
        {
          "label": {
            "ar": "فهم الشركة",
            "en": "Knowing you"
          },
          "remote": {
            "ar": "من بعيد وعلى الورق",
            "en": "From a distance, on paper"
          },
          "inside": {
            "ar": "من الداخل ويا موظفيكم",
            "en": "From the inside, with your people"
          }
        },
        {
          "label": {
            "ar": "تغطية الفروع",
            "en": "Branch coverage"
          },
          "remote": {
            "ar": "زيارات متقطعة",
            "en": "Occasional visits"
          },
          "inside": {
            "ar": "فريق ثابت بكل فرع",
            "en": "A dedicated team per branch"
          }
        },
        {
          "label": {
            "ar": "التوظيف والإدارة",
            "en": "Hiring & managing"
          },
          "remote": {
            "ar": "عليكم",
            "en": "On you"
          },
          "inside": {
            "ar": "على ماجك بالكامل",
            "en": "Fully on Magic"
          }
        }
      ],
      "stats": [
        {
          "value": {
            "ar": "٢٤ ساعة",
            "en": "24h"
          },
          "label": {
            "ar": "من الفكرة للنشر",
            "en": "from idea to post"
          }
        },
        {
          "value": {
            "ar": "+١٥",
            "en": "15+"
          },
          "label": {
            "ar": "موظف ماجك داخل شركات عملائنا",
            "en": "Magic staff inside client companies"
          }
        },
        {
          "value": {
            "ar": "صفر",
            "en": "0"
          },
          "label": {
            "ar": "توظيف أو إدارة عليكم",
            "en": "hiring or HR on your side"
          }
        }
      ],
      "image": "/mock/featured/embedded-cover-v3.jpg",
      "hqImage": "/mock/featured/place-hq-v2.jpg"
    }
  },
  team: {
    eyebrow: { ar: "فريقنا", en: "Our team" },
    title: { ar: "الناس اللي ورا السحر", en: "The people behind the magic" },
    subtitle: {
      ar: "استراتيجيين، مصممين، صنّاع محتوى ومدراء حملات — فريق واحد يعرف علامتك بالتفصيل ويشتغل عليها كأنها مالته.",
      en: "Strategists, designers, creators and ads managers — one team that knows your brand inside out and treats it as its own.",
    },
    points: [
      {
        title: { ar: "فريق مخصص لعلامتك", en: "A dedicated team" },
        body: { ar: "كل عميل عنده فريق ثابت يعرف علامته وجمهوره وأهدافه — ما تبدي من الصفر كل مرة.", en: "Every client gets a fixed team that knows its brand, audience and goals — no starting from scratch." },
      },
      {
        title: { ar: "خبرات تكمّل بعض", en: "Skills that complete each other" },
        body: { ar: "من الفكرة للتصميم للتصوير للإعلان — كل شي يصير تحت سقف واحد وبنفس الروح.", en: "From idea to design to shoot to ads — everything under one roof, in one voice." },
      },
      {
        title: { ar: "أرقام بوقتها", en: "Real-time numbers" },
        body: { ar: "داشبورد مباشر يوريك كل دينار وين راح وشنو جاب.", en: "A live dashboard showing where every dinar went and what it brought back." },
      },
    ],
    members: [
      { name: { ar: "زينب علي", en: "Zainab Ali" }, role: { ar: "مديرة الحسابات", en: "Account director" }, photo: "/mock/team/zainab.svg", color: "orchid" },
      { name: { ar: "علي حسين", en: "Ali Hussein" }, role: { ar: "استراتيجي تسويق", en: "Strategist" }, photo: "/mock/team/ali.svg", color: "cyan" },
      { name: { ar: "مريم كاظم", en: "Maryam Kadhim" }, role: { ar: "مصممة", en: "Designer" }, photo: "/mock/team/maryam.svg", color: "yellow" },
      { name: { ar: "حسن جاسم", en: "Hassan Jasim" }, role: { ar: "مدير حملات", en: "Ads manager" }, photo: "/mock/team/hassan.svg", color: "green" },
      { name: { ar: "نور الهدى", en: "Noor Alhuda" }, role: { ar: "كاتبة محتوى", en: "Copywriter" }, photo: "/mock/team/noor.svg", color: "lilac" },
      { name: { ar: "مصطفى رعد", en: "Mustafa Raad" }, role: { ar: "مصور ومونتير", en: "Videographer" }, photo: "/mock/team/mustafa.svg", color: "cyan" },
    ],
  },
  cases: {
    eyebrow: { ar: "قصص نجاح", en: "Case stories" },
    title: { ar: "ماذا حققنا", en: "What we achieved" },
    subtitle: {
      ar: "كل عميل عنده قصة. اضغط على أي قصة وتابعها من التحدي لحد النتيجة.",
      en: "Every client has a story. Tap one and follow it from challenge to result.",
    },
    items: cases,
  },
  beforeAfter: {
    eyebrow: { ar: "الأرقام لا تكذب", en: "Numbers don't lie" },
    title: { ar: "الأرقام قبل ماجك", en: "The numbers before Magic" },
    subtitle: {
      ar: "اختار العميل، شوف أرقامه قبل ما نشتغل وياه، وبعدين لوّح بالعصا.",
      en: "Pick a client, see their numbers before we started, then wave the wand.",
    },
    beforeLabel: { ar: "قبل ماجك", en: "Before Magic" },
    afterLabel: { ar: "بعد ماجك", en: "After Magic" },
    button: { ar: "لوّح بالعصا السحرية", en: "Wave the magic wand" },
    reset: { ar: "رجّع الأرقام", en: "Reset" },
  },
  manifesto: {
    line1: { ar: "إبداع", en: "Creativity" },
    line2: { ar: "يرفض أن", en: "that refuses" },
    line3: { ar: "يكون عادياً.", en: "to behave." },
  },
  services: {
    eyebrow: { ar: "خدماتنا", en: "Services" },
    title: { ar: "الخدمات التي نقدمها", en: "What we do" },
    subtitle: {
      ar: "كل اللي تحتاجه علامتك حتى تكبر — تحت سقف واحد.",
      en: "Everything your brand needs to grow — under one roof.",
    },
    items: [
      {
        title: { ar: "استراتيجية التسويق", en: "Marketing strategy" },
        body: { ar: "خطة واضحة مبنية على بحث وأرقام، مو على تخمين.", en: "A clear plan built on research and numbers, not guesses." },
        tags: { ar: "بحث، تموضع، خطة سنوية", en: "Research, Positioning, Annual plan" },
        color: "lilac",
        icon: "compass",
        image: "/mock/services/strategy-v2.jpg",
      },
      {
        title: { ar: "إدارة الحملات الإعلانية", en: "Campaign management" },
        body: { ar: "حملات مدفوعة على ميتا، تيك توك، جوجل وسناب — بأقل تكلفة وأعلى نتيجة.", en: "Paid campaigns on Meta, TikTok, Google and Snap — lowest cost, highest return." },
        tags: { ar: "ميتا، تيك توك، جوجل، سناب", en: "Meta, TikTok, Google, Snap" },
        color: "orchid",
        icon: "target",
        image: "/mock/services/campaigns-v2.jpg",
      },
      {
        title: { ar: "إدارة السوشيال ميديا", en: "Social media management" },
        body: { ar: "حضور يومي ثابت، رد على الجمهور، ومجتمع يحب علامتك.", en: "Consistent daily presence, community care, and an audience that loves you." },
        tags: { ar: "خطة محتوى، إدارة، مجتمع", en: "Content plan, Community, Moderation" },
        color: "cyan",
        icon: "chat",
        image: "/mock/services/social-v2.jpg",
      },
      {
        title: { ar: "صناعة المحتوى والتصوير", en: "Content & production" },
        body: { ar: "ريلز، تصوير منتجات، فيديوهات إعلانية — محتوى يوقف السكرول.", en: "Reels, product shoots, ad films — content that stops the scroll." },
        tags: { ar: "ريلز، تصوير، مونتاج", en: "Reels, Photo, Editing" },
        color: "yellow",
        icon: "camera",
        image: "/mock/services/content-v2.jpg",
      },
      {
        title: { ar: "الهوية البصرية", en: "Branding" },
        body: { ar: "شعار، ألوان، ونبرة صوت تخلي علامتك تنعرف من أول نظرة.", en: "Logo, colors and voice that make your brand recognizable at a glance." },
        tags: { ar: "شعار، دليل هوية، نبرة", en: "Logo, Guidelines, Voice" },
        color: "green",
        icon: "spark",
        image: "/mock/services/branding-v2.jpg",
      },
      {
        title: { ar: "التسويق بالمؤثرين", en: "Influencer marketing" },
        body: { ar: "نختار المؤثر الصح، ونكتب الفكرة، ونقيس النتيجة.", en: "We pick the right creators, write the idea, and measure the result." },
        tags: { ar: "اختيار، تنسيق، قياس", en: "Selection, Briefing, Tracking" },
        color: "lilac",
        icon: "star",
        image: "/mock/services/influencer-v2.jpg",
      },
    ],
  },
  contact: {
    eyebrow: { ar: "يلا نبدأ", en: "Let's go" },
    title: { ar: "جاهز تصير علامتك سحرية؟", en: "Ready to make your brand magic?" },
    subtitle: {
      ar: "احچيلنا عن مشروعك، وفريقنا يتواصل وياك خلال ٢٤ ساعة.",
      en: "Tell us about your project and our team will reach out within 24 hours.",
    },
    button: { ar: "أرسل الطلب", en: "Send request" },
    success: { ar: "وصلنا طلبك ✨ راح نتواصل وياك قريباً.", en: "Got it ✨ We'll be in touch soon." },
    serviceOptions: [
      { ar: "إدارة حملات", en: "Campaign management" },
      { ar: "سوشيال ميديا", en: "Social media" },
      { ar: "هوية بصرية", en: "Branding" },
      { ar: "محتوى وتصوير", en: "Content & production" },
    ],
  },
  presentations: [
    {
      slug: "restaurant-pitch",
      client: "Golden Grill",
      clientLogo: "",
      note: { ar: "عرض مخصص لمطعم Golden Grill", en: "A tailored deck for Golden Grill" },
      sections: ["hero", "clients", "cases", "beforeAfter", "featured", "services", "contact"],
      caseIds: ["bab", "dijla"],
    },
    {
      slug: "clinic-pitch",
      client: "Shifa Clinics",
      clientLogo: "",
      note: { ar: "عرض مخصص لعيادات الشفاء", en: "A tailored deck for Shifa Clinics" },
      sections: ["hero", "team", "cases", "beforeAfter", "featured", "services", "contact"],
      caseIds: ["noor"],
    },
  ],
};
