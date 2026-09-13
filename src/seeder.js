import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import AdminUser from './models/AdminUser.js';
import Accessory from './models/Accessory.js';
import Category from './models/Category.js';
import SparePart from './models/SparePart.js';
import MaintenanceService from './models/MaintenanceService.js';
import MaintenanceBooking from './models/MaintenanceBooking.js';
import Order from './models/Order.js';
import HeroSlide from './models/HeroSlide.js';
import WebsiteContent from './models/WebsiteContent.js';
import ContactMessage from './models/ContactMessage.js';

export const BMW_25_SPARE_PARTS = [
  {
    name: "Front Brake Pads Set (طقم تيل فرامل أمامي)",
    sku: "34116860017",
    categorySlug: "brake",
    brand: "Textar",
    model: "BMW 3 / 4 / 1 Series (F30, F32, F20)",
    price: 3200,
    stock: 30,
    minimumStock: 5,
    shortDescription: "طقم بطانات فرامل أمامية OEM خالي من الأسبستوس، يمنح كبحاً دقيقاً مع تقليل الغبار والصفير.",
    description: "طقم تيل فرامل أمامي ألماني الصنع معتمد من Textar لموديلات بي إم دابليو الفئة الثالثة والرابعة، يضمن أداء كبح عالي الثبات تحت درجات الحرارة المرتفعة مع عمر افتراضي طويل وحماية الطنابير.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788835020/boo-automotive/parts/ghxuvpf6lfopqbjwykkf.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31, F35: 320i, 328i, 330i)",
      "BMW 4 Series (F32, F36: 420i, 428i, 430i)",
      "BMW 1 Series (F20, F21: 118i, 120i)"
    ],
    specs: [
      { key: "Brand / Manufacturer", value: "Textar OEM Germany" },
      { key: "OEM Part Number", value: "34 11 6 860 017" },
      { key: "Position", value: "Front Axle (المحور الأمامي)" },
      { key: "Friction Material", value: "Low-Metallic Ceramic Compound" },
      { key: "Condition", value: "Brand New Genuine OEM (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Rear Brake Pads Set (طقم تيل فرامل خلفي)",
    sku: "34216873093",
    categorySlug: "brake",
    brand: "Brembo",
    model: "BMW 3 / 4 / 2 Series (F30, F32, F22)",
    price: 2650,
    stock: 30,
    minimumStock: 4,
    shortDescription: "طقم بطانات فرامل خلفية متوازنة لقوة الكبح وثبات مؤخرة السيارة وعمر تشغيلي طويل.",
    description: "طقم تيل فرامل خلفي أصلي من Brembo مصمم لتوفير توازن مثالي لمنظومة الفرامل ومنع انحراف السيارة أثناء التوقف المفاجئ.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834973/boo-automotive/parts/z06hjpyfrgijwl83zfuh.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31: 320i, 328i)",
      "BMW 4 Series (F32, F36: 420i, 428i)",
      "BMW 2 Series (F22: 220i, 228i)"
    ],
    specs: [
      { key: "Brand / Manufacturer", value: "Brembo Italy" },
      { key: "OEM Part Number", value: "34 21 6 873 093" },
      { key: "Position", value: "Rear Axle (المحور الخلفي)" },
      { key: "Condition", value: "Brand New OEM" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Front Brake Rotors Pair (طنابير فرامل أمامية مهواة)",
    sku: "34116792219",
    categorySlug: "brake",
    brand: "Zimmermann",
    model: "BMW 3 / 4 Series (F30 320i, 328i)",
    price: 7400,
    stock: 30,
    minimumStock: 2,
    shortDescription: "زوج أقراص فرامل مهواة مع طبقة Coat Z المقاومة للصدأ والتآكل الناتج عن الحرارة الشديدة.",
    description: "أقراص فرامل أمامية مهواة ألمانية أصلية من Zimmermann مغطاة بتقنية Coat Z المقاومة للصدأ، تمنع الاعوجاج والاهتزازات عند الفرملة على السرعات العالية.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834937/boo-automotive/parts/nsnl9xx0vo1jconkmv6v.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30 320i, 328i, 330i)",
      "BMW 4 Series (F32, F36 420i, 428i, 430i)"
    ],
    specs: [
      { key: "Brand / Manufacturer", value: "Zimmermann Germany (Coat Z)" },
      { key: "OEM Part Number", value: "34 11 6 792 219" },
      { key: "Type", value: "Internally Vented Discs (مهواة داخلياً)" },
      { key: "Diameter", value: "312 mm x 24 mm" },
      { key: "Condition", value: "Brand New Pair" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Rear Brake Rotors Pair (طنابير فرامل خلفية)",
    sku: "34216792227",
    categorySlug: "brake",
    brand: "Zimmermann",
    model: "BMW 3 / 4 Series (F30, F32)",
    price: 5900,
    stock: 30,
    minimumStock: 2,
    shortDescription: "زوج طنابير فرامل خلفية أصلية مطلية ضد الصدأ مع فتحات تبريد دقيقة.",
    description: "طنابير فرامل خلفية مطابقة لمواصفات بي إم دابليو الأصلية، مصنعة من سبيكة حديد الزهر عالي الكربون لمنع التآكل غير المتساوي.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834895/boo-automotive/parts/ab85fzvidbnrwxl3yi20.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F35: 320i, 328i)",
      "BMW 4 Series (F32, F36: 420i, 428i)"
    ],
    specs: [
      { key: "Brand", value: "Zimmermann Coat Z" },
      { key: "OEM Part Number", value: "34 21 6 792 227" },
      { key: "Position", value: "Rear Axle Pair" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Front Brake Pad Wear Sensor (حساس تيل فرامل أمامي)",
    sku: "34356792289",
    categorySlug: "brake",
    brand: "Bowa",
    model: "BMW 3 / 4 Series (F30, F32, F36)",
    price: 650,
    stock: 30,
    minimumStock: 8,
    shortDescription: "كابل حساس حراري لإرسال إشعار تحذيري على لوحة العدادات بمجرد وصول بطانة التيل للحد الأدنى.",
    description: "حساس تيل فرامل أمامي إلكتروني معتمد من Bowa مصنع من خامات مقاومة للحرارة العالية والزيوت، يعطي قراءة دقيقة على شاشة الـ iDrive.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834856/boo-automotive/parts/szqgnwknckuibskri3fd.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31, F34 GT)",
      "BMW 4 Series (F32, F33, F36 Gran Coupe)"
    ],
    specs: [
      { key: "Manufacturer", value: "Bowa Electronic Germany" },
      { key: "OEM Part Number", value: "34 35 6 792 289" },
      { key: "Condition", value: "Brand New Genuine" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Engine Oil Filter Kit (فلتر زيت المحرك مع الجوانات)",
    sku: "11427953129",
    categorySlug: "filters",
    brand: "Mann-Filter",
    model: "BMW 3 / 5 Series / X3 / X1 (N20, N26, B48)",
    price: 720,
    stock: 30,
    minimumStock: 10,
    shortDescription: "خرطوشة فلتر زيت ألمانية متضمنة الجوانات الدائرية وحلقة النحاس لعزل الشوائب الدقيقة.",
    description: "فلتر زيت المحرك الأصلي Mann-Filter HU 816 z المعتمد من BMW. يحافظ على لزوجة الزيت ونقاء دورة التزييت ويحمي عمود الكرنك والسبائك من التآكل.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788835020/boo-automotive/parts/ghxuvpf6lfopqbjwykkf.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20/N26)",
      "BMW 5 Series (F10, G30: 520i, 528i)",
      "BMW X3 (F25: 20i, 28i)",
      "BMW X1 (E84, F48)"
    ],
    specs: [
      { key: "Brand / Model", value: "Mann-Filter HU 816 z" },
      { key: "OEM Part Number", value: "11 42 7 953 129 / 11 42 8 507 683" },
      { key: "Included in Kit", value: "Filter Element + O-Ring Seals + Copper Washer" },
      { key: "Condition", value: "Brand New Genuine (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Engine Air Intake Filter (فلتر هواء المحرك)",
    sku: "13718507320",
    categorySlug: "filters",
    brand: "Mahle",
    model: "BMW 1 / 2 / 3 / 4 Series (F20, F22, F30, F32)",
    price: 1150,
    stock: 30,
    minimumStock: 6,
    shortDescription: "فلتر تنقية هواء عالي السعة لحماية غرف الاحتراق وحساس الماف (MAF) من الغبار والرمال.",
    description: "فلتر هواء محرك أصلي Mahle LX 2077 مصنع بألياف سليلوزية دقيقة توفر أقصى معدل تدفق للهواء مع حجز 99.8% من الأتربة الدقيقة لحماية التيربو.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834973/boo-automotive/parts/z06hjpyfrgijwl83zfuh.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31: 316i, 320i, 328i)",
      "BMW 1 Series (F20, F21: 116i, 118i, 120i)",
      "BMW 2 Series (F22: 220i, 228i)",
      "BMW 4 Series (F32, F36: 420i, 428i)"
    ],
    specs: [
      { key: "Brand", value: "Mahle Original LX 2077" },
      { key: "OEM Part Number", value: "13 71 8 507 320" },
      { key: "Filter Type", value: "Pleated Air Filter Panel" },
      { key: "Condition", value: "Brand New OEM" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Activated Carbon Cabin Air Filter (فلتر تكييف كربوني مضاد للبكتيريا)",
    sku: "64119237555",
    categorySlug: "filters",
    brand: "Corteco",
    model: "BMW 3 / 4 Series (F30, F32, F36)",
    price: 1280,
    stock: 30,
    minimumStock: 5,
    shortDescription: "فلتر مقصورة متعدد الطبقات مدعّم بالفحم النشط لتنقية الهواء من عوادم الطرق والروائح والأتربة.",
    description: "فلتر تكييف كربوني متقدم من Corteco يزيل الغازات الضارة والروائح الكريهة ويمنع تكون الفطريات داخل ثلاجة التكييف.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834937/boo-automotive/parts/nsnl9xx0vo1jconkmv6v.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31, F34 GT)",
      "BMW 4 Series (F32, F33, F36 Gran Coupe)"
    ],
    specs: [
      { key: "Brand", value: "Corteco MicronAir Carbon" },
      { key: "OEM Part Number", value: "64 11 9 237 555" },
      { key: "Filtration", value: "Activated Carbon + PM2.5 Micro-Particle" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "In-Line Fuel Filter with Pressure Regulator (فلتر بنزين داخلي)",
    sku: "16127233840",
    categorySlug: "filters",
    brand: "Bosch",
    model: "BMW 3 / 5 Series (E90, F30, E60, F10)",
    price: 2850,
    stock: 30,
    minimumStock: 3,
    shortDescription: "وحدة ترشيح بنزين دقيقة لحماية الرشاشات ومضخات الحقن المباشر من الشوائب والماء.",
    description: "فلتر وقود معدني أصلي من Bosch مدمج به صمام منظم للضغط لتثبيت ضغط البنزين الواصل لطلمبة الحقن المباشر ومنع انسداد الرشاشات.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834895/boo-automotive/parts/ab85fzvidbnrwxl3yi20.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (E90, F30: 320i, 325i, 330i)",
      "BMW 5 Series (E60, F10: 520i, 523i, 528i)",
      "BMW X5 (E70 3.0si)"
    ],
    specs: [
      { key: "Brand", value: "Bosch Original Germany" },
      { key: "OEM Part Number", value: "16 12 7 233 840" },
      { key: "Housing", value: "Extruded Aluminum" },
      { key: "Condition", value: "Brand New Genuine" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Laser Iridium Spark Plugs Set of 4 (طقم بوجيهات ليزر إيريديوم 4 شمعات)",
    sku: "12120039664",
    categorySlug: "engine",
    brand: "NGK",
    model: "BMW 320i, 328i, 520i, 528i, X1 (N20, N26, B48)",
    price: 2450,
    stock: 30,
    minimumStock: 8,
    shortDescription: "طقم 4 شمعات إشعال ليزر إيريديوم لضمان الاحتراق الأمثل وتوفير الوقود ومنع التقطيع.",
    description: "شمعات الإشعال الأصلية NGK SILZKBR8D8S المعتمدة لمحركات BMW تيربو. تتميز بسن إيريديوم ليزر دقيق 0.6 مم يضمن شرارة قوية تحت أقصى ضغط شحن تيربو.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834856/boo-automotive/parts/szqgnwknckuibskri3fd.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20 Engine)",
      "BMW 5 Series (F10: 520i, 528i)",
      "BMW X1 (E84 xDrive28i)",
      "BMW X3 (F25 20i, 28i)",
      "BMW 4 Series (F32: 420i, 428i)"
    ],
    specs: [
      { key: "Manufacturer Code", value: "NGK Laser Iridium SILZKBR8D8S" },
      { key: "OEM Part Number", value: "12 12 0 039 664 / 12 12 0 037 580" },
      { key: "Quantity", value: "Full Set of 4 Plugs" },
      { key: "Condition", value: "Brand New Genuine (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Direct Ignition Coil Pack (موبينة إشعال إلكترونية)",
    sku: "12138616153",
    categorySlug: "electrical",
    brand: "Delphi",
    model: "BMW 3 / 4 / 5 Series / X3 / X5 (F30, G20, F10, G30)",
    price: 1850,
    stock: 30,
    minimumStock: 6,
    shortDescription: "ملف إشعال إلكتروني عالي الكفاءة يرفع الجهد لآلاف الفولتات لتوليد شرارة كافية ومستقرة.",
    description: "موبينة إشعال أصلية من Delphi Technologies مصممة لتحمل درجات حرارة المحرك العالية ومنع الميس فاير (Misfire) وتأمين عزم تسارع ناعم.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834817/boo-automotive/parts/x2hgzoif3abw9bcgpxyj.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, G20: 320i, 330i)",
      "BMW 5 Series (F10, G30: 520i, 530i)",
      "BMW 4 Series (F32, G22: 420i, 430i)",
      "BMW X3 (F25, G01)",
      "BMW X5 (E70, F15, G05)"
    ],
    specs: [
      { key: "Brand", value: "Delphi OEM" },
      { key: "OEM Part Number", value: "12 13 8 616 153 / 12 13 7 594 937" },
      { key: "Voltage", value: "12V Direct Spark Output" },
      { key: "Condition", value: "Brand New OEM" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Electric Water Pump with Mounting Hardware (طرمبة مياه كهربائية ذكية)",
    sku: "11517597715",
    categorySlug: "engine",
    brand: "Pierburg",
    model: "BMW 3 / 5 Series / X1 / Z4 (N20, N26 Engines)",
    price: 11500,
    stock: 30,
    minimumStock: 2,
    shortDescription: "طرمبة تبريد كهربائية متغيرة السرعة متصلة مباشرة بوحدة التحكم الإلكترونية (DME).",
    description: "مضخة مياه كهربائية ألمانية أصلية من Pierburg تعمل بدون سير وتحت تحكم كامل من كمبيوتر المحرك لضبط درجة الحرارة المثالية وحماية رأس المحرك.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834771/boo-automotive/parts/ndyzhjorijoor6ryz0bd.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20/N26 Engine)",
      "BMW 5 Series (F10: 520i, 528i)",
      "BMW X1 (E84 xDrive28i)",
      "BMW X3 (F25 28i)",
      "BMW Z4 (E89 sDrive28i)"
    ],
    specs: [
      { key: "Manufacturer", value: "Pierburg Germany" },
      { key: "OEM Part Number", value: "11 51 7 597 715 / 11 51 8 635 089" },
      { key: "Motor Type", value: "Brushless Electric DC Motor" },
      { key: "Condition", value: "Brand New Genuine OEM (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Thermostat with Integrated Housing (كوعة ثرموستات مياه كهربائية بالفيشة)",
    sku: "11538635689",
    categorySlug: "engine",
    brand: "Mahle Behr",
    model: "BMW 3 / 4 / 5 Series (N20 Engine)",
    price: 3850,
    stock: 30,
    minimumStock: 3,
    shortDescription: "صمام حراري إلكتروني بالكوعة والفيشة لتسريع الإحماء والتحكم الدقيق في تدفق مياه التبريد.",
    description: "كوعة ثرموستات مياه كاملة بحساس الحرارة والفيشة الإلكترونية من Mahle Behr. تضمن وصول المحرك لحرارة التشغيل الطبيعية 95°C في أسرع وقت وتمنع سخونة المحرك.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834734/boo-automotive/parts/ravwykl63tydswyacoqq.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20)",
      "BMW 5 Series (F10: 520i, 528i)",
      "BMW 4 Series (F32: 420i, 428i)",
      "BMW X3 (F25 20i, 28i)"
    ],
    specs: [
      { key: "Brand", value: "Mahle Behr OEM" },
      { key: "OEM Part Number", value: "11 53 8 635 689 / 11 53 7 588 876" },
      { key: "Opening Temperature", value: "97°C Electronically Controlled" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Coolant Expansion Tank with Sensor & Cap (قربة مياه الردياتير بالغطاء والحساس)",
    sku: "17137640514",
    categorySlug: "engine",
    brand: "Meyle",
    model: "BMW 1 / 2 / 3 / 4 Series (F20, F22, F30, F32)",
    price: 2900,
    stock: 30,
    minimumStock: 4,
    shortDescription: "خزان تمدد بلاستيكي مقوى يتحمل الضغط والحرارة العالية مع حساس مستوى سائل التبريد.",
    description: "قربة مياه ردياتير أصلية Meyle HD مصنعة من بوليمر معالج حرارياً ومزودة بحساس منسوب المياه وغطاء أصلي مصمم لتفريغ الضغط الزائد بأمان.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788743641/boo-automotive/parts/odb1agqedt3vophn1glm.jpg", isMain: true }],
    compatibility: [
      "BMW 1 Series (F20, F21: 116i, 118i, 120i)",
      "BMW 2 Series (F22, F23)",
      "BMW 3 Series (F30, F31, F34 GT: 316i, 320i, 328i)",
      "BMW 4 Series (F32, F33, F36: 420i, 428i)"
    ],
    specs: [
      { key: "Brand", value: "Meyle HD Germany" },
      { key: "OEM Part Number", value: "17 13 7 640 514" },
      { key: "Includes", value: "Expansion Tank + Level Sensor + Pressure Cap" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Engine Cooling Aluminum Radiator (ردياتير تبريد المحرك ألومنيوم)",
    sku: "17117600520",
    categorySlug: "engine",
    brand: "Nissens",
    model: "BMW 3 / 4 Series (F30, F32: 316i, 320i, 328i, 330i)",
    price: 8600,
    stock: 30,
    minimumStock: 2,
    shortDescription: "مبادل حراري ألومنيوم فائق التوصيل لخفض حرارة المياه بكفاءة في الأجواء الحارة.",
    description: "ردياتير ألومنيوم أصلي من Nissens الدنماركية، ملحوم بدقة لزيادة كفاءة التبادل الحراري بنسبة 15% وتحمل ضغوط دورة التبريد في درجات حرارة الصيف المصرية.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834680/boo-automotive/parts/ksw8y2b5edznwctleisw.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31: 316i, 320i, 328i, 330i)",
      "BMW 4 Series (F32, F36: 420i, 428i, 430i)"
    ],
    specs: [
      { key: "Manufacturer", value: "Nissens Cooling Denmark" },
      { key: "OEM Part Number", value: "17 11 7 600 520 / 17 11 8 672 107" },
      { key: "Core Material", value: "Brazed Aluminum Core" },
      { key: "Condition", value: "Brand New Genuine" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Front Gas-Pressure Shock Absorber Pair (طقم مساعدين أماميين غاز هيدروليك)",
    sku: "31316791551",
    categorySlug: "suspension",
    brand: "Sachs",
    model: "BMW 3 / 4 Series (F30 Sedan, F32 Coupe)",
    price: 13500,
    stock: 30,
    minimumStock: 2,
    shortDescription: "زوج ممتصات صدمات أمامية هيدروليكية غازية لتأمين ثبات السيارة وامتصاص اهتزازات الطرق.",
    description: "طقم مساعدين أماميين أصليين Sachs Super Touring مطابقين لمواصفات بي إم دابليو الهندسية. يوفران راحة فائقة في القيادة وثباتاً استثنائياً في المناورات والمنعطفات.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834632/boo-automotive/parts/lapladiu781fjhpqzcvi.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30 Sedan: 316i, 320i, 328i, 330i)",
      "BMW 4 Series (F32 Coupe: 420i, 428i, 430i)"
    ],
    specs: [
      { key: "Brand / Model", value: "Sachs Super Touring (Twin-Tube Gas)" },
      { key: "OEM Part Numbers", value: "Left: 31 31 6 791 551 / Right: 31 31 6 791 552" },
      { key: "Position", value: "Front Left + Right Pair" },
      { key: "Condition", value: "Brand New Genuine OEM (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Rear Gas Shock Absorbers Pair (طقم مساعدين خلفيين)",
    sku: "33526791577",
    categorySlug: "suspension",
    brand: "Sachs",
    model: "BMW 3 / 4 Series (F30, F32)",
    price: 7800,
    stock: 30,
    minimumStock: 2,
    shortDescription: "زوج ممتصات صدمات خلفية غازية لتحقيق استقرار مؤخرة السيارة وتقليل تمايل الهيكل.",
    description: "مساعدين خلفيين أصليين من Sachs يضمنان تماسك العجلات الخلفية مع الطريق أثناء السرعات العالية وتقليل إجهاد الشاسيه على الطرق غير الممهدة.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834589/boo-automotive/parts/ptkrno4edeegpw38uemb.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31, F35: 320i, 328i)",
      "BMW 4 Series (F32, F36: 420i, 428i)"
    ],
    specs: [
      { key: "Brand", value: "Sachs Germany" },
      { key: "OEM Part Number", value: "33 52 6 791 577" },
      { key: "Position", value: "Rear Axle Pair" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Front Lower Control Arms with Hydro-Bushings Pair (طقم مقصات أمامية سفلية بالجلب والبيض)",
    sku: "31126852991",
    categorySlug: "suspension",
    brand: "Lemförder",
    model: "BMW 3 / 4 Series (F30, F32, F36)",
    price: 9800,
    stock: 30,
    minimumStock: 2,
    shortDescription: "زوج مقصات سفلية مزودة بجلب هيدروليكية وبيض توجيه لضبط زوايا العفشة وتفادي الرعشة.",
    description: "مقصات أمامية سفلية أصلية مصنعة من ألومنيوم مطروق عالي المتانة من Lemförder مزودة بجلب زيتية ممتصة للاهتزازات، تعيد دقة التوجيه وزوايا العجلات لوضع المصنع.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834542/boo-automotive/parts/fnvdattrrqvonlnm59sm.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30, F31: 320i, 328i, 330i)",
      "BMW 4 Series (F32, F36: 420i, 428i, 430i)"
    ],
    specs: [
      { key: "Brand / Manufacturer", value: "Lemförder Germany (ZF Group)" },
      { key: "OEM Part Numbers", value: "Left: 31 12 6 852 991 / Right: 31 12 6 852 992" },
      { key: "Material", value: "Forged Aircraft-Grade Aluminum" },
      { key: "Condition", value: "Brand New OEM Pair" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Front Sway Bar Stabilizer End Links (طقم تياش ميزان أمامي يمين وشمال)",
    sku: "31306792211",
    categorySlug: "suspension",
    brand: "Febi Bilstein",
    model: "BMW 1 / 2 / 3 / 4 Series (F20, F22, F30, F32)",
    price: 1800,
    stock: 30,
    minimumStock: 4,
    shortDescription: "وصلات توازن مفصلية تربط المساعد بعمود الاتزان لمنع انقلاب الهيكل والميلان في الملفات.",
    description: "طقم تياش ميزان أمامي ألماني أصلي من Febi Bilstein بمفاصل كروية محكمة الإغلاق ومقاومة للأتربة، يمنع أصوات الطقطقة ويزيد من ثبات السيارة في المنحنيات.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834497/boo-automotive/parts/mqlt94fllkflsmsfxkzi.jpg", isMain: true }],
    compatibility: [
      "BMW 1 Series (F20, F21)",
      "BMW 2 Series (F22, F23)",
      "BMW 3 Series (F30, F31, F34)",
      "BMW 4 Series (F32, F36)"
    ],
    specs: [
      { key: "Brand", value: "Febi Bilstein Germany" },
      { key: "OEM Part Number", value: "31 30 6 792 211 / 31 30 6 792 212" },
      { key: "Position", value: "Front Stabilizer Link Pair" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Hydraulic Engine Mounts Pair (طقم قواعد محرك هيدروليكية زيتية يمين وشمال)",
    sku: "22116855456",
    categorySlug: "engine",
    brand: "Corteco",
    model: "BMW 3 / 4 Series (F30 320i, 328i N20 Engine)",
    price: 6800,
    stock: 30,
    minimumStock: 2,
    shortDescription: "قواعد محرك زيتية تعمل على تثبيت كتلة المحرك وعزل الاهتزازات تماماً عن المقصورة.",
    description: "طقم قواعد محرك هيدروليكية أصلية من Corteco ممتلئة بزيت خاص لامتصاص ارتعاشات المحرك في وضع السلانسيه ومنع وصول أي اهتزازات لعجلة القيادة.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834449/boo-automotive/parts/ihzk4uwwbkkxkkfbfi5o.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20 Engine)",
      "BMW 4 Series (F32: 420i, 428i)"
    ],
    specs: [
      { key: "Brand", value: "Corteco Germany (Hydro-Mounts)" },
      { key: "OEM Part Numbers", value: "Left: 22 11 6 855 456 / Right: 22 11 6 855 457" },
      { key: "Type", value: "Hydraulic Fluid-Damped Engine Mounts" },
      { key: "Condition", value: "Brand New OEM Pair" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Automatic Transmission Oil Pan with Integrated Filter (كارتيرة زيت الفتيس بالفلتر والجوان وطبة التفريغ)",
    sku: "24117624192",
    categorySlug: "engine",
    brand: "ZF",
    model: "BMW ZF 8HP Automatic (F30, G20, F10, G30, X3, X5)",
    price: 5200,
    stock: 30,
    minimumStock: 3,
    shortDescription: "كارتيرة فتيس أوتوماتيك أصلية مدمج بها فلتر داخلي ومغناطيس تجميع الرايش مع جوان وطبة.",
    description: "طقم كارتيرة فتيس أصلي من مصنع ZF الألماني الخاص بناقل الحركة 8 سرعات ZF 8HP. متضمنة الفلتر الداخلي المدمج، الجوان الأصلي، طقم المسامير، وطبة الملء.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834404/boo-automotive/parts/zliv74fe2zvmi3ms2m62.jpg", isMain: true }],
    compatibility: [
      "All BMW Models with ZF 8HP Transmission:",
      "BMW 3 Series (F30, G20: 320i, 328i, 330i)",
      "BMW 5 Series (F10, G30: 520i, 528i, 530i)",
      "BMW X3 (F25, G01)",
      "BMW X5 (F15, G05)"
    ],
    specs: [
      { key: "Manufacturer", value: "ZF Friedrichshafen AG Germany" },
      { key: "OEM Part Number", value: "24 11 7 624 192 / 24 11 8 612 901" },
      { key: "Transmission Type", value: "ZF 8HP45 / 8HP50 / 8HP70 / 8HP75" },
      { key: "Kit Includes", value: "Pan + Integrated Filter + Gasket + Screws + Plug" },
      { key: "Condition", value: "Brand New Genuine ZF Kit (100% أصلي)" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "In-Tank Electric Fuel Pump with Level Sender Assembly (طرمبة بنزين غطاس كاملة بالعوامة وفلتر الشفط)",
    sku: "16117243975",
    categorySlug: "engine",
    brand: "Continental",
    model: "BMW 1 / 2 / 3 Series (F20, F22, F30: 316i, 320i, 328i)",
    price: 8900,
    stock: 30,
    minimumStock: 2,
    shortDescription: "وحدة ضخ وقود غاطسة بالتانك كاملة بالعوامة وفلتر الشفط لضمان تدفق بنزين بضغط ثابت.",
    description: "طرمبة بنزين غطاس أصلية من Continental VDO الألمانية، توفر ضغط وقود ثابت 5.5 بار إلى طلمبة الضغط العالي وتتضمن عوامة مستوى البنزين الدقيقة.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834346/boo-automotive/parts/szcd7rvyesfwfenjn5i9.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 316i, 320i, 328i, 335i)",
      "BMW 1 Series (F20, F21)",
      "BMW 2 Series (F22, F23)"
    ],
    specs: [
      { key: "Brand", value: "Continental VDO Germany" },
      { key: "OEM Part Number", value: "16 11 7 243 975 / 16 11 7 297 778" },
      { key: "Operating Pressure", value: "5.5 Bar Constant Output" },
      { key: "Condition", value: "Brand New Genuine" }
    ],
    isActive: true,
    featured: true
  },
  {
    name: "Serpentine Accessory Drive Belt 6PK1000 (سير مجموعة المحرك الأصلي EPDM)",
    sku: "11287618848",
    categorySlug: "engine",
    brand: "Continental",
    model: "BMW 3 / 5 Series / X3 (N20 Engine)",
    price: 850,
    stock: 30,
    minimumStock: 5,
    shortDescription: "سير مجموعة أصلي متعدد الممرات مقاوم للحرارة والتشقق لنقل الحركة إلى الدينامو وطرمبة التكييف.",
    description: "سير دينامو ومجموعة أصلي Continental ContiTech 6PK1000 مصنع من مطاط EPDM المقوى بألياف الأراميد لمنع الصفير والتمدد تحت الأحمال الثقيلة.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834252/boo-automotive/parts/yetvvrvofddg55qv0eln.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20)",
      "BMW 5 Series (F10: 520i, 528i)",
      "BMW X3 (F25 20i, 28i)"
    ],
    specs: [
      { key: "Brand", value: "Continental ContiTech Germany" },
      { key: "OEM Part Number", value: "11 28 7 618 848 (6PK1000)" },
      { key: "Material", value: "EPDM High-Temperature Resistant Rubber" },
      { key: "Condition", value: "Brand New" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Drive Belt Tensioner with Pulley Assembly (شداد سير المجموعة بالبكرة الهيدروليكية)",
    sku: "11287594969",
    categorySlug: "engine",
    brand: "INA",
    model: "BMW 3 / 5 Series / X1 / X3 (N20 Engine)",
    price: 2750,
    stock: 30,
    minimumStock: 3,
    shortDescription: "شداد أوتوماتيكي لسير المجموعة مع بكرة التوجيه للحفاظ على شد مثالي وتفادي انقطاع السير.",
    description: "شداد سير مجموعة ألماني أصلي من INA Schaeffler مزود بسوستة هيدروليكية تعوض التمدد اللحظي وتمنع اهتزاز السير وتلف الدينامو أو كمبروسر التكييف.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834199/boo-automotive/parts/ez1jjyalbqeu8qq858cf.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30 320i, 328i N20)",
      "BMW 5 Series (F10 520i, 528i)",
      "BMW X1 (E84 xDrive28i)",
      "BMW X3 (F25 20i, 28i)"
    ],
    specs: [
      { key: "Manufacturer", value: "INA Schaeffler Germany" },
      { key: "OEM Part Number", value: "11 28 7 594 969 / 11 28 8 624 196" },
      { key: "Condition", value: "Brand New OEM" }
    ],
    isActive: true,
    featured: false
  },
  {
    name: "Valve Cover Gasket Set with Spark Plug Tube Seals (طقم جوان غطاء التاكيهات بالجوانات الداخلية)",
    sku: "11127588418",
    categorySlug: "engine",
    brand: "Elring",
    model: "BMW 3 / 4 / 5 Series / X3 (N20 / N26 Engine)",
    price: 1650,
    stock: 30,
    minimumStock: 4,
    shortDescription: "طقم جوانات غطاء الصمامات والتاكيهات لمنع تسريب الزيت إلى البوجيهات والعادم.",
    description: "طقم جوان غطاء تاكيهات ألماني أصلي من Elring Das Original مصنع من مطاط الفايتون (Viton) الحراري، يحل مشكلة تسريب زيت المحرك الشائعة فوق فرن الشكمان وحول البوجيهات.",
    images: [{ url: "https://res.cloudinary.com/dkiecibqs/image/upload/v1788834108/boo-automotive/parts/f27fwcux8gc6yh088ejy.jpg", isMain: true }],
    compatibility: [
      "BMW 3 Series (F30: 320i, 328i N20/N26 Engine)",
      "BMW 5 Series (F10: 520i, 528i)",
      "BMW 4 Series (F32: 420i, 428i)",
      "BMW X3 (F25 20i, 28i)"
    ],
    specs: [
      { key: "Brand", value: "Elring Das Original Germany" },
      { key: "OEM Part Number", value: "11 12 7 588 418" },
      { key: "Material", value: "Fluoroelastomer / Viton High-Temp Rubber" },
      { key: "Includes", value: "Perimeter Gasket + 4 Spark Plug Tube Seals" },
      { key: "Condition", value: "Brand New Genuine" }
    ],
    isActive: true,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/boo_automotive';
    const fallbackUri = 'mongodb://127.0.0.1:27017/boo_automotive';

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Seeder] Connected to database: ${mongoUri}`);
    } catch (e) {
      console.warn(`[Seeder] Primary URI connection timed out (${e.message}). Connecting to local MongoDB...`);
      await mongoose.connect(fallbackUri);
      console.log(`[Seeder] Connected to local fallback: ${fallbackUri}`);
    }

    // Upsert Super Admin User
    const existingAdmin = await AdminUser.findOne({ email: 'admin@boo.com' });
    if (!existingAdmin) {
      await AdminUser.create({
        name: 'BOO Master Admin',
        email: 'admin@boo.com',
        password: 'Admin@123456',
        role: 'superadmin',
        isActive: true
      });
      console.log('[Seeder] Created Admin User: admin@boo.com (Password: Admin@123456)');
    } else {
      existingAdmin.password = 'Admin@123456';
      await existingAdmin.save();
      console.log('[Seeder] Verified Admin User: admin@boo.com');
    }

    // Upsert Hero Slides
    const heroCount = await HeroSlide.countDocuments();
    if (heroCount === 0) {
      await HeroSlide.create([
        {
          title: 'Import Your Dream Car',
          badge: 'Global Sourcing & Import',
          description: 'Reliable vehicle sourcing and professional car import services tailored to your exact specifications and budget.',
          ctaText: 'Explore Cars',
          ctaLink: '/cars',
          secondaryCtaText: 'Import Consultation',
          secondaryCtaLink: '/contact?type=import',
          order: 1,
          isActive: true,
          image: {
            url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85',
            publicId: 'hero_1'
          }
        },
        {
          title: '100% Genuine OEM Spare Parts',
          badge: 'E-Commerce Online Store',
          description: 'Extensive inventory of original replacement parts, maintenance consumables and performance upgrades delivered to your doorstep.',
          ctaText: 'Shop Spare Parts',
          ctaLink: '/spare-parts',
          secondaryCtaText: 'Track Order',
          secondaryCtaLink: '/spare-parts#orders',
          order: 2,
          isActive: true,
          image: {
            url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2000&q=85',
            publicId: 'hero_2'
          }
        }
      ]);
      console.log('[Seeder] Seeded Hero Slides');
    }

    // Upsert Spare Part & Accessory Categories
    const defaultCategories = [
      { name: 'Brake Parts', slug: 'brake', icon: 'Disc', order: 1, isActive: true },
      { name: 'Filters', slug: 'filters', icon: 'Filter', order: 2, isActive: true },
      { name: 'Engine Parts', slug: 'engine', icon: 'Cpu', order: 3, isActive: true },
      { name: 'Electrical', slug: 'electrical', icon: 'Zap', order: 4, isActive: true },
      { name: 'Suspension', slug: 'suspension', icon: 'Sliders', order: 5, isActive: true },
      { name: 'Car Accessories', slug: 'accessories', icon: 'Package', order: 6, isActive: true }
    ];

    const catMap = {};
    for (const catData of defaultCategories) {
      const cat = await Category.findOneAndUpdate(
        { slug: catData.slug },
        { $set: catData },
        { upsert: true, new: true }
      );
      catMap[cat.slug] = cat._id;
    }
    console.log('[Seeder] Verified/Upserted Categories');

    // Safe Upsert of the 25 Authentic BMW Products by SKU
    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of BMW_25_SPARE_PARTS) {
      const categoryId = catMap[item.categorySlug] || null;
      const partPayload = {
        name: item.name,
        sku: item.sku,
        category: categoryId,
        categorySlug: item.categorySlug,
        brand: item.brand,
        model: item.model,
        price: item.price,
        stock: item.stock,
        minimumStock: item.minimumStock,
        shortDescription: item.shortDescription,
        description: item.description,
        images: item.images || [],
        compatibility: item.compatibility,
        specs: item.specs,
        isActive: item.isActive,
        featured: item.featured
      };

      const result = await SparePart.findOneAndUpdate(
        { sku: item.sku.toUpperCase() },
        { $set: partPayload },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    }

    const validSkus = BMW_25_SPARE_PARTS.map(p => p.sku.toUpperCase());
    await SparePart.deleteMany({ sku: { $nin: validSkus } });

    console.log(`[Seeder] Seeded 25 BMW Spare Parts: ${insertedCount} inserted, ${updatedCount} updated (Stock = 30 for all).`);

    // Accessories module ready for Admin Dashboard entries
    console.log('[Seeder] Accessories module ready (Admin will add custom accessories via Dashboard).');

    // Ensure Services exist
    const serviceCount = await MaintenanceService.countDocuments();
    if (serviceCount === 0) {
      await MaintenanceService.create([
        {
          title: 'Periodic Maintenance',
          slug: 'periodic-maintenance',
          description: 'Scheduled servicing including engine synthetic oil, multi-point safety inspection, and fluid checks according to manufacturer guidelines.',
          price: 1200,
          duration: '1 - 2 Hours',
          icon: 'CalendarCheck',
          checklist: ['Synthetic oil & OEM filter', 'Brake & tyre depth assessment', 'Battery health test', 'Suspension inspection'],
          order: 1,
          isActive: true
        }
      ]);
      console.log('[Seeder] Seeded Maintenance Services');
    }

    console.log('[Seeder] Database synchronization completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
