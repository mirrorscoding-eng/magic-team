import type { CaseStudy, Content } from "./types";

const cases: CaseStudy[] = [
  {
    "id": "geogres",
    "client": "GeoGres",
    "logo": "",
    "industry": {
      "ar": "بورسلان وسيراميك",
      "en": "Porcelain tiles"
    },
    "color": "cyan",
    "duration": {
      "ar": "شهرين",
      "en": "2 months"
    },
    "headline": {
      "ar": "من ٣٬٥٠٠ إلى ٨٬٨٤٩ متابع بشهرين",
      "en": "From 3,500 to 8,849 followers in two months"
    },
    "cover": "",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "علامة بورسلان بجمهور صغير على السوشيال: ٣٬٥٠٠ متابع بكل المنصات، وقناة تيك توك بعدها ما انطلقت.",
        "en": "A porcelain brand with a small social audience: 3,500 followers across all platforms, and no TikTok channel yet."
      },
      "image": ""
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "نشتغل على ثلاث منصات سوا: فيسبوك للوصول الواسع، إنستغرام للجمهور الأساسي، وقناة تيك توك جديدة توصل للجمهور الأصغر.",
        "en": "Three platforms working together: Facebook for wide reach, Instagram for the core audience, and a brand-new TikTok channel for a younger crowd."
      },
      "image": ""
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "٢١٠ منشور بشهر: ٩٩ على فيسبوك، ١٠٤ على إنستغرام، و٧ فيديوهات تيك توك. وصلنا لأكثر من ٧ مليون ظهور، أغلبها من حملات فيسبوك الممولة.",
        "en": "210 posts in a month: 99 on Facebook, 104 on Instagram and 7 TikTok videos — over 7 million impressions, most of them from paid Facebook campaigns."
      },
      "image": ""
    },
    "result": {
      "title": {
        "ar": "النتيجة",
        "en": "The result"
      },
      "body": {
        "ar": "المتابعين صاروا ٨٬٨٤٩ بكل المنصات، وتيك توك انطلق من صفر إلى ٢٬١٠٠ متابع بخمس أيام بس.",
        "en": "Followers reached 8,849 across platforms, and TikTok went from zero to 2,100 followers in just five days."
      },
      "image": ""
    },
    "metrics": [
      {
        "label": {
          "ar": "كل المتابعين",
          "en": "Total followers"
        },
        "before": 3500,
        "after": 8849,
        "prefix": "",
        "suffix": "",
        "decimals": 0,
        "lowerIsBetter": false
      },
      {
        "label": {
          "ar": "متابعين إنستغرام",
          "en": "Instagram followers"
        },
        "before": 3300,
        "after": 5871,
        "prefix": "",
        "suffix": "",
        "decimals": 0,
        "lowerIsBetter": false
      },
      {
        "label": {
          "ar": "متابعين فيسبوك",
          "en": "Facebook followers"
        },
        "before": 310,
        "after": 878,
        "prefix": "",
        "suffix": "",
        "decimals": 0,
        "lowerIsBetter": false
      },
      {
        "label": {
          "ar": "ظهور تيك توك",
          "en": "TikTok impressions"
        },
        "before": 2831,
        "after": 87197,
        "prefix": "",
        "suffix": "",
        "decimals": 0,
        "lowerIsBetter": false
      }
    ]
  },
  {
    "id": "og-burger",
    "client": "OG Burger",
    "logo": "/clients/og-burger.png",
    "industry": {
      "ar": "مطعم برگر",
      "en": "Burger restaurant"
    },
    "color": "cyan",
    "duration": {
      "ar": "",
      "en": ""
    },
    "headline": {
      "ar": "هوية برگر كاملة، من الشعار لحد علبة التوصيل",
      "en": "A complete burger identity, from logo to delivery box"
    },
    "cover": "/work/brand/og-enjoy.jpg",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "OG Burger احتاج هوية تنقرأ بالعربي والإنكليزي سوا، وتبقى واضحة على كل قطعة توصل لإيد الزبون.",
        "en": "OG Burger needed an identity that reads in Arabic and English at once, and stays clear on everything that reaches the customer's hands."
      },
      "image": "/work/brand/og-bowl.jpg"
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "طابع حديث بلمسة فنتج: شعار OG دائري ويّا كتابة «أوجي برجر»، أزرق وأحمر، ونقشة المربعات الكلاسيكية.",
        "en": "Modern with a vintage twist: a round OG mark paired with «أوجي برجر», blue and red, and the classic checkered pattern."
      },
      "image": "/work/brand/og-stickers.jpg"
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "ستيكرات، منيو، علب برگر، أكياس ورق، علب كرافت وتغليف البطاطا — كلها بنفس اللغة البصرية.",
        "en": "Stickers, menu, burger boxes, paper bags, kraft bowls and fries packaging — all speaking the same visual language."
      },
      "image": "/work/brand/og-box.jpg"
    },
    "result": {
      "title": {
        "ar": "النتيجة",
        "en": "The result"
      },
      "body": {
        "ar": "دليل هوية ومطبوعات جاهزة للطباعة، فكل طلب يوصل وهو يحچي باسم OG.",
        "en": "A print-ready brand guide and printables, so every order arrives speaking OG."
      },
      "image": "/work/brand/og-bag.jpg"
    },
    "metrics": []
  },
  {
    "id": "viking-burger",
    "client": "Viking Burger",
    "logo": "/clients/viking-burger.png",
    "industry": {
      "ar": "مطعم برگر",
      "en": "Burger restaurant"
    },
    "color": "yellow",
    "duration": {
      "ar": "",
      "en": ""
    },
    "headline": {
      "ar": "واجهة، منيو، وإطلاق آيس كريم",
      "en": "Storefront, menu and an ice cream launch"
    },
    "cover": "/work/brand/viking-1.jpg",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "Viking Burger احتاج حضور بصري واحد يجمع الفرع والمنيو والسوشيال ميديا.",
        "en": "Viking Burger needed one visual presence tying together the branch, the menu and social media."
      },
      "image": "/work/brand/viking-1.jpg"
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "لغة جريئة: صور أكل قريبة، خط عربي عريض، ورسائل قصيرة مثل «مودك اليوم لحم؟»",
        "en": "A bold language: close-up food shots, heavy Arabic type and short hooks like «مودك اليوم لحم؟» (In a beef mood today?)"
      },
      "image": "/work/brand/viking-2.jpg"
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "صممنا واجهة الفرع، منيو كامل بـ ١٤ صفحة، وتصاميم سوشيال للبرگر والدجاج.",
        "en": "We designed the storefront, a full 14-page menu, and social posts for the burgers and chicken."
      },
      "image": "/work/brand/viking-6.jpg"
    },
    "result": {
      "title": {
        "ar": "النتيجة",
        "en": "The result"
      },
      "body": {
        "ar": "وأطلقنا خط الآيس كريم بإعلان «نكهات جديدة بالطريق» ومنيو خاص للنكهات.",
        "en": "Then we launched the ice cream line with a «new flavours on the way» teaser and its own flavour menu."
      },
      "image": "/work/brand/viking-11.jpg"
    },
    "metrics": []
  },
  {
    "id": "nara",
    "client": "Nara by Naranj",
    "logo": "/clients/nara.png",
    "industry": {
      "ar": "مطعم",
      "en": "Restaurant"
    },
    "color": "orchid",
    "duration": {
      "ar": "",
      "en": ""
    },
    "headline": {
      "ar": "دليل هوية نارة، من اللافتة لحد زي الموظفين",
      "en": "Nara's look book, from the sign to the staff uniform"
    },
    "cover": "/work/brand/nara-sign.jpg",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "نارة، مطعم من نارنج، احتاج هوية تعيش بالمكان نفسه، مو بس على السوشيال.",
        "en": "Nara, a restaurant by Naranj, needed an identity that lives in the place itself, not only on social media."
      },
      "image": "/work/brand/naranj-cover.jpg"
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "شعار «نارة» بخط عربي حر، عناصر كوميك مثل فقاعة «صحة وهنا»، وأيقونات للأكل والمطبخ.",
        "en": "A free-hand Arabic «نارة» logo, comic elements like the «صحة وهنا» speech bubble, and food and kitchen icons."
      },
      "image": "/work/brand/nara-icons.jpg"
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "دليل كامل: الشعار والألوان، الخطوط، لافتة المطعم، أدوات الصالة والتوصيل، وزي الموظفين للصالة والتوصيل والباريستا، ويّا الشماغ الشامي.",
        "en": "A full look book: logo and colours, typography, the restaurant sign, dine-in and delivery items, and uniforms for floor, delivery and barista staff — with the Damascene scarf."
      },
      "image": "/work/brand/nara-uniform.jpg"
    },
    "result": {
      "title": {
        "ar": "النتيجة",
        "en": "The result"
      },
      "body": {
        "ar": "هوية وحدة تمشي من باب المطعم لحد كيس التوصيل، وصممنا منيو نارنج كمان.",
        "en": "One identity running from the front door to the delivery bag — and we designed the Naranj menu too."
      },
      "image": "/work/brand/naranj-menu.jpg"
    },
    "metrics": []
  },
  {
    "id": "bo-ali",
    "client": "Frooj Bo Ali",
    "logo": "/clients/frooj-bo-ali.png",
    "industry": {
      "ar": "مطعم فروج",
      "en": "Chicken restaurant"
    },
    "color": "yellow",
    "duration": {
      "ar": "٣ مراحل",
      "en": "3 phases"
    },
    "headline": {
      "ar": "حملة وعي لفرع النسيم على ٤ منصات",
      "en": "An awareness push for the Al-Naseem branch on 4 platforms"
    },
    "cover": "/work/cases/bo-ali.jpg",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "فروج بو علي عنده ٣ فروع ببغداد: الكاظمية، حي العامل، والنسيم. الهدف نوصّل فرع النسيم لأكبر عدد من الناس.",
        "en": "Frooj Bo Ali has 3 branches in Baghdad — Kadhimiya, Hay Al-Amil and Al-Naseem. The goal: put the Al-Naseem branch in front of as many people as possible."
      },
      "image": ""
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "حملة وعي بثلاث مراحل على فيسبوك وإنستغرام وتيك توك وسناب شات، تركّز على الوصول والتفاعل.",
        "en": "A three-phase awareness campaign on Facebook, Instagram, TikTok and Snapchat, built for reach and engagement."
      },
      "image": ""
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "١٠ ريلز ترند، ٤ ريلز ويا مؤثرين، ١٦ صورة وتصميم، وستوب موشن — مع ميزانية إعلانية ٢٬٦٠٠$ موزعة على المراحل.",
        "en": "10 trend reels, 4 influencer reels, 16 photos and designs, and stop-motion — with a $2,600 ad budget split across the phases."
      },
      "image": ""
    },
    "result": {
      "title": {
        "ar": "الأهداف",
        "en": "The targets"
      },
      "body": {
        "ar": "الهدف: ٢–٣ مليون وصول على فيسبوك، ٢ مليون على إنستغرام، و٣ مليون على تيك توك، ويّا ١٠–١٥ ألف متابع بكل منصة.",
        "en": "The targets: 2–3M reach on Facebook, 2M on Instagram and 3M on TikTok, with 10–15K followers on each platform."
      },
      "image": ""
    },
    "metrics": []
  },
  {
    "id": "vita-home",
    "client": "Vita Home",
    "logo": "/clients/vita-home.png",
    "industry": {
      "ar": "أثاث",
      "en": "Furniture"
    },
    "color": "lilac",
    "duration": {
      "ar": "٣ أشهر",
      "en": "3 months"
    },
    "headline": {
      "ar": "حملة وعي لمعرض أثاث بفرعين",
      "en": "An awareness campaign for a two-branch furniture store"
    },
    "cover": "/work/cases/vita-home.jpg",
    "challenge": {
      "title": {
        "ar": "التحدي",
        "en": "The challenge"
      },
      "body": {
        "ar": "معرض أثاث بفرعين يقدّم غرف نوم بأسعار مناسبة، ويحتاج جمهور يعرفه قبل ما يزوره.",
        "en": "A two-branch furniture store selling bedrooms at fair prices, needing an audience that knows it before they visit."
      },
      "image": ""
    },
    "idea": {
      "title": {
        "ar": "الفكرة",
        "en": "The idea"
      },
      "body": {
        "ar": "حملة بثلاث مراحل، شهر لكل مرحلة، على إنستغرام وفيسبوك: وعي بالعلامة، وصول، وبناء جمهور من الزبائن المحتملين.",
        "en": "Three one-month phases on Instagram and Facebook: brand awareness, reach, and building an audience of potential buyers."
      },
      "image": ""
    },
    "execution": {
      "title": {
        "ar": "التنفيذ",
        "en": "The execution"
      },
      "body": {
        "ar": "٢٥ منشور: ٤ ريلز، ٦ تصاميم، ٥ فيديوهات و١٠ صور للغرف، مع ميزانية إعلانية ٣٬٧٠٠$ (٢٬٨٠٠$ إنستغرام و٩٠٠$ فيسبوك).",
        "en": "25 posts: 4 reels, 6 designs, 5 room videos and 10 room photos, with a $3,700 ad budget ($2,800 Instagram, $900 Facebook)."
      },
      "image": ""
    },
    "result": {
      "title": {
        "ar": "الأهداف",
        "en": "The targets"
      },
      "body": {
        "ar": "الهدف: ٥٠٠ ألف إلى ٣ مليون وصول على إنستغرام، ٥٠٠ ألف إلى ٢ مليون على فيسبوك، وآلاف المتابعين الجدد على المنصتين.",
        "en": "The targets: 500K–3M reach on Instagram, 500K–2M on Facebook, and thousands of new followers on both."
      },
      "image": ""
    },
    "metrics": []
  }
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
    phone: "+964 780 023 0320",
    whatsapp: "9647800230320",
    address: { ar: "بغداد - القادسية", en: "Al Qadisiya, Baghdad" },
    instagram: "https://instagram.com/magicteam.1",
    tiktok: "https://tiktok.com/",
    linkedin: "https://linkedin.com/",
    notice: { ar: "نسخة تصميم أولية · المحتوى والأرقام تجريبية", en: "Design preview · content and numbers are sample data" },
    sections: [
      { key: "hero", visible: true },
      { key: "clients", visible: true },
      { key: "featured", visible: true },
      { key: "team", visible: true },
      { key: "gallery", visible: true },
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
      {
        "image": "/work/photo/shoot-09.jpg",
        "alt": "Magic Team food shoot — burger and fries"
      },
      {
        "image": "/work/photo/shoot-02.jpg",
        "alt": "Magic Team food shoot — sandwich close-up"
      },
      {
        "image": "/work/photo/shoot-11.jpg",
        "alt": "Magic Team food shoot — ice cream"
      }
    ],
  },
  gallery: {
    "eyebrow": {
      "ar": "من شغلنا",
      "en": "Our work"
    },
    "title": {
      "ar": "شغل حقيقي، لعلامات حقيقية",
      "en": "Real work for real brands"
    },
    "subtitle": {
      "ar": "كل مشروع بصفحته — افتح أي واحد وشوف الشغل اللي سوّيناه.",
      "en": "Every project has its own page — open one to see the work we made."
    },
    "more": {
      "ar": "المشروع التالي",
      "en": "Next project"
    },
    "projects": [
      {
        "slug": "og-burger",
        "client": "OG Burger",
        "logo": "/clients/og-burger.png",
        "color": "cyan",
        "title": {
          "ar": "هوية برگر كاملة",
          "en": "A complete burger identity"
        },
        "summary": {
          "ar": "من الشعار لحد علبة التوصيل: علب، أكياس، ستيكرات وكل قطعة توصل لإيد الزبون.",
          "en": "From the logo to the delivery box: boxes, bags, stickers and everything that reaches the customer's hands."
        },
        "cover": "/work/brand/og-enjoy.jpg",
        "items": [
          {
            "title": {
              "ar": "هوية بصرية كاملة",
              "en": "Full brand identity"
            },
            "category": "branding",
            "image": "/work/brand/og-enjoy.jpg"
          },
          {
            "title": {
              "ar": "علب البرگر",
              "en": "Burger box packaging"
            },
            "category": "branding",
            "image": "/work/brand/og-box.jpg"
          },
          {
            "title": {
              "ar": "ستيكرات وعناصر",
              "en": "Stickers & brand elements"
            },
            "category": "branding",
            "image": "/work/brand/og-stickers.jpg"
          },
          {
            "title": {
              "ar": "أكياس التوصيل",
              "en": "Paper bag"
            },
            "category": "branding",
            "image": "/work/brand/og-bag.jpg"
          },
          {
            "title": {
              "ar": "علب الكرافت",
              "en": "Kraft bowl"
            },
            "category": "branding",
            "image": "/work/brand/og-bowl.jpg"
          },
          {
            "title": {
              "ar": "تغليف البطاطا",
              "en": "Fries packaging"
            },
            "category": "branding",
            "image": "/work/brand/og-fries.jpg"
          }
        ]
      },
      {
        "slug": "nara",
        "client": "Nara by Naranj",
        "logo": "/clients/nara.png",
        "color": "orchid",
        "title": {
          "ar": "هوية نارا ومنيو نارنج",
          "en": "Nara's identity & the Naranj menu"
        },
        "summary": {
          "ar": "اللافتة، الأيقونات، يونيفورم الستاف، وتصميم المنيو — هوية وحدة تمشي بكل المكان.",
          "en": "The sign, icons, staff uniform and menu design — one identity across the whole place."
        },
        "cover": "/work/brand/nara-sign.jpg",
        "items": [
          {
            "title": {
              "ar": "لافتة المطعم",
              "en": "Restaurant sign"
            },
            "category": "branding",
            "image": "/work/brand/nara-sign.jpg"
          },
          {
            "title": {
              "ar": "تصميم المنيو",
              "en": "Menu design"
            },
            "category": "design",
            "image": "/work/brand/naranj-cover.jpg"
          },
          {
            "title": {
              "ar": "زي الموظفين",
              "en": "Staff uniforms"
            },
            "category": "branding",
            "image": "/work/brand/nara-uniform.jpg"
          },
          {
            "title": {
              "ar": "أيقونات الهوية",
              "en": "Iconography"
            },
            "category": "branding",
            "image": "/work/brand/nara-icons.jpg"
          },
          {
            "title": {
              "ar": "صفحات المنيو",
              "en": "Menu pages"
            },
            "category": "design",
            "image": "/work/brand/naranj-menu.jpg"
          }
        ]
      },
      {
        "slug": "viking-burger",
        "client": "Viking Burger",
        "logo": "/clients/viking-burger.png",
        "color": "yellow",
        "title": {
          "ar": "تصاميم سوشيال وواجهة الفرع",
          "en": "Social design & storefront"
        },
        "summary": {
          "ar": "محتوى سوشيال جريء وواجهة فرع تحچي بنفس لغة فايكنگ.",
          "en": "Bold social content and a storefront that speaks Viking's language."
        },
        "cover": "/work/brand/viking-1.jpg",
        "items": [
          {
            "title": {
              "ar": "تصميم واجهة الفرع",
              "en": "Storefront visual"
            },
            "category": "design",
            "image": "/work/brand/viking-1.jpg"
          },
          {
            "title": {
              "ar": "تصميم سوشيال ميديا",
              "en": "Social media design"
            },
            "category": "design",
            "image": "/work/brand/viking-2.jpg"
          },
          {
            "title": {
              "ar": "إعلان الآيس كريم",
              "en": "Ice cream launch post"
            },
            "category": "design",
            "image": "/work/brand/viking-11.jpg"
          },
          {
            "title": {
              "ar": "تصميم سوشيال ميديا",
              "en": "Social media design"
            },
            "category": "design",
            "image": "/work/brand/viking-6.jpg"
          },
          {
            "title": {
              "ar": "منيو الآيس كريم",
              "en": "Ice cream menu"
            },
            "category": "design",
            "image": "/work/brand/viking-12.jpg"
          }
        ]
      },
      {
        "slug": "chicken-rays",
        "client": "Chicken Ray's",
        "logo": "/clients/chicken-rays.png",
        "color": "green",
        "title": {
          "ar": "ريل ناشفيل هوت تشكن",
          "en": "Nashville Hot Chicken reel"
        },
        "summary": {
          "ar": "تصوير ومونتاج ريل يخلي الواحد يجوع من أول ثانية.",
          "en": "A shot-and-cut reel that makes you hungry from the first second."
        },
        "cover": "/work/reel-poster.jpg",
        "items": [
          {
            "title": {
              "ar": "ريل ناشفيل هوت تشكن",
              "en": "Nashville Hot Chicken reel"
            },
            "category": "video",
            "image": "/work/reel-poster.jpg",
            "video": "/work/reel.mp4"
          }
        ]
      },
      {
        "slug": "hamish-roastery",
        "client": "Hamish Roastery",
        "logo": "/clients/hamish-roastery.png",
        "color": "lilac",
        "title": {
          "ar": "شعار وهوية محمصة",
          "en": "Roastery logo & identity"
        },
        "summary": {
          "ar": "شعار وهوية بلونين لمحمصة حامش.",
          "en": "A two-colour logo and identity for Hamish Roastery."
        },
        "cover": "/work/brand/hamish-red.jpg",
        "items": [
          {
            "title": {
              "ar": "شعار وهوية",
              "en": "Logo & identity"
            },
            "category": "branding",
            "image": "/work/brand/hamish-red.jpg"
          },
          {
            "title": {
              "ar": "ألوان الهوية",
              "en": "Identity colourways"
            },
            "category": "branding",
            "image": "/work/brand/hamish-green.jpg"
          }
        ]
      },
      {
        "slug": "west-burger",
        "client": "West Burger",
        "logo": "/clients/west-burger.png",
        "color": "cyan",
        "title": {
          "ar": "شعار وهوية برگر",
          "en": "Burger logo & identity"
        },
        "summary": {
          "ar": "هوية بصرية لـ West Burger.",
          "en": "A visual identity for West Burger."
        },
        "cover": "/work/brand/west-burger.jpg",
        "items": [
          {
            "title": {
              "ar": "شعار",
              "en": "Logo design"
            },
            "category": "branding",
            "image": "/work/brand/west-burger.jpg"
          }
        ]
      },
      {
        "slug": "photo-shoots",
        "client": "",
        "logo": "",
        "color": "yellow",
        "title": {
          "ar": "جلسات تصوير منتجات",
          "en": "Product photo shoots"
        },
        "summary": {
          "ar": "تصوير أكل ومنتجات وموديل بإضاءة وستايل يناسب كل علامة.",
          "en": "Food, product and model photography, lit and styled for each brand."
        },
        "cover": "/work/photo/shoot-09.jpg",
        "items": [
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-09.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-02.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-11.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-06.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-01.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-10.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-05.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-13.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-08.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-03.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-14.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-12.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-16.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-07.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-15.jpg"
          },
          {
            "title": {
              "ar": "تصوير منتجات وموديل",
              "en": "Product & model shoot"
            },
            "category": "photo",
            "image": "/work/photo/shoot-04.jpg"
          }
        ]
      }
    ]
  },
  clients: {
    eyebrow: { ar: "عملاؤنا", en: "Clients" },
    title: { ar: "علامات وثقت بنا", en: "Brands that trusted us" },
    subtitle: {
      ar: "من المطاعم والمقاهي للعيادات والمتاجر — علامات اختارت تكون مختلفة.",
      en: "From restaurants and cafés to clinics and retail — brands that chose to be different.",
    },
    logos: [
      {
        "name": "Viking Burger",
        "logo": "/clients/viking-burger.png"
      },
      {
        "name": "OG Burger",
        "logo": "/clients/og-burger.png"
      },
      {
        "name": "The Butter",
        "logo": "/clients/the-butter.png"
      },
      {
        "name": "Nara by Naranj",
        "logo": "/clients/nara.png"
      },
      {
        "name": "Hamish Roastery",
        "logo": "/clients/hamish-roastery.png"
      },
      {
        "name": "Chicken Ray's",
        "logo": "/clients/chicken-rays.png"
      },
      {
        "name": "West Burger",
        "logo": "/clients/west-burger.png"
      },
      {
        "name": "Frooj Bo Ali",
        "logo": "/clients/frooj-bo-ali.png"
      },
      {
        "name": "Soft Creamery",
        "logo": "/clients/soft-creamery.png"
      },
      {
        "name": "Locus",
        "logo": "/clients/locus.png"
      },
      {
        "name": "Taj Almazraa",
        "logo": "/clients/taj-almazraa.png"
      },
      {
        "name": "Better Home",
        "logo": "/clients/better-home.png"
      },
      {
        "name": "Zaid Shakir",
        "logo": "/clients/zaid-shakir.png"
      },
      {
        "name": "Tazaa",
        "logo": "/clients/tazaa.png"
      },
      {
        "name": "Sumer",
        "logo": "/clients/sumer.png"
      },
      {
        "name": "Nanolink USA",
        "logo": "/clients/nanolink.png"
      },
      {
        "name": "Sheen",
        "logo": "/clients/sheen.png"
      },
      {
        "name": "Taj Henna",
        "logo": "/clients/taj-henna.png"
      },
      {
        "name": "Qatonil",
        "logo": "/clients/qatonil.png"
      }
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
      ar: "كل عميل عنده قصة. اضغط على أي قصة وتابعها من البداية لحد النتيجة.",
      en: "Every client has a story. Tap one and follow it from the brief to the result.",
    },
    items: cases,
  },
  beforeAfter: {
    eyebrow: { ar: "الأرقام لا تكذب", en: "Numbers don't lie" },
    title: { ar: "الأرقام قبل ماجك", en: "The numbers before Magic" },
    subtitle: {
      ar: "شوف الأرقام قبل ما نشتغل، وبعدين لوّح بالعصا السحرية.",
      en: "See the numbers before we started, then wave the magic wand.",
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
      caseIds: ["og-burger", "viking-burger", "nara", "bo-ali"],
    },
    {
      slug: "clinic-pitch",
      client: "Shifa Clinics",
      clientLogo: "",
      note: { ar: "عرض مخصص لعيادات الشفاء", en: "A tailored deck for Shifa Clinics" },
      sections: ["hero", "team", "cases", "beforeAfter", "featured", "services", "contact"],
      caseIds: ["geogres", "vita-home"],
    },
  ],
};
