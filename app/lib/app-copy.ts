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
    suburbPlaceholder: string;
    useLocation: string;
    locating: string;
    needLabel: string;
    needPlaceholder: string;
    needHint: string;
    demoLabel: string;
    demoHint: string;
    demographics: {
      none: string;
      student: string;
      elderly: string;
      newArrival: string;
      family: string;
      other: string;
    };
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
  landing: {
    eyebrow: string;
    heading: string;    // main heading text (first part)
    headingEm: string;  // emphasized teal-italic word(s) at end
    sub: string;
    cta: string;
    howItWorks: string;
    shareGroup: string;
    forLabel: string;
    forText: string;
    acrossLabel: string;
    acrossText: string;
    languageLabel: string;
    builtWithLabel: string;
    builtWithText: string;
    openNowLabel: string;
    showLess: string;
    browseAll: string; // "{n}" is replaced with count in code
  };
  howItWorks: {
    back: string;
    eyebrow: string;
    heading: string;
    sub: string;
    coversHeading: string;
    getStarted: string;
    backToHome: string;
    steps: { title: string; body: string }[];
    categories: { icon: string; label: string; sub: string }[];
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
      suburbPlaceholder: "e.g. Carlton, North Melbourne, Kensington",
      useLocation: "Use my location",
      locating: "Locating…",
      needLabel: "What do you need?",
      needPlaceholder: "e.g. somewhere to grow vegetables, free meals this week, help repairing a bike, a quiet place to study, somewhere to volunteer on weekends",
      needHint: "Be as specific or as vague as you like — type or dictate in any language.",
      demoLabel: "Which best describes you?",
      demoHint: "Helps Nearby tailor suggestions — pricing, language support, accessibility.",
      demographics: {
        none: "Prefer not to say",
        student: "International student",
        elderly: "Elderly resident",
        newArrival: "New arrival to Australia",
        family: "Local family",
        other: "Other",
      },
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
    landing: {
      eyebrow: "A community connector",
      heading: "Find what you need,",
      headingEm: "nearby.",
      sub: "A quiet way to discover the gardens, kitchens, libraries and repair benches already running in your council — and the people behind them.",
      cta: "Get started",
      howItWorks: "How it works",
      shareGroup: "Add your own events",
      forLabel: "For",
      forText: "Residents, students, new arrivals — anyone looking for a hand or wanting to give one.",
      acrossLabel: "Across",
      acrossText: "City of Melbourne — community gardens, food relief, libraries, repair cafés, grants.",
      languageLabel: "Language",
      builtWithLabel: "Built with",
      builtWithText: "Real addresses, real hours. No directory dumps, no signups.",
      openNowLabel: "Open right now",
      showLess: "Show less",
      browseAll: "Browse all {n} →",
    },
    howItWorks: {
      back: "Back",
      eyebrow: "A community connector",
      heading: "How it works",
      sub: "Nearby helps you find community resources in your area — no accounts, no sign-ups, no directory dumps.",
      coversHeading: "What Nearby covers",
      getStarted: "Get started",
      backToHome: "Back to home",
      steps: [
        { title: "Tell us your suburb", body: "Type your suburb or use your device's location. Nearby focuses on the City of Melbourne council area — Carlton, North Melbourne, Docklands, Southbank, Fitzroy, and more." },
        { title: "Describe what you need", body: "Use plain language — \"somewhere to grow vegetables\", \"free meals this week\", \"help fixing my bike\", \"a quiet place to study\". No categories, no checkboxes." },
        { title: "Optionally tell us about yourself", body: "If you're a student, a new arrival, an older resident or a family, let us know. Nearby uses that context to tailor recommendations — mentioning free options, language support, or kid-friendly times." },
        { title: "Get three specific places", body: "Nearby returns three real services with real addresses, opening hours, and how to get in the door. No sign-up required, no referral letter needed." },
        { title: "Ask follow-up questions", body: "Once you have results, use the chat at the bottom to ask more — \"Is there parking nearby?\", \"What do I need to bring?\", \"Are there other options on weekends?\"" },
      ],
      categories: [
        { icon: "🌱", label: "Community gardens", sub: "Plots, working bees, compost" },
        { icon: "🍲", label: "Food relief", sub: "Free meals, food pantries" },
        { icon: "📚", label: "Libraries", sub: "Study spaces, programs" },
        { icon: "🔧", label: "Repair cafés", sub: "Bikes, clothes, electronics" },
        { icon: "💰", label: "Council grants", sub: "Community project funding" },
        { icon: "🤝", label: "Volunteering", sub: "Local opportunities" },
      ],
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
      suburbPlaceholder: "例如 Carlton, North Melbourne, Kensington",
      useLocation: "使用我的位置",
      locating: "定位中…",
      needLabel: "您需要什么？",
      needPlaceholder: "例如 种植蔬菜的地方、本周免费餐食、协助修理自行车、安静的学习场所、周末志愿服务",
      needHint: "尽量具体或模糊都可以——用任何语言输入或口述。",
      demoLabel: "哪个最能描述您？",
      demoHint: "帮助 Nearby 定制建议——价格、语言支持、无障碍。",
      demographics: {
        none: "不便透露",
        student: "国际学生",
        elderly: "老年居民",
        newArrival: "澳洲新移民",
        family: "本地家庭",
        other: "其他",
      },
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
    landing: {
      eyebrow: "社区连接器",
      heading: "找到您所需要的，",
      headingEm: "就在附近。",
      sub: "以悄然的方式发现您所在议会中已有的花园、厨房、图书馆和维修工作坊——以及背后的人们。",
      cta: "开始",
      howItWorks: "运作方式",
      shareGroup: "添加活动",
      forLabel: "适用于",
      forText: "居民、学生、新来者——任何寻求帮助或愿意提供帮助的人。",
      acrossLabel: "覆盖",
      acrossText: "墨尔本市——社区花园、食品救济、图书馆、维修咖啡馆、资助。",
      languageLabel: "语言",
      builtWithLabel: "建立于",
      builtWithText: "真实地址，真实开放时间。无目录，无需注册。",
      openNowLabel: "现在开放",
      showLess: "收起",
      browseAll: "查看全部 {n} →",
    },
    howItWorks: {
      back: "返回",
      eyebrow: "社区连接器",
      heading: "运作方式",
      sub: "Nearby 帮助您找到附近的社区资源——无需账户、无需注册、无目录。",
      coversHeading: "Nearby 涵盖的内容",
      getStarted: "开始",
      backToHome: "返回首页",
      steps: [
        { title: "告诉我们您的区域", body: "输入您的区域或使用设备定位。Nearby 专注于墨尔本市议会区域——Carlton、North Melbourne、Docklands、Southbank、Fitzroy 等。" },
        { title: "描述您的需求", body: "用日常语言——\"想种蔬菜的地方\"、\"本周免费餐食\"、\"修自行车\"、\"安静的学习地点\"。无需选类别或勾选框。" },
        { title: "可选：告诉我们您的情况", body: "如果您是学生、新来者、老年居民或家庭，请告知我们。Nearby 会据此调整建议——免费选项、语言支持或适合儿童的时间。" },
        { title: "获得三个具体地点", body: "Nearby 返回三个真实服务，包含真实地址、开放时间以及如何进入。无需注册，无需推荐信。" },
        { title: "提出后续问题", body: "获得结果后，可使用底部聊天框继续提问——\"附近有停车位吗？\"、\"需要带什么？\"、\"周末有其他选择吗？\"" },
      ],
      categories: [
        { icon: "🌱", label: "社区花园", sub: "地块、工作蜂、堆肥" },
        { icon: "🍲", label: "食品救济", sub: "免费餐食、食物储藏室" },
        { icon: "📚", label: "图书馆", sub: "学习空间、项目" },
        { icon: "🔧", label: "维修咖啡馆", sub: "自行车、衣物、电子产品" },
        { icon: "💰", label: "议会资助", sub: "社区项目资金" },
        { icon: "🤝", label: "志愿服务", sub: "本地机会" },
      ],
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
      suburbPlaceholder: "مثال: كارلتون، شمال ملبورن، كينسينغتون",
      useLocation: "استخدم موقعي",
      locating: "جارٍ التحديد…",
      needLabel: "ماذا تحتاج؟",
      needPlaceholder: "مثال: مكان لزراعة الخضار، وجبات مجانية هذا الأسبوع، مساعدة في إصلاح دراجة، مكان هادئ للدراسة، مكان للتطوع في عطلة نهاية الأسبوع",
      needHint: "كن محدداً أو مبهماً كما تشاء — اكتب أو تحدث بأي لغة.",
      demoLabel: "أيٌّ من هذه الأوصاف ينطبق عليك؟",
      demoHint: "يساعد Nearby على تخصيص الاقتراحات — الأسعار ودعم اللغة وإمكانية الوصول.",
      demographics: {
        none: "أفضل عدم الإفصاح",
        student: "طالب دولي",
        elderly: "مقيم مسن",
        newArrival: "واصل حديثاً إلى أستراليا",
        family: "عائلة محلية",
        other: "آخر",
      },
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
    landing: {
      eyebrow: "موصل مجتمعي",
      heading: "ابحث عما تحتاجه،",
      headingEm: "بالقرب منك.",
      sub: "طريقة هادئة لاكتشاف الحدائق والمطابخ والمكتبات وورش الإصلاح القائمة بالفعل في منطقتك — والناس من خلفها.",
      cta: "ابدأ الآن",
      howItWorks: "كيف يعمل",
      shareGroup: "أضف فعاليتك",
      forLabel: "من أجل",
      forText: "السكان والطلاب والقادمين الجدد — أي شخص يبحث عن المساعدة أو يرغب في تقديمها.",
      acrossLabel: "عبر",
      acrossText: "مدينة ملبورن — الحدائق المجتمعية، الإغاثة الغذائية، المكتبات، مقاهي الإصلاح، المنح.",
      languageLabel: "اللغة",
      builtWithLabel: "مبني بـ",
      builtWithText: "عناوين حقيقية، ساعات عمل حقيقية. لا يوجد تفريغ أدلة، لا حاجة للتسجيل.",
      openNowLabel: "مفتوح الآن",
      showLess: "عرض أقل",
      browseAll: "تصفح الكل {n} ←",
    },
    howItWorks: {
      back: "رجوع",
      eyebrow: "موصل مجتمعي",
      heading: "كيف يعمل",
      sub: "يساعدك Nearby في العثور على الموارد المجتمعية في منطقتك — بدون حسابات، وبدون تسجيل، وبدون تفريغ أدلة.",
      coversHeading: "ما يغطيه Nearby",
      getStarted: "ابدأ الآن",
      backToHome: "العودة إلى الصفحة الرئيسية",
      steps: [
        { title: "أخبرنا بضاحيتك", body: "اكتب ضاحيتك أو استخدم موقع جهازك. يركز Nearby على منطقة مجلس مدينة ملبورن — كارلتون، شمال ملبورن، دوكلاندز، ساوث بانك، فيتزروي، والمزيد." },
        { title: "صف ما تحتاجه", body: "استخدم لغة بسيطة — \"مكان لزراعة الخضار\"، \"وجبات مجانية هذا الأسبوع\"، \"مساعدة في إصلاح دراجتي\"، \"مكان هادئ للدراسة\". لا فئات، لا خانات اختيار." },
        { title: "أخبرنا عن نفسك اختيارياً", body: "إذا كنت طالباً، أو وافداً جديداً، أو مقيماً مسناً، أو عائلة، فأخبرنا بذلك. يستخدم Nearby هذا السياق لتخصيص التوصيات — مع ذكر الخيارات المجانية، أو دعم اللغة، أو الأوقات المناسبة للأطفال." },
        { title: "احصل على ثلاثة أماكن محددة", body: "يعيد لك Nearby ثلاثة خدمات حقيقية بعناوين حقيقية، وساعات عمل، وكيفية الدخول. لا يلزم التسجيل، ولا يلزم وجود خطاب إحالة." },
        { title: "اطرح أسئلة متابعة", body: "بمجرد حصولك على النتائج، استخدم الدردشة في الجزء السفلي لطرح المزيد — \"هل هناك مواقف سيارات قريبة؟\"، \"ماذا يجب أن أحضر معي؟\"، \"هل هناك خيارات أخرى في عطلة نهاية الأسبوع؟\"" }
      ],
      categories: [
        { icon: "🌱", label: "حدائق مجتمعية", sub: "قطع أراضي، أعمال جماعية، سماد" },
        { icon: "🍲", label: "إغاثة غذائية", sub: "وجبات مجانية، مخازن طعام" },
        { icon: "📚", label: "مكتبات", sub: "مساحات للدراسة، برامج" },
        { icon: "🔧", label: "مقاهي إصلاح", sub: "دراجات، ملابس، إلكترونيات" },
        { icon: "💰", label: "منح المجلس", sub: "تمويل المشاريع المجتمعية" },
        { icon: "🤝", label: "العمل التطوعي", sub: "فرص محلية" }
      ]
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
      suburbPlaceholder: "VD: Carlton, North Melbourne, Kensington",
      useLocation: "Dùng vị trí của tôi",
      locating: "Đang định vị…",
      needLabel: "Bạn cần gì?",
      needPlaceholder: "VD: nơi trồng rau, bữa ăn miễn phí tuần này, giúp sửa xe đạp, nơi yên tĩnh để học, nơi tình nguyện vào cuối tuần",
      needHint: "Cụ thể hay mơ hồ đều được — gõ hoặc đọc bằng bất kỳ ngôn ngữ nào.",
      demoLabel: "Điều nào mô tả bạn nhất?",
      demoHint: "Giúp Nearby điều chỉnh gợi ý — giá cả, hỗ trợ ngôn ngữ, khả năng tiếp cận.",
      demographics: {
        none: "Không muốn tiết lộ",
        student: "Sinh viên quốc tế",
        elderly: "Cư dân lớn tuổi",
        newArrival: "Người mới đến Úc",
        family: "Gia đình địa phương",
        other: "Khác",
      },
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
    landing: {
      eyebrow: "Kết nối cộng đồng",
      heading: "Tìm những gì bạn cần,",
      headingEm: "gần đây.",
      sub: "Một cách nhẹ nhàng để khám phá các khu vườn, nhà bếp, thư viện và xưởng sửa chữa đang hoạt động trong hội đồng của bạn — và những người đứng sau chúng.",
      cta: "Bắt đầu",
      howItWorks: "Cách hoạt động",
      shareGroup: "Thêm sự kiện của bạn",
      forLabel: "Dành cho",
      forText: "Cư dân, sinh viên, người mới đến — bất kỳ ai đang tìm kiếm sự giúp đỡ hoặc muốn giúp đỡ người khác.",
      acrossLabel: "Khu vực",
      acrossText: "Thành phố Melbourne — vườn cộng đồng, cứu trợ thực phẩm, thư viện, cà phê sửa chữa, tài trợ.",
      languageLabel: "Ngôn ngữ",
      builtWithLabel: "Xây dựng với",
      builtWithText: "Địa chỉ thực, giờ thực. Không sao chép danh bạ, không cần đăng ký.",
      openNowLabel: "Đang mở cửa",
      showLess: "Thu gọn",
      browseAll: "Xem tất cả {n} →",
    },
    howItWorks: {
      back: "Quay lại",
      eyebrow: "Kết nối cộng đồng",
      heading: "Cách hoạt động",
      sub: "Nearby giúp bạn tìm thấy các tài nguyên cộng đồng trong khu vực của mình — không cần tài khoản, không cần đăng ký, không sao chép danh bạ.",
      coversHeading: "Những gì Nearby hỗ trợ",
      getStarted: "Bắt đầu",
      backToHome: "Quay lại trang chủ",
      steps: [
        { title: "Cho biết khu vực của bạn", body: "Nhập vùng ngoại ô của bạn hoặc sử dụng vị trí thiết bị. Nearby tập trung vào khu vực hội đồng Thành phố Melbourne — Carlton, North Melbourne, Docklands, Southbank, Fitzroy và hơn thế nữa." },
        { title: "Mô tả những gì bạn cần", body: "Sử dụng ngôn ngữ tự nhiên — \"nơi trồng rau\", \"bữa ăn miễn phí tuần này\", \"giúp sửa xe đạp\", \"nơi yên tĩnh để học\". Không phân loại, không có hộp kiểm." },
        { title: "Tùy chọn cho biết về bản thân", body: "Nếu bạn là sinh viên, người mới đến, cư dân lớn tuổi hoặc gia đình, hãy cho chúng tôi biết. Nearby sử dụng thông tin đó để điều chỉnh các đề xuất — gợi ý các tùy chọn miễn phí, hỗ trợ ngôn ngữ hoặc thời gian phù hợp với trẻ em." },
        { title: "Nhận ba địa điểm cụ thể", body: "Nearby trả về ba dịch vụ thực tế với địa chỉ thực, giờ mở cửa và cách tham gia. Không cần đăng ký, không cần thư giới thiệu." },
        { title: "Đặt câu hỏi tiếp theo", body: "Khi có kết quả, hãy sử dụng tính năng trò chuyện ở dưới cùng để hỏi thêm — \"Có bãi đậu xe gần đó không?\", \"Tôi cần mang theo những gì?\", \"Có lựa chọn nào khác vào cuối tuần không?\"" }
      ],
      categories: [
        { icon: "🌱", label: "Vườn cộng đồng", sub: "Mảnh đất, ngày công ích, phân hữu cơ" },
        { icon: "🍲", label: "Cứu trợ thực phẩm", sub: "Bữa ăn miễn phí, tủ thực phẩm" },
        { icon: "📚", label: "Thư viện", sub: "Không gian tự học, chương trình" },
        { icon: "🔧", label: "Cà phê sửa chữa", sub: "Xe đạp, quần áo, đồ điện tử" },
        { icon: "💰", label: "Tài trợ hội đồng", sub: "Kinh phí dự án cộng đồng" },
        { icon: "🤝", label: "Tình nguyện", sub: "Cơ hội tại địa phương" }
      ]
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
      suburbPlaceholder: "misal: Carlton, North Melbourne, Kensington",
      useLocation: "Gunakan lokasi saya",
      locating: "Mencari lokasi…",
      needLabel: "Apa yang Anda butuhkan?",
      needPlaceholder: "misal: tempat menanam sayur, makanan gratis minggu ini, bantuan memperbaiki sepeda, tempat belajar yang tenang, kegiatan sukarelawan akhir pekan",
      needHint: "Spesifik atau umum sama saja — ketik atau dikte dalam bahasa apa pun.",
      demoLabel: "Mana yang paling menggambarkan Anda?",
      demoHint: "Membantu Nearby menyesuaikan saran — harga, dukungan bahasa, aksesibilitas.",
      demographics: {
        none: "Memilih untuk tidak menjawab",
        student: "Pelajar internasional",
        elderly: "Penduduk lanjut usia",
        newArrival: "Pendatang baru di Australia",
        family: "Keluarga lokal",
        other: "Lainnya",
      },
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
    landing: {
      eyebrow: "Penghubung komunitas",
      heading: "Temukan yang Anda butuhkan,",
      headingEm: "terdekat.",
      sub: "Cara tenang untuk menemukan kebun, dapur, perpustakaan, dan bengkel perbaikan yang sudah berjalan di wilayah Anda — dan orang-orang di baliknya.",
      cta: "Mulai",
      howItWorks: "Cara kerja",
      shareGroup: "Tambahkan acara Anda",
      forLabel: "Untuk",
      forText: "Penduduk, pelajar, pendatang baru — siapa saja yang mencari bantuan atau ingin membantu.",
      acrossLabel: "Cakupan",
      acrossText: "Kota Melbourne — kebun komunitas, bantuan pangan, perpustakaan, kafe perbaikan, hibah.",
      languageLabel: "Bahasa",
      builtWithLabel: "Dibuat dengan",
      builtWithText: "Alamat asli, jam buka asli. Tanpa salinan direktori, tanpa pendaftaran.",
      openNowLabel: "Buka sekarang",
      showLess: "Lebih sedikit",
      browseAll: "Lihat semua {n} →",
    },
    howItWorks: {
      back: "Kembali",
      eyebrow: "Penghubung komunitas",
      heading: "Cara kerja",
      sub: "Nearby membantu Anda menemukan sumber daya komunitas di area Anda — tanpa akun, tanpa pendaftaran, tanpa salinan direktori.",
      coversHeading: "Cakupan Nearby",
      getStarted: "Mulai",
      backToHome: "Kembali ke beranda",
      steps: [
        { title: "Beri tahu pinggiran kota Anda", body: "Ketik nama pinggiran kota Anda (suburb) atau gunakan lokasi perangkat Anda. Nearby berfokus pada area dewan Kota Melbourne — Carlton, North Melbourne, Docklands, Southbank, Fitzroy, dan lainnya." },
        { title: "Jelaskan apa yang Anda butuhkan", body: "Gunakan bahasa biasa — \"tempat menanam sayuran\", \"makanan gratis minggu ini\", \"bantuan memperbaiki sepeda\", \"tempat tenang untuk belajar\". Tanpa kategori, tanpa kotak centang." },
        { title: "Beri tahu tentang diri Anda (opsional)", body: "Jika Anda seorang pelajar, pendatang baru, penduduk lanjut usia, atau keluarga, beri tahu kami. Nearby menggunakan konteks itu untuk menyesuaikan rekomendasi — menyebutkan opsi gratis, dukungan bahasa, atau waktu ramah anak." },
        { title: "Dapatkan tiga tempat spesifik", body: "Nearby menampilkan tiga layanan nyata dengan alamat nyata, jam buka, dan cara masuk. Tidak memerlukan pendaftaran, tidak memerlukan surat rujukan." },
        { title: "Ajukan pertanyaan lanjutan", body: "Setelah Anda mendapatkan hasil, gunakan obrolan di bagian bawah untuk bertanya lebih lanjut — \"Apakah ada tempat parkir terdekat?\", \"Apa yang perlu saya bawa?\", \"Apakah ada opsi lain di akhir pekan?\"" }
      ],
      categories: [
        { icon: "🌱", label: "Kebun komunitas", sub: "Petak, kerja bakti, kompos" },
        { icon: "🍲", label: "Bantuan pangan", sub: "Makanan gratis, ruang penyimpanan makanan" },
        { icon: "📚", label: "Perpustakaan", sub: "Ruang belajar, program" },
        { icon: "🔧", label: "Kafe perbaikan", sub: "Sepeda, pakaian, elektronik" },
        { icon: "💰", label: "Hibah dewan", sub: "Pendanaan proyek komunitas" },
        { icon: "🤝", label: "Relawan", sub: "Peluang lokal" }
      ]
    },
  },
};

// Languages whose text direction is RTL
export const RTL_LANGS = new Set(["ar", "he", "fa", "ur", "ps"]);

export function isRtlLang(lang: string) {
  const clean = lang.toLowerCase().trim();
  // Check if it's a known RTL code or contains an RTL name
  if (clean === "arabic" || clean === "hebrew" || clean === "persian" || clean === "urdu" || clean === "pashto") return true;
  return RTL_LANGS.has(clean.split("-")[0]);
}

export function getBuiltInCode(lang: string): string | null {
  const l = lang.toLowerCase().trim();
  if (l === "en" || l === "english") return "en";
  if (l === "zh" || l.startsWith("chinese")) return "zh";
  if (l === "ar" || l === "arabic") return "ar";
  if (l === "vi" || l === "vietnamese") return "vi";
  if (l === "id" || l === "indonesian" || l === "bahasa indonesia") return "id";
  
  const code = l.split("-")[0].split("_")[0];
  if (code === "en") return "en";
  if (code === "zh") return "zh";
  if (code === "ar") return "ar";
  if (code === "vi") return "vi";
  if (code === "id") return "id";
  
  return null;
}
