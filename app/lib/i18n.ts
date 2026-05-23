import type { Lang } from "./types";

export const LANG_LABEL: Record<Lang, string> = {
  en: "EN",
  zh: "中文",
  ar: "العربية",
  vi: "TV",
};

export const LANG_NAME: Record<Lang, string> = {
  en: "English",
  zh: "Mandarin Chinese (Simplified)",
  ar: "Arabic",
  vi: "Vietnamese",
};

export const LOADING_COPY: Record<
  Lang,
  { title: string; sub: string; steps: string[] }
> = {
  en: {
    title: "Walking the neighbourhood…",
    sub: "Cross-checking what's open, who's running it, and how to get in the door.",
    steps: [
      "Reading your area",
      "Matching to programs",
      "Checking hours & access",
      "Translating reply",
    ],
  },
  zh: {
    title: "正在走访社区…",
    sub: "正在确认开放时间、负责人以及如何参与。",
    steps: ["了解您的区域", "匹配相关项目", "核对时间与门槛", "整理回复"],
  },
  ar: {
    title: "نتجوّل في الحي…",
    sub: "نتأكد من أوقات العمل، والجهة المسؤولة، وكيفية الوصول.",
    steps: [
      "قراءة منطقتك",
      "مطابقة البرامج",
      "التحقق من الأوقات",
      "ترجمة الرد",
    ],
  },
  vi: {
    title: "Đang đi quanh khu phố…",
    sub: "Đang kiểm tra giờ mở cửa, người phụ trách, và cách tham gia.",
    steps: [
      "Đọc khu vực của bạn",
      "Khớp với chương trình",
      "Kiểm tra giờ & cách tham gia",
      "Dịch phản hồi",
    ],
  },
};

export const RESULT_COPY: Record<
  Lang,
  { title: string; restart: string }
> = {
  en: { title: "Three places, close to home.", restart: "↺ New search" },
  zh: { title: "三个就在附近的去处。", restart: "↺ 重新搜索" },
  ar: { title: "ثلاثة أماكن قريبة منك.", restart: "↺ بحث جديد" },
  vi: { title: "Ba địa điểm gần nhà bạn.", restart: "↺ Tìm lại" },
};

export const CARD_LABELS: Record<
  Lang,
  { address: string; hours: string; access: string }
> = {
  en: { address: "Address", hours: "Hours", access: "Access" },
  zh: { address: "地址", hours: "开放时间", access: "如何参与" },
  ar: { address: "العنوان", hours: "ساعات العمل", access: "كيفية الوصول" },
  vi: { address: "Địa chỉ", hours: "Giờ mở cửa", access: "Cách tham gia" },
};

export const CHAT_COPY: Record<
  Lang,
  { placeholder: string; send: string; heading: string; unverified: string }
> = {
  en: {
    placeholder: "Ask a follow-up about any of these services…",
    send: "Send",
    heading: "Ask more",
    unverified: "Unverified — call ahead to confirm",
  },
  zh: {
    placeholder: "对以上任何服务提问…",
    send: "发送",
    heading: "继续提问",
    unverified: "未经核实 — 请致电确认",
  },
  ar: {
    placeholder: "اطرح سؤالاً حول أي من هذه الخدمات…",
    send: "إرسال",
    heading: "اسأل أكثر",
    unverified: "غير مؤكد — اتصل للتأكيد",
  },
  vi: {
    placeholder: "Đặt câu hỏi về bất kỳ dịch vụ nào…",
    send: "Gửi",
    heading: "Hỏi thêm",
    unverified: "Chưa xác minh — gọi trước để xác nhận",
  },
};
