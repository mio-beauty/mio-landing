const image = (name) => `/product-images/${name}`;

const products = [
  {
    id: "cleansing-foam",
    image: image("Tozalo_vchi ko_pik.jpg"),
    uz: ["Tozalo'vchi ko'pik", "Yuzni tozalash uchun ishlatiluvchi vosita"],
    ru: ["Пенка", "Средство для очищения лица."],
    en: ["Cleansing foam", "A facial cleansing product."],
  },
  {
    id: "micellar-water",
    image: image("Micellar suv.jpg"),
    uz: ["Micellar suv", "Makiyajni tozalash vositasi"],
    ru: ["Мицелярная вода", "Средство для снятия макияжа"],
    en: ["Micellar water", "Makeup remover."],
  },
  {
    id: "dry-skin-set",
    image: image("Монтажная область 1.jpg"),
    uz: [
      "QURUQ TERI UCHUN NABOR",
      "Quruq teri uchun namlantiruvchi va yumshatuvchi kompleks parvarish.",
    ],
    ru: [
      "НАБОР ДЛЯ СУХОЙ КОЖИ",
      "Комплексный уход для сухой кожи с увлажняющим и смягчающим эффектом.",
    ],
    en: [
      "DRY SKIN SET",
      "Complete care for dry skin with moisturizing and softening benefits.",
    ],
  },
  {
    id: "oily-skin-set",
    image: image("Монтажная область 2.jpg"),
    uz: [
      "YOG‘LI TERI UCHUN NABOR",
      "Yog‘li va toshmalarga moyil teri uchun ortiqcha yog‘ni nazorat qiluvchi kompleks parvarish.",
    ],
    ru: [
      "НАБОР ДЛЯ ЖИРНОЙ КОЖИ",
      "Комплексный уход для жирной и проблемной кожи, склонной к высыпаниям и жирному блеску.",
    ],
    en: [
      "OILY SKIN SET",
      "Complete care for oily, blemish-prone skin that helps control excess oil and shine.",
    ],
  },
  {
    id: "combination-skin-set",
    image: image("Монтажная область 3.jpg"),
    uz: [
      "KOMBINATSIYALANGAN TERI UCHUN NABOR",
      "Kombinatsiyalangan teri uchun muvozanatli kundalik parvarish — terini nam va toza saqlashga yordam beradi.",
    ],
    ru: [
      "НАБОР ДЛЯ КОМБИНИРОВАННОЙ КОЖИ",
      "Сбалансированный уход для комбинированной кожи — помогает поддерживать чистоту и увлажнённость кожи.",
    ],
    en: [
      "COMBINATION SKIN SET",
      "Balanced daily care for combination skin — helps keep the skin clean and hydrated.",
    ],
  },
  {
    id: "sensitive-skin-set",
    image: image("Монтажная область 4.jpg"),
    uz: [
      "SEZGIR TERI UCHUN NABOR",
      "Sezgir teri uchun yumshoq parvarish — namlantirish va teri qulayligini saqlashga yordam beradi.",
    ],
    ru: [
      "НАБОР ДЛЯ ЧУВСТВИТЕЛЬНОЙ КОЖИ",
      "Мягкий уход для чувствительной кожи — помогает увлажнять и поддерживать комфорт кожи.",
    ],
    en: [
      "SENSITIVE SKIN SET",
      "Gentle care for sensitive skin — helps moisturize and maintain skin comfort.",
    ],
  },
  {
    id: "anti-wrinkle-set",
    image: image("Монтажная область 5.jpg"),
    uz: [
      "AJINLAR UCHUN NABOR",
      "Ajinlar va teri tarangligi uchun parvarish — terini nam, silliq va parvarishlangan ko‘rinishda saqlashga yordam beradi.",
    ],
    ru: [
      "НАБОР ПРОТИВ МОРЩИН",
      "Уход за кожей с морщинами — помогает сохранить кожу увлажнённой, гладкой и ухоженной.",
    ],
    en: [
      "ANTI-WRINKLE SET",
      "Care for skin with wrinkles — helps keep the skin hydrated, smooth and well-cared for.",
    ],
  },
  {
    id: "mini-anti-ageing-set",
    image: image("Монтажная область 6.jpg"),
    uz: [
      "AJINLARGA QARSHI MINI SET",
      "Ajinlarga qarshi parvarish — terini nam, yumshoq va silliq saqlashga yordam beradi.",
    ],
    ru: [
      "МИНИ SET ПРОТИВ МОРЩИН",
      "Уход против морщин — помогает сохранить кожу увлажнённой, мягкой и гладкой.",
    ],
    en: [
      "MINI ANTI-AGEING SET",
      "Anti-wrinkle care — helps keep the skin hydrated, soft and smooth.",
    ],
  },
  {
    id: "amore-mio-pigmentation-care-set",
    image: image("Монтажная область 7.jpg"),
    uz: [
      "DOG‘LAR UCHUN NABOR Amore Mio",
      "Pigment dog‘lari va notekis teri rangi uchun parvarish — terini yorqin, nam va bir tekis ko‘rinishda saqlashga yordam beradi.",
    ],
    ru: [
      "НАБОР ОТ ПИГМЕНТАЦИИ Amore Mio",
      "Уход за кожей с пигментацией — помогает сделать кожу более сияющей, увлажнённой и ровной.",
    ],
    en: [
      "PIGMENTATION CARE SET Amore Mio",
      "Care for pigmented skin — helps keep the skin brighter, hydrated and more even-looking.",
    ],
  },
  {
    id: "pigmentation-care-set",
    image: image("Монтажная область 8.jpg"),
    uz: [
      "DOG‘LAR UCHUN NABOR",
      "Yorqin va bir tekis teri rangi uchun parvarish — pigmentatsiyani kamaytirish va namlantirishga yordam beradi.",
    ],
    ru: [
      "НАБОР ОТ ПИГМЕНТАЦИИ",
      "Уход для ровного и сияющего тона — помогает уменьшить пигментацию и увлажнить кожу.",
    ],
    en: [
      "PIGMENTATION CARE SET",
      "Care for a brighter, even skin tone — helps reduce pigmentation and moisturize the skin.",
    ],
  },
  {
    id: "acne-breakout-care-set",
    image: image("Монтажная область 9.jpg"),
    uz: [
      "AKNE VA TOSHMALAR UCHUN NABOR",
      "Aknega moyil teri uchun tozalovchi va yog‘ni nazorat qiluvchi parvarish.",
    ],
    ru: [
      "НАБОР ОТ АКНЕ И ВЫСЫПАНИЙ",
      "Уход для кожи, склонной к акне — очищает и помогает контролировать жирность.",
    ],
    en: [
      "ACNE & BREAKOUT CARE SET",
      "Care for acne-prone skin — cleanses and helps control excess oil.",
    ],
  },
  {
    id: "face-mask",
    image: image("Maska.jpg"),
    uz: ["Yuz niqobi", "Teri uchun chuqur parvarish"],
    ru: ["Маска для лица", "Глубокий уход за кожей"],
    en: ["Face mask", "Deep care for the skin."],
  },
  {
    id: "face-scrub",
    image: image("Scrab.jpg"),
    uz: ["Scrab", "Muloyim tozalaydi, terini silliq va yumshoq qiladi"],
    ru: ["Скраб для лица", "Мягко очищает, делает кожу гладкой и мягкой"],
    en: ["Face Scrub", "Gently cleanses, leaving skin smooth and soft."],
  },
  {
    id: "moisturizing-cream",
    image: image("Namlantiruvchi crem.jpg"),
    uz: ["Namlantiruvchi crem", "Terni namlantiruvchi vosita"],
    ru: ["Увлажняющий крем", "Средство для увлажнения кожи."],
    en: ["Moisturuzing cream", "Skin moisturizing product"],
  },
  {
    id: "nourishing-cream",
    image: image("Oziqlantiruvchi krem.jpg"),
    uz: ["Oziqlantiruvchi crem", "Terini oziqlantiruvchi vosita"],
    ru: ["Питательный крем", "Средство для питания кожи."],
    en: ["Nourishing cream", "Skin nourishing product."],
  },
  {
    id: "whitening-cream",
    image: image("Oqartiruvchi crem.jpg"),
    uz: ["Oqartiruvchi crem", "Terini oqartiruvchi vosita"],
    ru: ["Осветляющий крем", "Средство для осветления кожи."],
    en: ["Whitening cream", "Skin brightening product."],
  },
  {
    id: "gold-cream",
    image: image("Gold crem.jpg"),
    uz: ["Gold crem", "Ajinlarga qarshi crem"],
    ru: ["Голд крем", "Крем против морщин."],
    en: ["Gold cream", "Anti-wrinkle cream"],
  },
  {
    id: "anti-acne-cream",
    image: image("Anti-akne krem.jpg"),
    uz: ["Anti-akne crem", "Husunbuzarlarga qarshi vosita"],
    ru: ["Анти-акне крем", "Средство против акне."],
    en: ["Anti-acne cream gel", "Anti-acne product."],
  },
  {
    id: "sensitive-cleansing-foam",
    image: image("Sensitive tozalo_vchi ko_pik.jpg"),
    uz: [
      "Sensitive tozalo'vchi ko'pik",
      "Tasirchan yuzlar uchun tozalo'vchi ko'pik",
    ],
    ru: ["Sensitive пенка", "Пенка для чувствительной кожи"],
    en: ["Sensitive cleansing foam", "Cleansing foam for sensitive skin."],
  },
  {
    id: "milk-toner",
    image: image("Sutli toner.jpg"),
    uz: ["Sutli toner", "Terini namlantiruvchi toner"],
    ru: ["Молочный тонер", "Увлажняющий тонер"],
    en: ["Milk toner", "Moisturizing toner for the skin."],
  },
  {
    id: "vitamin-c-serum",
    image: image("Vitamin C Serum.jpg"),
    uz: ["Vitamin C Serum", "Dog'latni ochartiruvchi vosita"],
    ru: ["Витамин С", "Средство для осветления пигментных пятен."],
    en: ["Vitamin C Serum", "Dark spot brightening product."],
  },
  {
    id: "brightening-serum",
    image: image("Yaltiratuvchi serum.jpg"),
    uz: ["Yaltiratuvchi serum", "Terini yorqinlashtiruvchi vosita"],
    ru: ["Осветляющая сыворотка", "Средство для сияния кожи."],
    en: ["Brightening serum", "Skin brightening product."],
  },
  {
    id: "sparkling-oil-serum",
    image: image("Sparkling oil serum.jpg"),
    uz: ["Sparkling oil serum", "Ajinlarga qarshi vosita"],
    ru: ["Sparkling oil serum", "Сыворотка против морщин."],
    en: ["Sparkling oil serum", "Anti-wrinkle serum."],
  },
  {
    id: "triple-anti-ageing-serum",
    image: image("Triple Anti- ageing serum.jpg"),
    uz: ["Triple anti-ageing serum", "Qarishga va ajinlarga qarshi serum"],
    ru: ["Triple anti-ageing сыворотка", "Сыворотка против старения и морщин"],
    en: ["Triple anti-ageing serum", "Anti-aging and anti-wrinkle serum"],
  },
  {
    id: "spf-50",
    image: image("SPF 50.jpg"),
    uz: ["SPF 50", "Terini himoya qiluvchi crem"],
    ru: ["SPF 50", "Солнцезащитный крем"],
    en: ["SPF 50", "Protective cream for the skin."],
  },
  {
    id: "bb-cream",
    image: image("BB kream.jpg"),
    uz: ["BB kream", "Yuzga ton beruchi vosita"],
    ru: ["BB крем", "Крем для защиты и выравнивания тона кожи."],
    en: ["BB cream", "Cream for skin protection and evening out skin tone"],
  },
  {
    id: "body-cream",
    image: image("Tana kremi.jpg"),
    uz: ["Tana kremi", "Tana namlantiruvchi crem"],
    ru: ["Крем для тела", "Увлажняющий крем для тела"],
    en: ["Body crem", "Moisturizing cream for the body"],
  },
  {
    id: "spf-70",
    image: image("SPF 70ml.jpg"),
    uz: ["SPF 70ml", "Terini himoya qiluvchi crem"],
    ru: ["SPF 70ml", "Солнцезащитный крем"],
    en: ["SPF 70ml", "Protective cream for the skin."],
  },
];

export default products;
