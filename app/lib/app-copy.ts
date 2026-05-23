// All translatable UI strings in one place.
// Built-in translations for the 5 supported languages;
// everything else is fetched from /api/translate and cached in localStorage.

export interface AppCopy {
  loading: { title: string; sub: string; steps: string[] };
  results: { title: string; restart: string };
  card: { address: string; hours: string; access: string };
  chat: { placeholder: string; send: string; heading: string; unverified: string };
  form: {
    back: string;
    heading: string;
    sub: string;
    suburbLabel: string;
    useLocation: string;
    locating: string;
    needLabel: string;
    needHint: string;
    demoLabel: string;
    demoHint: string;
    submit: string;
    meta: string;
    detected: string; // e.g. "FR detected" — insert the lang badge label before this
  };
  groups: {
    heading: string;
    addYours: string;
    empty: string;
    beFirst: string;
    when: string;
    where: string;
    phone: string;
    email: string;
    web: string;
    submitHeading: string;
    submitSub: string;
    submitBtn: string;
    submitting: string;
    successHeading: string;
    successSub: string;
    backToNearby: string;
    listedImmediately: string;
  };
}

export const BUILT_IN: Record<string, AppCopy> = {
  en: {
    loading: {
      title: "Walking the neighbourhood…",
      sub: "Cross-checking what's open, who's running it, and how to get in the door.",
      steps: ["Reading your area", "Matching to programs", "Checking hours & access", "Translating reply"],
    },
    results: { title: "Three places, close to home.", restart: "↺ New search" },
    card: { address: "Address", hours: "Hours", access: "Access" },
    chat: {
      placeholder: "Ask a follow-up about any of these services…",
      send: "Send",
      heading: "Ask more",
      unverified: "Unverified — call ahead to confirm",
    },
    form: {
      back: "Back",
      heading: "Tell us a little about your day.",
      sub: "Two questions and one dropdown. That's it.",
      suburbLabel: "Where do you live?",
      useLocation: "Use my location",
      locating: "Locating…",
      needLabel: "What do you need?",
      needHint: "Be as specific or as vague as you like — type or dictate in any language.",
      demoLabel: "Which best describes you?",
      demoHint: "Helps Nearby tailor suggestions — pricing, language support, accessibility.",
      submit: "Find nearby",
      meta: "3 suggestions · ~10 sec",
      detected: "detected",
    },
    groups: {
      heading: "Community groups",
      addYours: "+ Add yours",
      empty: "No groups listed here yet.",
      beFirst: "Be the first to add one.",
      when: "When",
      where: "Where",
      phone: "Phone",
      email: "Email",
      web: "Web",
      submitHeading: "Share your group.",
      submitSub: "List a social group, club, or community gathering so others nearby can find it.",
      submitBtn: "Submit group",
      submitting: "Submitting…",
      successHeading: "Group listed.",
      successSub: "is now visible to anyone searching",
      backToNearby: "Back to Nearby",
      listedImmediately: "Listed immediately · free",
    },
  },
  zh: {
    loading: {
      title: "正在走访社区…",
      sub: "正在确认开放时间、负责人以及如何参与。",
      steps: ["了解您的区域", "匹配相关项目", "核对时间与门槛", "整理回复"],
    },
    results: { title: "三个就在附近的去处。", restart: "↺ 重新搜索" },
    card: { address: "地址", hours: "开放时间", access: "如何参与" },
    chat: { placeholder: "对以上任何服务提问…", send: "发送", heading: "继续提问", unverified: "未经核实 — 请致电确认" },
    form: {
      back: "返回",
      heading: "告诉我们您今天的情况。",
      sub: "两个问题和一个下拉菜单。就这些。",
      suburbLabel: "您住在哪里？",
      useLocation: "使用我的位置",
      locating: "定位中…",
      needLabel: "您需要什么？",
      needHint: "尽量具体或模糊都可以——用任何语言输入或口述。",
      demoLabel: "哪个最能描述您？",
      demoHint: "帮助 Nearby 定制建议——价格、语言支持、无障碍。",
      submit: "附近查找",
      meta: "3 条建议 · 约 10 秒",
      detected: "已检测到",
    },
    groups: {
      heading: "社区团体",
      addYours: "+ 添加您的团体",
      empty: "这里还没有团体。",
      beFirst: "成为第一个添加的人。",
      when: "时间",
      where: "地点",
      phone: "电话",
      email: "邮件",
      web: "网站",
      submitHeading: "分享您的团体。",
      submitSub: "列出社交团体、俱乐部或社区聚会，让附近的人找到。",
      submitBtn: "提交团体",
      submitting: "提交中…",
      successHeading: "团体已列出。",
      successSub: "现在对搜索的人可见",
      backToNearby: "返回 Nearby",
      listedImmediately: "立即列出 · 免费",
    },
  },
  ar: {
    loading: {
      title: "نتجوّل في الحي…",
      sub: "نتأكد من أوقات العمل، والجهة المسؤولة، وكيفية الوصول.",
      steps: ["قراءة منطقتك", "مطابقة البرامج", "التحقق من الأوقات", "ترجمة الرد"],
    },
    results: { title: "ثلاثة أماكن قريبة منك.", restart: "↺ بحث جديد" },
    card: { address: "العنوان", hours: "ساعات العمل", access: "كيفية الوصول" },
    chat: { placeholder: "اطرح سؤالاً حول أي من هذه الخدمات…", send: "إرسال", heading: "اسأل أكثر", unverified: "غير مؤكد — اتصل للتأكيد" },
    form: {
      back: "رجوع",
      heading: "أخبرنا قليلاً عن يومك.",
      sub: "سؤالان وقائمة منسدلة واحدة. هذا كل شيء.",
      suburbLabel: "أين تسكن؟",
      useLocation: "استخدم موقعي",
      locating: "جارٍ التحديد…",
      needLabel: "ماذا تحتاج؟",
      needHint: "كن محدداً أو مبهماً كما تشاء — اكتب أو تحدث بأي لغة.",
      demoLabel: "أيٌّ من هذه الأوصاف ينطبق عليك؟",
      demoHint: "يساعد Nearby على تخصيص الاقتراحات — الأسعار ودعم اللغة وإمكانية الوصول.",
      submit: "ابحث بالقرب",
      meta: "3 اقتراحات · ~10 ثوانٍ",
      detected: "تم اكتشافه",
    },
    groups: {
      heading: "المجموعات المجتمعية",
      addYours: "+ أضف مجموعتك",
      empty: "لا توجد مجموعات مدرجة هنا بعد.",
      beFirst: "كن أول من يضيف واحدة.",
      when: "متى",
      where: "أين",
      phone: "هاتف",
      email: "بريد",
      web: "موقع",
      submitHeading: "شارك مجموعتك.",
      submitSub: "أدرج مجموعة اجتماعية أو نادياً أو تجمعاً مجتمعياً حتى يجده الآخرون.",
      submitBtn: "إرسال المجموعة",
      submitting: "جارٍ الإرسال…",
      successHeading: "تم إدراج المجموعة.",
      successSub: "مرئية الآن لمن يبحث في",
      backToNearby: "العودة إلى Nearby",
      listedImmediately: "مدرجة فوراً · مجاناً",
    },
  },
  vi: {
    loading: {
      title: "Đang đi quanh khu phố…",
      sub: "Đang kiểm tra giờ mở cửa, người phụ trách, và cách tham gia.",
      steps: ["Đọc khu vực của bạn", "Khớp với chương trình", "Kiểm tra giờ & cách tham gia", "Dịch phản hồi"],
    },
    results: { title: "Ba địa điểm gần nhà bạn.", restart: "↺ Tìm lại" },
    card: { address: "Địa chỉ", hours: "Giờ mở cửa", access: "Cách tham gia" },
    chat: { placeholder: "Đặt câu hỏi về bất kỳ dịch vụ nào…", send: "Gửi", heading: "Hỏi thêm", unverified: "Chưa xác minh — gọi trước để xác nhận" },
    form: {
      back: "Quay lại",
      heading: "Cho chúng tôi biết một chút về ngày của bạn.",
      sub: "Hai câu hỏi và một menu thả xuống. Vậy thôi.",
      suburbLabel: "Bạn sống ở đâu?",
      useLocation: "Dùng vị trí của tôi",
      locating: "Đang định vị…",
      needLabel: "Bạn cần gì?",
      needHint: "Cụ thể hay mơ hồ đều được — gõ hoặc đọc bằng bất kỳ ngôn ngữ nào.",
      demoLabel: "Điều nào mô tả bạn nhất?",
      demoHint: "Giúp Nearby điều chỉnh gợi ý — giá cả, hỗ trợ ngôn ngữ, khả năng tiếp cận.",
      submit: "Tìm gần đây",
      meta: "3 gợi ý · ~10 giây",
      detected: "đã phát hiện",
    },
    groups: {
      heading: "Nhóm cộng đồng",
      addYours: "+ Thêm nhóm của bạn",
      empty: "Chưa có nhóm nào được liệt kê.",
      beFirst: "Hãy là người đầu tiên thêm.",
      when: "Khi nào",
      where: "Ở đâu",
      phone: "Điện thoại",
      email: "Email",
      web: "Web",
      submitHeading: "Chia sẻ nhóm của bạn.",
      submitSub: "Liệt kê một nhóm xã hội, câu lạc bộ để người khác gần đó tìm thấy.",
      submitBtn: "Gửi nhóm",
      submitting: "Đang gửi…",
      successHeading: "Nhóm đã được liệt kê.",
      successSub: "hiện có thể tìm thấy khi tìm kiếm tại",
      backToNearby: "Quay lại Nearby",
      listedImmediately: "Liệt kê ngay · miễn phí",
    },
  },
  id: {
    loading: {
      title: "Menjelajahi lingkungan…",
      sub: "Memeriksa jam buka, pengelola, dan cara masuk.",
      steps: ["Membaca area Anda", "Mencocokkan program", "Memeriksa jam & akses", "Menerjemahkan balasan"],
    },
    results: { title: "Tiga tempat, dekat dari rumah.", restart: "↺ Cari ulang" },
    card: { address: "Alamat", hours: "Jam buka", access: "Cara masuk" },
    chat: { placeholder: "Tanyakan lebih lanjut tentang layanan ini…", send: "Kirim", heading: "Tanya lebih lanjut", unverified: "Belum diverifikasi — hubungi untuk konfirmasi" },
    form: {
      back: "Kembali",
      heading: "Ceritakan sedikit tentang hari Anda.",
      sub: "Dua pertanyaan dan satu dropdown. Itu saja.",
      suburbLabel: "Di mana Anda tinggal?",
      useLocation: "Gunakan lokasi saya",
      locating: "Mencari lokasi…",
      needLabel: "Apa yang Anda butuhkan?",
      needHint: "Spesifik atau umum sama saja — ketik atau dikte dalam bahasa apa pun.",
      demoLabel: "Mana yang paling menggambarkan Anda?",
      demoHint: "Membantu Nearby menyesuaikan saran — harga, dukungan bahasa, aksesibilitas.",
      submit: "Temukan terdekat",
      meta: "3 saran · ~10 detik",
      detected: "terdeteksi",
    },
    groups: {
      heading: "Kelompok komunitas",
      addYours: "+ Tambahkan milik Anda",
      empty: "Belum ada kelompok terdaftar.",
      beFirst: "Jadilah yang pertama menambahkan.",
      when: "Kapan",
      where: "Di mana",
      phone: "Telepon",
      email: "Email",
      web: "Web",
      submitHeading: "Bagikan kelompok Anda.",
      submitSub: "Daftarkan kelompok sosial, klub, atau pertemuan komunitas agar orang lain dapat menemukannya.",
      submitBtn: "Kirim kelompok",
      submitting: "Mengirim…",
      successHeading: "Kelompok terdaftar.",
      successSub: "kini terlihat oleh siapa pun yang mencari di",
      backToNearby: "Kembali ke Nearby",
      listedImmediately: "Terdaftar segera · gratis",
    },
  },
};

// Languages whose text direction is RTL
export const RTL_LANGS = new Set(["ar", "he", "fa", "ur", "ps"]);

export function isRtlLang(lang: string) {
  return RTL_LANGS.has(lang.toLowerCase().split("-")[0]);
}
