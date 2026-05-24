let tones = [];
let rules = [];
let routine = [];
let lessons = [];
let phrases = [];
let sources = [];
let grammar = [];
let vocabulary = [];
let articles = [];
let learnerProfile = null;
let knowledgeItems = [];

let activeLesson = "";
let activeTag = "全部";
let activeVocabCategory = "全部";
let activeArticleTopic = "全部";
let activePronounRole = "customer";
let activePronounPartner = "older-woman";
let mediaRecorder;
let chunks = [];
let recordTarget = "";
let articleAudioPlayer = null;
let articleAudioQueue = [];
let articleAudioIndex = 0;
let activeArticleAudioButton = null;
let articleSpeechUtterance = null;
let articleAudioMode = "speech";
let articleAudioSourceIndex = 0;
let pronunciationAudioPlayer = null;
let pronunciationAudioQueue = [];
let pronunciationAudioIndex = 0;
let pronunciationSpeechUtterance = null;
let pronunciationObjectUrl = "";
let ragAudioPlayer = null;
let ragAudioQueue = [];
let ragAudioIndex = 0;
let ragAudioObjectUrl = "";
let activeRagAudioButton = null;
let ragTtsSnippets = [];
let companionMessageIndex = 0;
let companionImageIndex = 0;

const defaultVieneuVoiceId = "Xuân Vĩnh (Nam - Miền Nam)";
const pronunciationRateMin = 0.95;
const pronunciationRateMax = 1.05;
const pronunciationRateDefault = 1;
const isStaticHosted = /github\.io$/i.test(window.location.hostname);

const companionMessages = [
  "Cho em hỏi chút nha.\n意思：我想問一下喔。",
  "Em nói chậm được không?\n意思：你可以說慢一點嗎？",
  "Cho em một ly cà phê sữa đá.\n意思：給我一杯越式冰奶咖啡。",
  "Hông sao đâu.\n意思：沒關係啦。",
  "Em nghe chưa kịp.\n意思：我剛剛沒跟上/沒聽清楚。",
  "Dạ, em cảm ơn anh.\n意思：好的，謝謝你大哥。",
  "Cái này bao nhiêu vậy chị?\n意思：姐姐，這個多少錢？",
  "Chỗ này đi sao anh?\n意思：大哥，這個地方怎麼走？",
  "Thiệt hả?\n意思：真的嗎？",
  "Khỏi cần đâu anh.\n意思：不用啦大哥。",
  "Anh giúp em coi cái này được không?\n意思：你可以幫我看一下這個嗎？",
  "Cho em mang về nha.\n意思：我要外帶喔。",
  "Cho em ít đường thôi.\n意思：幫我少糖就好。",
  "Em hơi gấp, làm nhanh giúp em nha.\n意思：我有點趕，麻煩幫我快一點。",
  "Em xin phép về trước.\n意思：我先告辭/先走。",
  "Cuối tuần mình đi cà phê không?\n意思：週末要不要去喝咖啡？",
  "Xin lỗi, em tới trễ một chút.\n意思：不好意思，我晚到一點。",
  "Em muốn luyện nói giọng miền Nam.\n意思：我想練南越口音。",
  "Anh cho em xuống ở đây nha.\n意思：大哥，讓我在這裡下車。",
  "Em chuyển khoản được không?\n意思：我可以轉帳嗎？",
  "Em hơi đau bụng.\n意思：我肚子有點痛。",
  "Anh nói lại giúp em được không?\n意思：你可以幫我再說一次嗎？",
  "Coi bộ sắp mưa.\n意思：看起來快下雨了。",
  "Mỗi ngày học một chút là được.\n意思：每天學一點就可以了。",
  "Dữ vậy?\n意思：這麼誇張喔？/這麼...喔？",
  "Đợi em chút xíu nha.\n意思：等我一下下喔。",
  "Em chưa quen lắm.\n意思：我還不是很熟。",
  "Nói vậy tự nhiên hơn.\n意思：這樣說比較自然。",
  "Mình gặp ở đâu?\n意思：我們在哪裡見？",
  "Có gì nhắn em nha.\n意思：有事傳訊息給我喔。"
];

const companionImages = [
  "assets/images/wife-companion-cutout.png",
  "assets/images/wife-companion-cutout-2.png",
  "assets/images/wife-companion-cutout-3.png",
  "assets/images/wife-companion-cutout-4.png"
];

const saved = new Set(JSON.parse(localStorage.getItem("southern-vn-saved") || "[]"));
const reviewState = JSON.parse(localStorage.getItem("southern-vn-review-state") || "{}");

const scenarios = [
  {
    id: "cafe",
    title: "咖啡店",
    label: "Cafe",
    icon: "☕",
    description: "點咖啡、甜度冰塊、坐一下、朋友聊天。",
    x: 22,
    y: 28,
    lessons: ["coffee", "smalltalk", "weather-plan", "study-cafe", "coffee-invite", "bubble-tea-order", "wrong-order-complaint", "language-exchange", "late-night-snack", "hotpot-with-friends", "ask-for-recommendation", "pickup-takeout", "cafe-change-seat", "southern-reaction-drill"],
    articleTopics: ["城市生活", "天氣"],
    phraseTopics: ["飲料", "聊天", "禮貌"],
    vocabCategories: ["飲料", "聊天", "禮貌"],
  },
  {
    id: "market",
    title: "市場",
    label: "Chợ",
    icon: "🧺",
    description: "問價格、買水果、殺價、稱呼阿姨叔叔。",
    x: 50,
    y: 20,
    lessons: ["market", "street-breakfast", "convenience-store", "buy-raincoat", "late-night-snack", "ask-for-recommendation", "pickup-takeout"],
    articleTopics: ["市場", "吃飯"],
    phraseTopics: ["購物", "吃飯"],
    vocabCategories: ["購物", "水果", "量詞"],
  },
  {
    id: "transport",
    title: "交通",
    label: "Xe",
    icon: "🛵",
    description: "搭 Grab、問路、買客運票、機場報到。",
    x: 78,
    y: 34,
    lessons: ["grab", "directions", "bus-station", "airport", "gas-station", "parking-lot", "traffic-stop", "taxi-fare-clarify", "buy-raincoat", "rent-motorbike", "minor-scratch-accident", "motorbike-towed", "parking-fee-pay", "borrow-helmet"],
    articleTopics: ["交通", "問路", "旅行"],
    phraseTopics: ["交通", "問路"],
    vocabCategories: ["交通", "問路"],
  },
  {
    id: "home",
    title: "住處",
    label: "Nhà",
    icon: "⌂",
    description: "租房、收件、漏水報修、洗衣店。",
    x: 30,
    y: 62,
    lessons: ["rent-room", "delivery", "apartment-maintenance", "laundry", "roommate-quiet", "landlord-rent", "utility-bill", "aircon-broken", "internet-broken", "neighbor-noise", "moving-house", "buy-furniture"],
    articleTopics: ["租屋", "鄰里生活"],
    phraseTopics: ["生活", "外送"],
    vocabCategories: ["生活", "家庭", "外送"],
  },
  {
    id: "errands",
    title: "辦事",
    label: "Việc",
    icon: "▣",
    description: "銀行、郵局、手機門號、超市結帳。",
    x: 62,
    y: 58,
    lessons: ["bank-account", "post-office", "phone", "supermarket", "phone-repair", "transfer-payment", "online-return", "convenience-store", "copy-shop-printing", "atm-withdrawal", "lost-bank-card", "utility-bill", "barber-style-upgrade", "register-membership", "cancel-subscription", "request-refund", "exchange-money", "card-declined", "buy-furniture"],
    articleTopics: ["銀行", "郵寄", "手機", "購物"],
    phraseTopics: ["手機", "付款", "購物"],
    vocabCategories: ["手機", "購物", "生活"],
  },
  {
    id: "health",
    title: "健康",
    label: "Khỏe",
    icon: "✚",
    description: "身體不舒服、藥局、診所、牙醫。",
    x: 82,
    y: 70,
    lessons: ["clinic", "pharmacy", "dentist", "hospital-registration", "appointment-phone-call", "allergy-pharmacy", "stomachache-clinic", "buy-eye-drops", "emergency-room", "describe-pain-scale"],
    articleTopics: ["健康"],
    phraseTopics: ["健康"],
    vocabCategories: ["健康", "形容/健康"],
  },
  {
    id: "social",
    title: "人際",
    label: "Bạn",
    icon: "◯",
    description: "家庭稱謂、生日邀約、改時間、過年拜訪。",
    x: 42,
    y: 82,
    lessons: ["greeting", "family", "birthday-invite", "reschedule", "visit-friend-family", "coffee-invite", "movie-plan", "language-exchange", "zalo-add-friend", "late-apology", "first-date-meetup", "decline-invite", "compliment-natural", "introduce-friends", "awkward-small-talk", "hotpot-with-friends", "southern-reaction-drill"],
    articleTopics: ["人際禮貌", "節慶"],
    phraseTopics: ["問候", "家庭", "聊天"],
    vocabCategories: ["家庭", "聊天", "禮貌"],
  },
  {
    id: "work",
    title: "工作學習",
    label: "Work",
    icon: "▤",
    description: "辦公室、檔案、會議、學越南語。",
    x: 14,
    y: 78,
    lessons: ["work", "part-time-shift", "university-group-project", "job-interview", "class-presentation", "ask-grade-feedback", "boss-new-task", "sudden-sick-leave", "team-workload-conflict"],
    articleTopics: ["工作"],
    phraseTopics: ["工作", "學習"],
    vocabCategories: ["工作", "學習"],
  },
];

const pronounRoles = [
  { id: "customer", title: "我是顧客", note: "咖啡店、市場、超市、銀行、郵局等服務場景。" },
  { id: "student", title: "我是學生", note: "老師、補習班、語言交換、請教問題。" },
  { id: "junior-family", title: "我是晚輩", note: "叔叔阿姨、鄰居長輩、家庭朋友。" },
  { id: "friend", title: "我是朋友", note: "同輩、熟人、輕鬆邀約。" },
  { id: "coworker", title: "我是同事", note: "公司、會議、請同事幫忙。" },
];

const pronounPartners = [
  { id: "older-woman", title: "年長女性", call: "chị", age: "約 25-40", otherFormal: "em", otherClose: "em" },
  { id: "older-man", title: "年長男性", call: "anh", age: "約 25-40", otherFormal: "em", otherClose: "em" },
  { id: "aunt", title: "阿姨輩", call: "cô", age: "約 40+", otherFormal: "con", otherClose: "con" },
  { id: "uncle", title: "叔叔輩", call: "chú", age: "約 40+", otherFormal: "con", otherClose: "con" },
  { id: "teacher-female", title: "女老師", call: "cô", age: "老師/指導者", otherFormal: "em", otherClose: "em" },
  { id: "teacher-male", title: "男老師", call: "thầy", age: "老師/指導者", otherFormal: "em", otherClose: "em" },
  { id: "peer", title: "同輩朋友", call: "bạn", age: "差不多年紀", otherFormal: "bạn", otherClose: "mình" },
  { id: "younger", title: "比我年輕", call: "em", age: "明顯比你小", otherFormal: "anh", otherClose: "anh" },
];

const pronounScenarios = [
  {
    title: "咖啡店女店員",
    context: "對方看起來 25-35 歲，比你大一點。",
    self: "em",
    call: "chị",
    safeLine: "Chị ơi, cho em một ly cà phê sữa đá ít đường nha.",
    avoid: "Tôi muốn một cà phê.",
  },
  {
    title: "咖啡店男店員",
    context: "對方看起來比你年長或氣質像哥哥。",
    self: "em",
    call: "anh",
    safeLine: "Anh ơi, cho em xin thêm cái ống hút nha.",
    avoid: "Bạn đưa tôi ống hút.",
  },
  {
    title: "市場阿姨",
    context: "賣水果、早餐、熟食的阿姨輩。",
    self: "con",
    call: "cô",
    safeLine: "Cô ơi, xoài này bao nhiêu một ký vậy cô?",
    avoid: "Chị ơi, xoài bao nhiêu?",
  },
  {
    title: "保全叔叔",
    context: "大樓門口、宿舍、公司入口的叔叔輩。",
    self: "con",
    call: "chú",
    safeLine: "Chú ơi, cho con hỏi thang máy ở đâu vậy chú?",
    avoid: "Anh ơi, thang máy đâu?",
  },
  {
    title: "女老師",
    context: "學校、補習班、語言課老師。",
    self: "em",
    call: "cô",
    safeLine: "Dạ cô, em chưa hiểu câu này, cô giải thích lại giúp em được không?",
    avoid: "Bạn giải thích lại cho tôi.",
  },
  {
    title: "男老師",
    context: "男老師、教練、正式指導者。",
    self: "em",
    call: "thầy",
    safeLine: "Dạ thầy, em nộp bài rồi, thầy coi giúp em nha.",
    avoid: "Anh coi bài cho em.",
  },
  {
    title: "同齡語言交換",
    context: "年紀接近、已經約出來聊天的同輩。",
    self: "mình",
    call: "bạn",
    safeLine: "Mình học tiếng Việt, bạn sửa giúp mình nha.",
    avoid: "Tôi muốn bạn sửa tiếng Việt cho tôi.",
  },
  {
    title: "比你小的店員",
    context: "對方明顯比你年輕，或是高中/大一感覺。",
    self: "anh",
    call: "em",
    safeLine: "Em ơi, cái này còn size M không?",
    avoid: "Bạn ơi, cho tôi hỏi.",
  },
  {
    title: "Grab 司機大哥",
    context: "男司機看起來比你大，語氣要清楚禮貌。",
    self: "em",
    call: "anh",
    safeLine: "Anh ơi, tới cổng này giúp em nha.",
    avoid: "Tới đây. Dừng lại.",
  },
  {
    title: "房東阿姨",
    context: "租屋、繳房租、報修，對方是阿姨輩。",
    self: "con",
    call: "cô",
    safeLine: "Dạ cô, phòng con bị rò nước, cô coi giúp con được không?",
    avoid: "Phòng tôi bị hư, sửa đi.",
  },
  {
    title: "朋友媽媽",
    context: "去朋友家、過年拜訪、第一次見家長。",
    self: "con",
    call: "cô",
    safeLine: "Dạ con chào cô, con là Steve, bạn của Minh.",
    avoid: "Chào chị, tôi là bạn của Minh.",
  },
  {
    title: "公司同輩同事",
    context: "年紀差不多、還不熟的同事。",
    self: "mình",
    call: "bạn",
    safeLine: "Bạn gửi mình file đó được không? Mình cảm ơn nha.",
    avoid: "Bạn phải gửi file cho tôi.",
  },
];

const pronounRules = [
  {
    title: "先看關係，再看年齡",
    note: "越南語稱謂不是單純你/我，而是把年齡、關係、禮貌一起放進句子。",
    example: "市場阿姨用 cô / con；咖啡店姊姊用 chị / em。",
  },
  {
    title: "20 歲男性最安全自稱是 em",
    note: "面對大多數年長店員、司機、櫃台，用 em 自稱自然又不失禮。",
    example: "Anh ơi, cho em hỏi chút nha.",
  },
  {
    title: "父母輩、朋友爸媽、房東長輩可用 con",
    note: "con 不是小孩專用，對叔叔阿姨輩能表達晚輩禮貌。",
    example: "Dạ cô, con gửi tiền nhà rồi.",
  },
  {
    title: "同輩先用 bạn / mình",
    note: "不熟時比 mày / tao 安全，也比 tôi / bạn 少一點課本味。",
    example: "Mình hỏi bạn chút được không?",
  },
  {
    title: "對方比你小才用 anh / em",
    note: "你是男生且比對方年長時，可以自稱 anh、稱對方 em。",
    example: "Em giúp anh lấy cái này nha.",
  },
  {
    title: "不確定就先不要硬叫年齡",
    note: "用 dạ + cho em hỏi 開場，等對方反應後再補稱謂。",
    example: "Dạ, cho em hỏi chút được không?",
  },
  {
    title: "叫錯要自然修正",
    note: "越南人通常會理解外國人還在學；你快速修正反而加分。",
    example: "Dạ, em gọi chị là chị được không?",
  },
  {
    title: "南越禮貌常靠 dạ、nha、với",
    note: "不要只靠正式詞彙，語尾詞和稱謂更像日常口語。",
    example: "Chị giúp em chút với nha.",
  },
];

const commonMistakes = [
  {
    title: "太常用 tôi",
    bad: "Tôi muốn mua cà phê.",
    better: "Cho em một ly cà phê sữa đá.",
    why: "tôi 文法上沒錯，但很多日常場景會太硬。20 歲男性顧客多用 em 自稱比較自然。",
    tags: ["稱謂", "自然度"],
  },
  {
    title: "對長輩忘記 dạ",
    bad: "Con ăn rồi.",
    better: "Dạ, con ăn rồi cô.",
    why: "對叔叔阿姨、老師、服務長輩時，dạ 會讓語氣立刻變禮貌。",
    tags: ["禮貌", "長輩"],
  },
  {
    title: "把 chị / cô 亂用",
    bad: "Chị ơi, cho em hỏi.（對明顯阿姨輩）",
    better: "Cô ơi, cho con hỏi.",
    why: "chị 偏姊姊輩，cô 偏阿姨/老師輩。叫太年輕或太老都可能怪。",
    tags: ["稱謂", "年齡"],
  },
  {
    title: "請求句太像命令",
    bad: "Đưa menu.",
    better: "Cho em coi menu với.",
    why: "服務場景直接命令會太硬。cho em... với / giúp em 會自然很多。",
    tags: ["服務", "請求"],
  },
  {
    title: "缺少語尾詞",
    bad: "Chờ em.",
    better: "Chờ em chút xíu nha.",
    why: "nha、ha、hen、thôi 會調整親切度。南越口語沒有語尾詞常聽起來乾。",
    tags: ["語尾詞", "南越"],
  },
  {
    title: "直翻中文語序",
    bad: "Tôi muốn hỏi bạn một vấn đề.",
    better: "Cho em hỏi chút được không?",
    why: "中文的正式說法直翻會太重。越南語日常更常用短句和情境請求。",
    tags: ["翻譯", "口語"],
  },
  {
    title: "量詞省錯地方",
    bad: "Cho em cà phê sữa đá.",
    better: "Cho em một ly cà phê sữa đá.",
    why: "點餐買東西常要 ly、tô、dĩa、phần、ký。量詞會讓句子完整很多。",
    tags: ["量詞", "點餐"],
  },
  {
    title: "北越教材口音直接套南越",
    bad: "硬分 hỏi / ngã、tr / ch、s / x。",
    better: "先用南越聽法解碼，再回頭記拼字。",
    why: "南越日常裡 nhiều 對立會弱化或合流。聽力先抓語境和常見音變，不要被北越教材卡住。",
    tags: ["發音", "南越"],
  },
  {
    title: "對朋友太正式",
    bad: "Bạn có muốn đi uống cà phê với tôi không?",
    better: "Cuối tuần đi cà phê không?",
    why: "朋友間常省主詞，語氣更輕。太完整反而像教科書。",
    tags: ["朋友", "自然度"],
  },
  {
    title: "不知道對方年紀時硬叫",
    bad: "Cô ơi...（對方可能才 30 多歲）",
    better: "Dạ, cho em hỏi chút được không?",
    why: "不確定年齡時先用安全開場，等對方反應或情境再調整稱謂。",
    tags: ["安全策略", "稱謂"],
  },
  {
    title: "把 ạ 當成南越萬用禮貌",
    bad: "Em cảm ơn ạ. Em muốn hỏi ạ.",
    better: "Dạ, em cảm ơn chị. Cho em hỏi chút nha.",
    why: "南越也聽得到 ạ，但初學者一直加 ạ 會很像教材腔。dạ + 稱謂 + nha/với 更自然。",
    tags: ["禮貌", "南越"],
  },
  {
    title: "請求時過度使用 vui lòng",
    bad: "Vui lòng cho tôi xem menu.",
    better: "Cho em coi menu với nha.",
    why: "vui lòng 偏正式告示或客服語氣；一般點餐、詢問用 cho em... với 更口語。",
    tags: ["請求", "自然度"],
  },
  {
    title: "把 please 翻成 làm ơn",
    bad: "Làm ơn đưa tôi cái này.",
    better: "Cho em cái này với.",
    why: "làm ơn 不是不能用，但日常一直用會重。南越服務場景常用 cho em... với/nha。",
    tags: ["翻譯", "請求"],
  },
  {
    title: "北越詞彙沒換成南越常用詞",
    bad: "Cho em một cốc cà phê, một quả xoài, một cái thìa.",
    better: "Cho em một ly cà phê, một trái xoài, một cái muỗng.",
    why: "cốc/quả/thìa 都能懂，但南越日常更常聽到 ly/trái/muỗng。",
    tags: ["南越詞彙", "生活"],
  },
  {
    title: "問路只會 rẽ",
    bad: "Rẽ trái ở đâu?",
    better: "Quẹo trái ở đâu vậy anh?",
    why: "南越口語常用 quẹo 表示轉彎；問路時加 vậy + 稱謂更自然。",
    tags: ["問路", "南越詞彙"],
  },
  {
    title: "說貴只會 đắt",
    bad: "Cái này đắt quá.",
    better: "Cái này mắc quá cô ơi.",
    why: "đắt 沒錯，但南越日常買東西常用 mắc；加稱謂會更像市場口語。",
    tags: ["購物", "南越詞彙"],
  },
  {
    title: "把 Có thể... 像英文 can I 一樣硬套",
    bad: "Em có thể xem menu không?",
    better: "Cho em coi menu được không?",
    why: "có thể 文法正確，但日常請求常用 cho em... được không / với。",
    tags: ["句型", "請求"],
  },
  {
    title: "否定句亂加 có",
    bad: "Em không có thích món này.",
    better: "Em không thích món này lắm.",
    why: "không có 可用在某些口語強調，但初學時先用 không + 動詞最安全，再用 lắm 調整語氣。",
    tags: ["否定", "文法"],
  },
  {
    title: "問年紀太直接",
    bad: "Bạn bao nhiêu tuổi?",
    better: "Anh/chị lớn hơn em chút hả?",
    why: "初次見面直接問 tuổi 有時突兀。真的需要判斷稱謂時，用比較柔的方式試探。",
    tags: ["稱謂", "禮貌"],
  },
  {
    title: "聽不懂時只說 không hiểu",
    bad: "Em không hiểu.",
    better: "Dạ, em nghe chưa rõ, chị nói chậm lại giúp em nha.",
    why: "只說不懂有點乾。說明是沒聽清楚，請對方慢一點，互動會順很多。",
    tags: ["聽力", "互動"],
  },
  {
    title: "把 đang 用在不自然的狀態",
    bad: "Em đang hiểu rồi.",
    better: "Em hiểu rồi / Em chưa hiểu chỗ này.",
    why: "đang 表示進行中，不是每個中文「正在」都能套。理解狀態通常直接說 hiểu / chưa hiểu。",
    tags: ["時態", "文法"],
  },
  {
    title: "只用 không sao 回應感謝",
    bad: "Không sao.",
    better: "Dạ không có gì / Hông có chi.",
    why: "không sao 偏沒關係；回應感謝時 không có gì 或南越口語 hông có chi 更貼切。",
    tags: ["回應", "南越"],
  },
];

const mistakeRepairLines = [
  { title: "請對方修正", vn: "Nếu em nói sai, chị sửa em nha.", zh: "如果我講錯，姊姊幫我修正喔。" },
  { title: "確認稱謂", vn: "Dạ, em gọi chị là chị được không?", zh: "我叫你 chị 可以嗎？" },
  { title: "承認還不熟", vn: "Dạ, em chưa biết xưng sao cho đúng.", zh: "我還不知道怎麼稱呼才對。" },
  { title: "重新說一次", vn: "Em nói lại nha.", zh: "我再講一次喔。" },
  { title: "解釋自己的意思", vn: "Ý em là...", zh: "我的意思是..." },
  { title: "問南越說法", vn: "Câu này miền Nam nói sao chị?", zh: "這句南部怎麼說？" },
  { title: "請對方慢一點", vn: "Chị nói chậm lại giúp em nha.", zh: "姊姊可以講慢一點嗎？" },
  { title: "聽不清楚", vn: "Dạ, em nghe chưa rõ.", zh: "我剛剛聽不太清楚。" },
  { title: "自然度確認", vn: "Em nói vậy có tự nhiên không?", zh: "我這樣說自然嗎？" },
  { title: "降低尷尬", vn: "Em mới học tiếng Việt nên nói hơi chậm.", zh: "我剛學越南語，所以講得比較慢。" },
];

async function loadContent() {
  const response = await fetch("data/content.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`資料庫載入失敗：${response.status}`);
  }

  const content = await response.json();
  tones = content.tones || [];
  rules = content.rules || [];
  routine = content.routine || [];
  lessons = content.lessons || [];
  phrases = content.phrases || [];
  sources = content.sources || [];
  grammar = content.grammar || [];
  vocabulary = content.vocabulary || [];
  articles = content.articles || [];
  learnerProfile = content.learnerProfile || null;
  activeLesson = lessons[0]?.id || "";
}

function saveState() {
  localStorage.setItem("southern-vn-saved", JSON.stringify([...saved]));
  const savedCount = document.querySelector("#savedCount");
  if (savedCount) {
    const reviewKeys = Object.keys(reviewState).filter((key) => key.includes(":"));
    savedCount.textContent = new Set([...reviewKeys, ...[...saved].map((item) => reviewKey("phrase", item))]).size;
  }
}

function saveReviewState() {
  localStorage.setItem("southern-vn-review-state", JSON.stringify(reviewState));
}

function migrateReviewState() {
  let changed = false;
  [...saved].forEach((value) => {
    const phrase = phrases.find((item) => item.vn === value);
    if (phrase) {
      const key = reviewKey("phrase", phrase.vn);
      if (!reviewState[key]) {
        reviewState[key] = reviewState[value] || {
          type: "phrase",
          status: "new",
          reps: 0,
          due: addDays(0),
          lastReviewed: "",
        };
        reviewState[key].type = "phrase";
        changed = true;
      }
    }
  });

  Object.keys(reviewState).forEach((key) => {
    if (!key.includes(":")) {
      delete reviewState[key];
      changed = true;
    }
  });

  if (changed) saveReviewState();
}

function todayDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(days) {
  const date = todayDate();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isDue(dateString) {
  return !dateString || dateString <= todayDate().toISOString().slice(0, 10);
}

function reviewKey(type, id) {
  return `${type}:${id}`;
}

function ensureReviewItem(key, type = "phrase") {
  if (!key) return null;
  if (!reviewState[key]) {
    reviewState[key] = {
      type,
      status: "new",
      reps: 0,
      due: addDays(0),
      lastReviewed: "",
    };
  }
  if (!reviewState[key].type) reviewState[key].type = type;
  return reviewState[key];
}

function scheduleReview(key, action) {
  const state = ensureReviewItem(key);
  if (!state) return;
  state.lastReviewed = new Date().toISOString();

  if (action === "known") {
    state.reps += 1;
    state.status = "known";
    state.due = addDays(Math.min(14, Math.max(2, state.reps * 3)));
  }

  if (action === "again") {
    state.reps = Math.max(0, state.reps - 1);
    state.status = "shaky";
    state.due = addDays(0);
  }

  if (action === "tomorrow") {
    state.status = "tomorrow";
    state.due = addDays(1);
  }

  saveReviewState();
}

function applyPageQueryDefaults() {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  const category = params.get("category");
  const query = params.get("q");
  const lesson = params.get("lesson");

  if (lesson && lessons.some((item) => item.id === lesson)) activeLesson = lesson;
  if (topic) {
    activeTag = topic;
    activeArticleTopic = topic;
  }
  if (category) activeVocabCategory = category;
  if (query && document.querySelector("#searchInput")) document.querySelector("#searchInput").value = query;
  if (query && document.querySelector("#vocabSearchInput")) document.querySelector("#vocabSearchInput").value = query;
  if (query && document.querySelector("#articleSearchInput")) document.querySelector("#articleSearchInput").value = query;
}

function routeTo(hash = window.location.hash) {
  const route = (hash || "#home").replace("#", "");
  const routeAliases = {
    "southern-reader": "audio",
  };
  const normalizedRoute = routeAliases[route] || route;
  const allowed = ["home", "pronunciation", "dialogues", "grammar", "vocabulary", "library", "rag", "audio", "sources"];
  const pageId = allowed.includes(normalizedRoute) ? normalizedRoute : "home";

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === pageId);
  });
}

function renderRoutine() {
  if (!document.querySelector("#routineList")) return;
  document.querySelector("#routineList").innerHTML = routine.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#phraseCount").textContent = phrases.length;
}

function renderLearnerProfile() {
  if (!document.querySelector("#profilePanel") || !learnerProfile) return;
  document.querySelector("#profilePanel").innerHTML = `
    <p class="eyebrow">Learner Profile</p>
    <h3>${escapeHtml(learnerProfile.title)}</h3>
    <p>${escapeHtml(learnerProfile.summary)}</p>
    <ul class="profile-list">
      ${(learnerProfile.rules || []).slice(0, 3).map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}
    </ul>
  `;
}

function renderQuickLinks() {
  if (!document.querySelector("#quickLinks")) return;
  const links = [
    ["#pronunciation", "練發音", "南越常見音變、聲調和跟讀。"],
    ["#dialogues", "進入對話課", "從生活情境開始練會開口。"],
    ["#grammar", "補核心文法", "稱謂、問句、語尾詞和口語句型。"],
    ["pronouns.html", "稱謂教練", "練 em / anh / chị / cô / chú 的關係判斷。"],
    ["vocabulary.html", "背單詞", "按生活場景整理單詞和例句。"],
    ["phrases.html", "常用詞句", "查日常短句、南越口語和服務場景。"],
    ["articles.html", "讀生活短文", "用短文串起單詞、文法和文化。"],
    ["map.html", "情境地圖", "從咖啡店、交通、家庭和工作進入課程。"],
    ["mistakes.html", "避開錯誤", "修掉翻譯腔、稱謂錯位和不自然語氣。"],
    ["review.html", "複習箱", "把單詞和詞句丟進複習流程。"],
    ["#rag", "RAG 問答", "用本機教材庫查詞句、文法、課程和文章。"],
  ];
  document.querySelector("#quickLinks").innerHTML = links
    .map(([href, title, text]) => '<a class="quick-card" href="' + escapeHtml(href) + '">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<span>' + escapeHtml(text) + '</span>' +
    '</a>')
    .join("");
}

function renderCompanionMessage(widget) {
  const message = companionMessages[companionMessageIndex % companionMessages.length];
  widget.querySelector("[data-companion-message]").textContent = message;
}

function renderCompanionImage(widget) {
  const image = companionImages[companionImageIndex % companionImages.length];
  widget.querySelector(".companion-avatar-button img").src = image;
}

function rotateCompanionMessage(widget) {
  companionMessageIndex = (companionMessageIndex + 1) % companionMessages.length;
  companionImageIndex = (companionImageIndex + 1) % companionImages.length;
  renderCompanionMessage(widget);
  renderCompanionImage(widget);
}

function setCompanionCollapsed(widget, collapsed) {
  widget.classList.toggle("is-collapsed", collapsed);
  if (collapsed) {
    localStorage.setItem("southern-vn-companion-collapsed", "1");
  } else {
    localStorage.removeItem("southern-vn-companion-collapsed");
  }
}

function initCompanionWidget() {
  if (document.querySelector(".companion-widget")) return;

  companionMessageIndex = Math.floor(Date.now() / 86400000) % companionMessages.length;
  companionImageIndex = Math.floor(Date.now() / 86400000) % companionImages.length;
  const widget = document.createElement("aside");
  widget.className = "companion-widget";
  widget.setAttribute("aria-label", "學習陪伴");
  widget.innerHTML =
    '<button class="companion-avatar-button" type="button" aria-label="打開學習陪伴">' +
      '<img src="assets/images/wife-companion-cutout.png" alt="學習陪伴頭像" />' +
    '</button>' +
    '<div class="companion-card">' +
      '<button class="companion-close" type="button" aria-label="收起訊息">×</button>' +
      '<div class="companion-card-main">' +
        '<div>' +
          '<p data-companion-message></p>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(widget);
  renderCompanionMessage(widget);
  renderCompanionImage(widget);

  setCompanionCollapsed(widget, true);

  widget.querySelector(".companion-avatar-button").addEventListener("click", () => {
    setCompanionCollapsed(widget, false);
    rotateCompanionMessage(widget);
  });
  widget.querySelector(".companion-card-main").addEventListener("click", () => rotateCompanionMessage(widget));
  widget.querySelector(".companion-close").addEventListener("click", () => setCompanionCollapsed(widget, true));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTones() {
  const grid = document.querySelector("#toneGrid");
  if (!grid) return;
  grid.innerHTML = tones
    .map((tone) => `
      <article class="tone-card">
        <span class="pill">${escapeHtml(tone.symbol || tone.name || "")}</span>
        <h3>${escapeHtml(tone.name || tone.title || "")}</h3>
        <p>${escapeHtml(tone.note || tone.description || "")}</p>
        <strong>${escapeHtml(tone.example || "")}</strong>
      </article>
    `)
    .join("");

  const ruleGrid = document.querySelector("#ruleGrid");
  if (ruleGrid) {
    ruleGrid.innerHTML = rules
      .map((rule) => `
        <article class="rule-card">
          <h3>${escapeHtml(rule.title || rule.pattern || "")}</h3>
          <p>${escapeHtml(rule.note || rule.description || "")}</p>
          <strong>${escapeHtml(rule.example || rule.pattern || "")}</strong>
        </article>
      `)
      .join("");
  }
}

function renderLessons() {
  const tabs = document.querySelector("#lessonTabs");
  const panel = document.querySelector("#lessonPanel");
  if (!tabs || !panel) return;
  if (!activeLesson || !lessons.some((item) => item.id === activeLesson)) activeLesson = lessons[0]?.id || "";
  tabs.innerHTML = lessons
    .map((lesson) => `
      <button class="lesson-tab ${lesson.id === activeLesson ? "is-active" : ""}" type="button" data-lesson="${escapeHtml(lesson.id)}">
        <span>${escapeHtml(lesson.title)}</span>
        <small>${escapeHtml(lesson.focus)} · ${escapeHtml(lesson.level)}</small>
      </button>
    `)
    .join("");

  const lesson = lessons.find((item) => item.id === activeLesson);
  if (!lesson) {
    panel.innerHTML = "<p>目前沒有對話課資料。</p>";
    return;
  }
  panel.innerHTML = `
    <p class="eyebrow">${escapeHtml(lesson.focus)}</p>
    <h3>${escapeHtml(lesson.title)}</h3>
    <p class="lesson-meta">等級：${escapeHtml(lesson.level)} · 建議先讀中文，再跟讀越文。</p>
    <div class="dialogue">
      ${(lesson.lines || [])
        .map(([speaker, vn, zh]) => `
          <div class="line">
            <span class="speaker">${escapeHtml(speaker)}</span>
            <div>
              <strong>${escapeHtml(vn)}</strong>
              <div class="translation">${escapeHtml(zh)}</div>
            </div>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="lesson-note-title">口語筆記</h3>
    <ul>${(lesson.notes || []).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
  `;

  tabs.querySelectorAll("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLesson = button.dataset.lesson;
      renderLessons();
    });
  });
}

function renderGrammar() {
  const grid = document.querySelector("#grammarGrid");
  if (!grid) return;
  grid.innerHTML = grammar
    .map((item) => `
      <article class="grammar-card">
        <div class="meta-row">
          <span class="pill">${escapeHtml(item.level)}</span>
          ${(item.tags || []).slice(0, 3).map((tag) => `<span class="pill pill--review">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p><strong>${escapeHtml(item.pattern)}</strong></p>
        <p>${escapeHtml(item.note)}</p>
        <ul class="grammar-examples">${(item.examples || []).map((example) => `<li>${escapeHtml(example)}</li>`).join("")}</ul>
      </article>
    `)
    .join("");
}

function renderVocabFilters() {
  const container = document.querySelector("#vocabFilters");
  if (!container) return;
  const categories = ["全部", ...new Set(vocabulary.map((item) => item.category).filter(Boolean))];
  if (!categories.includes(activeVocabCategory)) activeVocabCategory = "全部";
  container.innerHTML = categories
    .map((category) => `<button class="filter-chip ${category === activeVocabCategory ? "is-active" : ""}" type="button" data-vocab-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
    .join("");
  container.querySelectorAll("[data-vocab-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeVocabCategory = button.dataset.vocabCategory;
      renderVocabFilters();
      renderVocabulary();
    });
  });
}

function renderVocabulary() {
  const grid = document.querySelector("#vocabGrid");
  if (!grid) return;
  const query = document.querySelector("#vocabSearchInput")?.value.trim().toLowerCase() || "";
  const filtered = vocabulary.filter((item) => {
    const haystack = `${item.word} ${item.meaning} ${item.category} ${item.level} ${item.note} ${item.example} ${item.exampleZh}`.toLowerCase();
    return (activeVocabCategory === "全部" || item.category === activeVocabCategory) && (!query || haystack.includes(query));
  });
  grid.innerHTML = filtered
    .map((item) => `
      <article class="vocab-card">
        <div class="meta-row"><span class="pill">${escapeHtml(item.level)}</span><span class="pill pill--review">${escapeHtml(item.category)}</span></div>
        <div class="vocab-word">${escapeHtml(item.word)}</div>
        <strong>${escapeHtml(item.meaning)}</strong>
        <p>${escapeHtml(item.note)}</p>
        <div class="vocab-example"><strong>${escapeHtml(item.example)}</strong><span class="translation">${escapeHtml(item.exampleZh)}</span></div>
        ${renderAudioControls(item.word, item.audio)}
        ${renderAudioControls(item.example, item.exampleAudio, { showForvo: false })}
      </article>
    `)
    .join("");
}

function renderFilters() {
  const container = document.querySelector("#filters");
  if (!container) return;
  const topics = ["全部", ...new Set(phrases.map((item) => item.topic).filter(Boolean))];
  if (!topics.includes(activeTag)) activeTag = "全部";
  container.innerHTML = topics
    .map((topic) => `<button class="filter-chip ${topic === activeTag ? "is-active" : ""}" type="button" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`)
    .join("");
  container.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.topic;
      renderFilters();
      renderPhrases();
    });
  });
}

function renderPhrases() {
  const grid = document.querySelector("#phraseGrid");
  if (!grid) return;
  const query = document.querySelector("#searchInput")?.value.trim().toLowerCase() || "";
  const filtered = phrases.filter((item) => {
    const haystack = `${item.vn} ${item.zh} ${item.topic} ${item.level} ${item.status}`.toLowerCase();
    return (activeTag === "全部" || item.topic === activeTag) && (!query || haystack.includes(query));
  });
  grid.innerHTML = filtered
    .map((item) => `
      <article class="phrase-card">
        <div class="meta-row"><span class="pill">${escapeHtml(item.level)}</span><span class="pill pill--review">${escapeHtml(item.topic)}</span></div>
        <h3>${escapeHtml(item.vn)}</h3>
        <p>${escapeHtml(item.zh)}</p>
        ${renderAudioControls(item.vn, item.audio, { showForvo: false })}
      </article>
    `)
    .join("");
}

function renderArticleFilters() {
  const container = document.querySelector("#articleFilters");
  if (!container) return;
  const topics = ["全部", ...new Set(articles.map((item) => item.topic).filter(Boolean))];
  if (!topics.includes(activeArticleTopic)) activeArticleTopic = "全部";
  container.innerHTML = topics
    .map((topic) => `<button class="filter-chip ${topic === activeArticleTopic ? "is-active" : ""}" type="button" data-article-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`)
    .join("");
  container.querySelectorAll("[data-article-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      activeArticleTopic = button.dataset.articleTopic;
      renderArticleFilters();
      renderArticles();
    });
  });
}

function renderFullArticleCards(grid) {
  const query = document.querySelector("#articleSearchInput")?.value.trim().toLowerCase() || "";
  const filtered = articles.filter((article) => {
    const text = `${article.title} ${article.topic} ${article.summary} ${article.southernFocus} ${(article.paragraphs || []).flatMap((p) => [p.vn, p.zh]).join(" ")}`.toLowerCase();
    return (activeArticleTopic === "全部" || article.topic === activeArticleTopic) && (!query || text.includes(query));
  });
  grid.innerHTML = filtered
    .map((article) => `
      <article class="article-card">
        <div class="article-card__head">
          <div>
            <p class="eyebrow">${escapeHtml(article.topic)}</p>
            <h3>${escapeHtml(article.title)}</h3>
            <p class="article-summary">${escapeHtml(article.summary)}</p>
          </div>
          <div class="article-card__tools">
            <span class="pill">${escapeHtml(article.level)}</span>
            ${article.status ? `<span class="pill pill--review">${escapeHtml(article.status)}</span>` : ""}
            <button class="article-play" type="button" data-article-audio="${escapeHtml(article.id)}">播放</button>
            <a class="article-translate-link" href="${googleTranslatePageUrl(article)}" target="_blank" rel="noreferrer">Google 翻譯</a>
          </div>
        </div>
        <div class="article-focus"><strong>南越重點</strong><p>${escapeHtml(article.southernFocus || "")}</p></div>
        <div class="article-lines">
          ${(article.paragraphs || []).map((line) => `<p class="article-line"><strong>${escapeHtml(line.vn)}</strong><span class="translation">${escapeHtml(line.zh)}</span></p>`).join("")}
        </div>
        <div class="article-study-grid">
          <section>
            <h3>關鍵單詞</h3>
            <ul>
              ${(article.vocabulary || []).map((item) => `<li><strong>${escapeHtml(item.word)}</strong> · ${escapeHtml(item.meaning)}<br><span>${escapeHtml(item.example || "")}</span></li>`).join("")}
            </ul>
          </section>
          <section>
            <h3>句型筆記</h3>
            <ul>
              ${(article.grammar || []).map((item) => `<li><strong>${escapeHtml(item.pattern)}</strong> · ${escapeHtml(item.note)}<br><span>${escapeHtml(item.example || "")}</span></li>`).join("")}
            </ul>
          </section>
          <section>
            <h3>閱讀練習</h3>
            <ol>
              ${(article.questions || []).map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
            </ol>
          </section>
        </div>
      </article>
    `)
    .join("");
  grid.querySelectorAll("[data-article-audio]").forEach((button) => {
    button.addEventListener("click", () => playArticleAudio(button.dataset.articleAudio, button));
  });
}

function renderArticles() {
  const grid = document.querySelector("#articleGrid");
  if (!grid) return;
  renderFullArticleCards(grid);
  return;
  const query = document.querySelector("#articleSearchInput")?.value.trim().toLowerCase() || "";
  const filtered = articles.filter((article) => {
    const text = `${article.title} ${article.topic} ${article.summary} ${article.southernFocus} ${(article.paragraphs || []).flatMap((p) => [p.vn, p.zh]).join(" ")}`.toLowerCase();
    return (activeArticleTopic === "全部" || article.topic === activeArticleTopic) && (!query || text.includes(query));
  });
  grid.innerHTML = filtered
    .map((article) => `
      <article class="article-card">
        <div class="article-card__head">
          <div>
            <p class="eyebrow">${escapeHtml(article.topic)}</p>
            <h3>${escapeHtml(article.title)}</h3>
            <p>${escapeHtml(article.summary)}</p>
          </div>
          <div class="article-card__tools">
            <span class="pill">${escapeHtml(article.level)}</span>
            <button class="small-button" type="button" data-article-audio="${escapeHtml(article.id)}">播放</button>
          </div>
        </div>
        <div class="southern-note"><strong>南越重點</strong><p>${escapeHtml(article.southernFocus || "")}</p></div>
        <div class="article-lines">
          ${(article.paragraphs || []).map((line) => `<p><strong>${escapeHtml(line.vn)}</strong><span class="translation">${escapeHtml(line.zh)}</span></p>`).join("")}
        </div>
      </article>
    `)
    .join("");
  grid.querySelectorAll("[data-article-audio]").forEach((button) => {
    button.addEventListener("click", () => playArticleAudio(button.dataset.articleAudio, button));
  });
}

function renderScenarioMap() {
  const map = document.querySelector("#scenarioMap");
  const detail = document.querySelector("#scenarioDetail");
  if (!map || !detail) return;
  const first = scenarios[0];
  map.innerHTML = scenarios
    .map((scenario) => `<button class="map-pin" type="button" data-scenario="${escapeHtml(scenario.id)}" style="left:${scenario.x}%; top:${scenario.y}%"><span class="map-pin__icon">${escapeHtml(scenario.icon || "")}</span><strong>${escapeHtml(scenario.label || scenario.title)}</strong></button>`)
    .join("");
  const renderDetail = (scenario = first) => {
    const relatedLessons = lessons.filter((lesson) => (scenario.lessons || []).includes(lesson.id));
    detail.innerHTML = `<p class="eyebrow">Scenario</p><h2>${escapeHtml(scenario.title)}</h2><p>${escapeHtml(scenario.description)}</p><div class="scenario-lessons">${relatedLessons.slice(0, 8).map((lesson) => `<a class="scenario-lesson" href="index.html?lesson=${encodeURIComponent(lesson.id)}#dialogues"><strong>${escapeHtml(lesson.title)}</strong><span>${escapeHtml(lesson.focus)} · ${escapeHtml(lesson.level)}</span></a>`).join("")}</div>`;
  };
  map.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => renderDetail(scenarios.find((item) => item.id === button.dataset.scenario)));
  });
  renderDetail(first);
}

function renderPronounCoach() {
  const root = document.querySelector("#pronounCoach");
  if (root) root.innerHTML = "<p>稱謂教練資料已整合在 RAG 與課程中。</p>";
}

function renderPronounScenarios() {
  const root = document.querySelector("#pronounScenarios");
  if (root) root.innerHTML = "";
}

function renderPronounRules() {
  const root = document.querySelector("#pronounRules");
  if (root) root.innerHTML = "";
}

function renderMistakeRadar() {
  const root = document.querySelector("#mistakeGrid");
  if (root) root.innerHTML = "";
}

function renderMistakeRepairLines() {
  const root = document.querySelector("#repairLineGrid");
  if (root) root.innerHTML = "";
}

function renderScenarioMap() {
  const map = document.querySelector("#scenarioMap");
  const detail = document.querySelector("#scenarioPanel");
  if (!map || !detail) return;
  const first = scenarios[0];
  map.innerHTML = `
    <span class="map-road map-road--main"></span>
    <span class="map-road map-road--river"></span>
    ${scenarios
      .map((scenario) => `<button class="map-pin" type="button" data-scenario="${escapeHtml(scenario.id)}" style="--x:${scenario.x}; --y:${scenario.y}"><span class="map-pin__icon">${escapeHtml(scenario.icon || "")}</span><strong>${escapeHtml(scenario.label || scenario.title)}</strong></button>`)
      .join("")}
  `;
  const renderDetail = (scenario = first) => {
    const relatedLessons = lessons.filter((lesson) => (scenario.lessons || []).includes(lesson.id));
    const relatedArticles = articles.filter((article) => (scenario.articleTopics || []).includes(article.topic));
    const relatedPhrases = phrases.filter((phrase) => (scenario.phraseTopics || []).includes(phrase.topic));
    const relatedVocab = vocabulary.filter((word) => (scenario.vocabCategories || []).includes(word.category));
    map.querySelectorAll("[data-scenario]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.scenario === scenario.id);
    });
    detail.innerHTML = `
      <p class="eyebrow">Scenario</p>
      <h2><span class="scenario-title-icon">${escapeHtml(scenario.icon || "")}</span>${escapeHtml(scenario.title)}</h2>
      <p>${escapeHtml(scenario.description)}</p>
      <div class="scenario-stats">
        <span><strong>${relatedLessons.length}</strong>對話課</span>
        <span><strong>${relatedArticles.length}</strong>文章</span>
        <span><strong>${relatedPhrases.length}</strong>詞句</span>
        <span><strong>${relatedVocab.length}</strong>單詞</span>
      </div>
      <div class="scenario-actions">
        <a class="button button--primary" href="index.html?lesson=${encodeURIComponent(relatedLessons[0]?.id || "")}#dialogues">進入對話</a>
        <a class="button button--subtle" href="articles.html">看文章</a>
        <a class="button button--subtle" href="phrases.html">練詞句</a>
        <a class="button button--subtle" href="vocabulary.html">背單詞</a>
      </div>
      <div class="scenario-lessons">${relatedLessons.slice(0, 8).map((lesson) => `<a class="scenario-lesson" href="index.html?lesson=${encodeURIComponent(lesson.id)}#dialogues"><strong>${escapeHtml(lesson.title)}</strong><span>${escapeHtml(lesson.focus)} · ${escapeHtml(lesson.level)}</span></a>`).join("")}</div>
    `;
  };
  map.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => renderDetail(scenarios.find((item) => item.id === button.dataset.scenario)));
  });
  renderDetail(first);
}

function renderPronounCoach() {
  const root = document.querySelector("#pronounCoach");
  if (!root) return;
  const renderResult = () => {
    const role = pronounRoles.find((item) => item.id === activePronounRole) || pronounRoles[0];
    const partner = pronounPartners.find((item) => item.id === activePronounPartner) || pronounPartners[0];
    const sample = pronounScenarios.find((item) => item.call === partner.call && item.self === partner.otherFormal) || pronounScenarios.find((item) => item.call === partner.call) || pronounScenarios[0];
    const result = root.querySelector("[data-pronoun-result]");
    if (!result) return;
    result.innerHTML = `
      <p class="eyebrow">Result</p>
      <h2>${escapeHtml(role.title)} × ${escapeHtml(partner.title)}</h2>
      <p>${escapeHtml(role.note)} 對方約略是 ${escapeHtml(partner.age)}，先用安全稱謂，不要急著用 bạn / tôi。</p>
      <div class="pronoun-result-grid">
        <div><span>我自稱</span><strong>${escapeHtml(partner.otherFormal)}</strong></div>
        <div><span>稱呼對方</span><strong>${escapeHtml(partner.call)}</strong></div>
        <div><span>對方可能叫你</span><strong>${escapeHtml(partner.otherClose)}</strong></div>
      </div>
      <div class="coach-examples">
        <div>${escapeHtml(sample.safeLine)}</div>
        <div>避免：${escapeHtml(sample.avoid)}</div>
      </div>
    `;
    root.querySelectorAll("[data-role]").forEach((button) => button.classList.toggle("is-active", button.dataset.role === activePronounRole));
    root.querySelectorAll("[data-partner]").forEach((button) => button.classList.toggle("is-active", button.dataset.partner === activePronounPartner));
  };
  root.innerHTML = `
    <div class="coach-layout">
      <article class="panel coach-panel">
        <p class="eyebrow">我現在是</p>
        <div class="choice-grid">
          ${pronounRoles.map((role) => `<button class="choice-button" type="button" data-role="${escapeHtml(role.id)}"><strong>${escapeHtml(role.title)}</strong><span>${escapeHtml(role.note)}</span></button>`).join("")}
        </div>
      </article>
      <article class="panel coach-panel">
        <p class="eyebrow">對方是</p>
        <div class="choice-grid">
          ${pronounPartners.map((partner) => `<button class="choice-button" type="button" data-partner="${escapeHtml(partner.id)}"><strong>${escapeHtml(partner.title)}</strong><span>${escapeHtml(partner.call)} · ${escapeHtml(partner.age)}</span></button>`).join("")}
        </div>
      </article>
      <article class="panel coach-result" data-pronoun-result></article>
    </div>
  `;
  root.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      activePronounRole = button.dataset.role;
      renderResult();
    });
  });
  root.querySelectorAll("[data-partner]").forEach((button) => {
    button.addEventListener("click", () => {
      activePronounPartner = button.dataset.partner;
      renderResult();
    });
  });
  renderResult();
}

function renderPronounScenarios() {
  const root = document.querySelector("#pronounScenarioGrid");
  if (!root) return;
  root.innerHTML = pronounScenarios
    .map((item) => `
      <article class="field-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.context)}</p>
        <p><strong>${escapeHtml(item.self)}</strong> → <strong>${escapeHtml(item.call)}</strong></p>
        <div class="field-line field-line--good">${escapeHtml(item.safeLine)}</div>
        <div class="field-line field-line--bad">${escapeHtml(item.avoid)}</div>
      </article>
    `)
    .join("");
}

function renderPronounRules() {
  const root = document.querySelector("#pronounRuleGrid");
  if (!root) return;
  root.innerHTML = pronounRules
    .map((rule) => `
      <article class="field-card field-card--compact">
        <h3>${escapeHtml(rule.title)}</h3>
        <p>${escapeHtml(rule.note)}</p>
        <div class="field-line field-line--good">${escapeHtml(rule.example)}</div>
      </article>
    `)
    .join("");
}

function renderMistakeRadar() {
  const root = document.querySelector("#mistakeGrid");
  if (!root) return;
  root.innerHTML = commonMistakes
    .map((item) => `
      <article class="mistake-card">
        <div class="meta-row">${(item.tags || []).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
        <h2>${escapeHtml(item.title)}</h2>
        <div class="mistake-compare">
          <div><span>不要這樣說</span><strong>${escapeHtml(item.bad)}</strong></div>
          <div><span>改成這樣</span><strong>${escapeHtml(item.better)}</strong></div>
        </div>
        <p>${escapeHtml(item.why)}</p>
      </article>
    `)
    .join("");
}

function renderMistakeRepairLines() {
  const root = document.querySelector("#repairLineGrid");
  if (!root) return;
  root.innerHTML = mistakeRepairLines
    .map((line) => `
      <article class="field-card field-card--compact">
        <h3>${escapeHtml(line.title)}</h3>
        <div class="field-line field-line--good">${escapeHtml(line.vn)}</div>
        <p>${escapeHtml(line.zh)}</p>
      </article>
    `)
    .join("");
}

function renderReviewBox() {
  const root = document.querySelector("#reviewGrid");
  if (!root) return;
  const items = [
    ...phrases.slice(0, 60).map((item) => ({ type: "phrase", id: item.vn, title: item.vn, text: item.zh })),
    ...vocabulary.slice(0, 60).map((item) => ({ type: "vocab", id: item.word, title: item.word, text: item.meaning })),
  ];
  root.innerHTML = items.map((item) => `<article class="review-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></article>`).join("");
}

function renderPronunciationHints() {
  const root = document.querySelector("#pronunciationHint");
  if (!root) return;
  const text = getPronunciationText();
  root.innerHTML = `<p>${escapeHtml(text ? "可以按 VieNeu-TTS 播放，或把句子拆短一點跟讀。" : "輸入越南文後，這裡會顯示跟讀提醒。")}</p>`;
}

function renderPronunciationLab() {
  renderPronunciationRateLabel();
  renderPronunciationHints();
  if (isStaticHosted) {
    const button = document.querySelector("#pronunciationPlayButton");
    if (button) {
      button.textContent = "本機版支援 VieNeu-TTS";
      button.title = "GitHub Pages 不能執行本機 TTS 後端，請用桌面捷徑或 localhost 開啟。";
    }
    setPronunciationStatus("GitHub Pages 是靜態網站，南越 TTS 需用本機版；這裡可用 Google 翻譯作為備援。");
  }
}

function getPronunciationText() {
  return document.querySelector("#pronunciationInput")?.value.trim() || "";
}

function setPronunciationStatus(message) {
  const status = document.querySelector("#pronunciationStatus");
  if (status) status.textContent = message;
}

function getPronunciationRate() {
  const input = document.querySelector("#pronunciationRate");
  const raw = input ? Number(input.value) : pronunciationRateDefault;
  return Math.min(pronunciationRateMax, Math.max(pronunciationRateMin, Number.isFinite(raw) ? raw : pronunciationRateDefault));
}

function renderPronunciationRateLabel() {
  const label = document.querySelector("#pronunciationRateLabel");
  if (label) label.textContent = `${getPronunciationRate().toFixed(2)}x`;
}

function getSelectedVieneuVoiceId() {
  return defaultVieneuVoiceId;
}

function getVietnameseSpeechVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices().filter((voice) => /vi|vietnam/i.test(`${voice.lang} ${voice.name}`));
}

function getSelectedPronunciationVoice() {
  return getVietnameseSpeechVoice();
}

function renderPronunciationVoiceOptions() {}

function applySafePlaybackRate(player, rate) {
  const safeRate = Math.min(pronunciationRateMax, Math.max(pronunciationRateMin, rate || pronunciationRateDefault));
  player.playbackRate = safeRate;
  if ("preservesPitch" in player) player.preservesPitch = true;
  return safeRate;
}

function chunkTextForTts(text, maxLength = 220) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const chunks = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLength) current = next;
    else {
      if (current) chunks.push(current);
      current = word;
    }
  });
  if (current) chunks.push(current);
  return chunks;
}

let pronunciationObjectUrlLocal = "";
let pronunciationAudioPlayerLocal = null;

function stopPronunciationTts() {
  if (pronunciationAudioPlayerLocal) {
    pronunciationAudioPlayerLocal.pause();
    pronunciationAudioPlayerLocal.removeAttribute("src");
    pronunciationAudioPlayerLocal.load();
  }
  if (pronunciationObjectUrlLocal) URL.revokeObjectURL(pronunciationObjectUrlLocal);
  pronunciationObjectUrlLocal = "";
  setPronunciationStatus("已停止播放。");
}

async function playPronunciationWithVieneu() {
  const text = getPronunciationText();
  if (!text) {
    setPronunciationStatus("請先輸入越南文。");
    return;
  }
  if (isStaticHosted) {
    setPronunciationStatus("GitHub Pages 不能啟動本機 VieNeu-TTS，請按「Google 翻譯」或用桌面捷徑開 localhost 版本。");
    return;
  }
  stopPronunciationTts();
  setPronunciationStatus("正在產生 VieNeu-TTS 音訊...");
  try {
    const response = await fetch("/api/vieneu/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, voice_id: getSelectedVieneuVoiceId() }),
    });
    if (!response.ok) throw new Error("TTS failed");
    const blob = await response.blob();
    pronunciationObjectUrlLocal = URL.createObjectURL(blob);
    pronunciationAudioPlayerLocal = pronunciationAudioPlayerLocal || new Audio();
    pronunciationAudioPlayerLocal.src = pronunciationObjectUrlLocal;
    applySafePlaybackRate(pronunciationAudioPlayerLocal, getPronunciationRate());
    await pronunciationAudioPlayerLocal.play();
    setPronunciationStatus("正在播放。");
  } catch {
    setPronunciationStatus("VieNeu-TTS 暫時無法播放，請確認本機 TTS 服務已啟動。");
  }
}

function renderAudio() {
  const root = document.querySelector("#audioGrid");
  if (!root) return;
  root.innerHTML = phrases.slice(0, 12).map((item) => `<article class="audio-card"><strong>${escapeHtml(item.vn)}</strong><p>${escapeHtml(item.zh)}</p>${renderAudioControls(item.vn, item.audio)}</article>`).join("");
}

function renderSources() {
  const root = document.querySelector("#sourceGrid");
  if (!root) return;
  root.innerHTML = sources.map((source) => `<article class="source-card"><h3>${escapeHtml(source.title || source.name || "")}</h3><p>${escapeHtml(source.use || source.note || source.description || "")}</p>${source.url ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">來源</a>` : ""}</article>`).join("");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/[^a-z0-9\u4e00-\u9fff]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function buildKnowledgeBase() {
  const items = [];
  grammar.forEach((item) => {
    items.push({
      type: "文法",
      title: item.title,
      subtitle: `${item.pattern} · ${item.level}`,
      text: `${item.title} ${item.pattern} ${item.note} ${(item.examples || []).join(" ")} ${(item.tags || []).join(" ")}`,
      answer: `${item.title}：${item.note}`,
      audioText: (item.examples || []).slice(0, 3).join(". "),
    });
  });
  vocabulary.forEach((item) => {
    items.push({
      type: "單詞",
      title: item.word,
      subtitle: `${item.meaning} · ${item.category} · ${item.level}`,
      text: `${item.word} ${item.meaning} ${item.category} ${item.note} ${item.example} ${item.exampleZh}`,
      answer: `${item.word} 是「${item.meaning}」。例句：${item.example}（${item.exampleZh}）`,
      audioText: item.example || item.word,
    });
  });
  phrases.forEach((item) => {
    items.push({
      type: "詞句",
      title: item.vn,
      subtitle: `${item.zh} · ${item.topic} · ${item.level}`,
      text: `${item.vn} ${item.zh} ${item.topic} ${item.level} ${item.status}`,
      answer: `「${item.vn}」意思是「${item.zh}」。`,
      audioText: item.vn,
    });
  });
  lessons.forEach((lesson) => {
    const lines = (lesson.lines || []).flatMap((line) => [line[1], line[2]]);
    items.push({
      type: "對話課",
      title: lesson.title,
      subtitle: `${lesson.focus} · ${lesson.level}`,
      text: `${lesson.title} ${lesson.focus} ${lesson.level} ${lines.join(" ")} ${(lesson.notes || []).join(" ")}`,
      answer: `「${lesson.title}」適合練 ${lesson.focus}。`,
      audioText: (lesson.lines || []).map((line) => line[1]).slice(0, 5).join(". "),
    });
  });
  articles.forEach((article) => {
    const paragraphs = (article.paragraphs || []).flatMap((line) => [line.vn, line.zh]);
    items.push({
      type: "文章",
      title: article.title,
      subtitle: `${article.topic} · ${article.level}`,
      text: `${article.title} ${article.topic} ${article.summary} ${article.southernFocus} ${paragraphs.join(" ")}`,
      answer: `文章「${article.title}」：${article.summary}`,
      audioText: (article.paragraphs || []).map((line) => line.vn).slice(0, 4).join(". "),
    });
  });
  sources.forEach((source) => {
    items.push({
      type: "來源",
      title: source.title || source.name || "source",
      subtitle: source.url || "",
      text: `${source.title || ""} ${source.name || ""} ${source.use || ""} ${source.note || ""} ${source.url || ""}`,
      answer: source.use || source.note || source.url || "",
      audioText: "",
    });
  });
  knowledgeItems = items.map((item) => ({ ...item, normalized: normalizeText(`${item.title} ${item.subtitle} ${item.text}`) }));
}

function retrieveKnowledge(question, limit = 8) {
  const tokens = tokenize(question);
  const normalizedQuestion = normalizeText(question);
  return knowledgeItems
    .map((item) => {
      const tokenScore = tokens.reduce((score, token) => score + (item.normalized.includes(token) ? Math.max(2, token.length) : 0), 0);
      const exactScore = normalizedQuestion && item.normalized.includes(normalizedQuestion) ? 12 : 0;
      return { ...item, score: tokenScore + exactScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function forvoSearchUrl(text) {
  const cleaned = String(text || "")
    .replace(/[.!?。！？]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `https://forvo.com/search/${encodeURIComponent(cleaned)}/vi/`;
}

function googleTranslateTtsUrl(text) {
  return googleTranslateTtsUrls(text)[0];
}

function googleTranslateTtsUrls(text) {
  const query = encodeURIComponent(text);
  return [
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${query}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=vi&q=${query}`,
  ];
}

function googleTranslatePageUrl(article) {
  const text = (article?.paragraphs || []).map((line) => line.vn.trim()).filter(Boolean).join("\n");
  return `https://translate.google.com/?sl=vi&tl=zh-TW&text=${encodeURIComponent(text)}&op=translate`;
}

function googleTranslateTextUrl(text) {
  return `https://translate.google.com/?sl=vi&tl=zh-TW&text=${encodeURIComponent(String(text || "").trim())}&op=translate`;
}

function openPronunciationInGoogleTranslate() {
  const text = getPronunciationText();
  if (!text) {
    setPronunciationStatus("請先輸入越南文，再開 Google 翻譯。");
    return;
  }
  window.open(googleTranslateTextUrl(text), "_blank", "noopener,noreferrer");
  setPronunciationStatus("已開啟 Google 翻譯頁面。");
}

function getArticleAudioPlayer() {
  if (!articleAudioPlayer && typeof Audio !== "undefined") {
    articleAudioPlayer = new Audio();
    articleAudioPlayer.addEventListener("ended", playNextArticleAudioChunk);
    articleAudioPlayer.addEventListener("error", () => {
      const currentText = articleAudioQueue[articleAudioIndex - 1];
      const urls = googleTranslateTtsUrls(currentText || "");
      if (articleAudioSourceIndex + 1 < urls.length) {
        articleAudioSourceIndex += 1;
        articleAudioPlayer.src = urls[articleAudioSourceIndex];
        articleAudioPlayer.play().catch(() => {});
        return;
      }
      if (activeArticleAudioButton) {
        const failedButton = activeArticleAudioButton;
        failedButton.textContent = "播放失敗";
        failedButton.classList.remove("is-playing");
        window.setTimeout(() => resetArticleAudioButton(failedButton), 1400);
      }
      articleAudioQueue = [];
      articleAudioIndex = 0;
      articleAudioSourceIndex = 0;
    });
  }
  return articleAudioPlayer;
}

function getVietnameseSpeechVoice() {
  const vietnameseVoices = getVietnameseSpeechVoices();
  return vietnameseVoices.find((voice) => /google|microsoft|hoaimy|namminh/i.test(voice.name || "")) || vietnameseVoices[0] || null;
}

function chunkArticleForTts(article) {
  const lines = (article?.paragraphs || []).map((line) => line.vn.trim()).filter(Boolean);
  const chunksForTts = [];
  let current = "";
  const maxLength = 180;

  lines.forEach((line) => {
    const next = current ? `${current} ${line}` : line;
    if (next.length <= maxLength) {
      current = next;
      return;
    }
    if (current) chunksForTts.push(current);
    current = line;
  });

  if (current) chunksForTts.push(current);
  return chunksForTts;
}

function resetArticleAudioButton(button = activeArticleAudioButton) {
  if (!button) return;
  button.textContent = "▶ 播放";
  button.classList.remove("is-playing");
}

function stopArticleAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  articleSpeechUtterance = null;
  const player = getArticleAudioPlayer();
  if (player) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }
  articleAudioQueue = [];
  articleAudioIndex = 0;
  articleAudioSourceIndex = 0;
  resetArticleAudioButton();
  activeArticleAudioButton = null;
}

function playNextArticleSpeechChunk() {
  if (!("speechSynthesis" in window) || articleAudioIndex >= articleAudioQueue.length) {
    stopArticleAudio();
    return;
  }

  const text = articleAudioQueue[articleAudioIndex];
  articleAudioIndex += 1;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.pitch = 1;
  const voice = getVietnameseSpeechVoice();
  if (voice) utterance.voice = voice;
  utterance.addEventListener("end", () => {
    window.setTimeout(playNextArticleSpeechChunk, 120);
  });
  utterance.addEventListener("error", () => {
    articleAudioMode = "google";
    articleAudioIndex -= 1;
    playNextArticleAudioChunk();
  });
  articleSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  window.speechSynthesis.resume?.();
  window.setTimeout(() => window.speechSynthesis.resume?.(), 80);
}

function playNextArticleAudioChunk() {
  const player = getArticleAudioPlayer();
  if (!player || articleAudioIndex >= articleAudioQueue.length) {
    stopArticleAudio();
    return;
  }

  const text = articleAudioQueue[articleAudioIndex];
  articleAudioIndex += 1;
  articleAudioSourceIndex = 0;
  player.src = googleTranslateTtsUrl(text);
  player.play().catch(() => {
    const urls = googleTranslateTtsUrls(text);
    if (articleAudioSourceIndex + 1 < urls.length) {
      articleAudioSourceIndex += 1;
      player.src = urls[articleAudioSourceIndex];
      player.play().catch(() => {});
      return;
    }
    if (activeArticleAudioButton) {
      activeArticleAudioButton.textContent = "再按一次";
      activeArticleAudioButton.classList.remove("is-playing");
    }
  });
}

function playArticleAudio(articleId, button) {
  const article = articles.find((item) => item.id === articleId);
  if (!article) return;
  const player = getArticleAudioPlayer();

  const speechSpeaking = "speechSynthesis" in window && window.speechSynthesis.speaking;
  const audioPlaying = player && !player.paused;
  if (activeArticleAudioButton === button && (speechSpeaking || audioPlaying)) {
    stopArticleAudio();
    return;
  }
  stopArticleAudio();
  resetArticleAudioButton();
  activeArticleAudioButton = button;
  articleAudioQueue = chunkArticleForTts(article);
  articleAudioIndex = 0;
  articleAudioSourceIndex = 0;
  button.textContent = "■ 停止";
  button.classList.add("is-playing");
  articleAudioMode = "google";
  playNextArticleAudioChunk();
}

function normalizeAudioConfig(audio) {
  if (!audio) return null;
  if (typeof audio === "string") {
    return { src: audio, dialect: "southern", verified: true, provider: "local" };
  }
  return audio;
}

function renderAudioControls(text, audio, options = {}) {
  if (!text) return "";
  const showForvo = options.showForvo !== false;
  const audioConfig = normalizeAudioConfig(audio);
  const localAudio = audioConfig?.src
    ? `
      <div class="native-audio">
        <span class="pill">${audioConfig.dialect === "southern" && audioConfig.verified !== false ? "南越音檔" : "待確認音檔"}</span>
        <audio controls src="${escapeHtml(audioConfig.src)}"></audio>
      </div>
    `
    : "";
  const forvoLink = showForvo
    ? `
      <a class="small-button small-button--subtle" href="${forvoSearchUrl(text)}" target="_blank" rel="noreferrer">
        Forvo 真人參考
      </a>
    `
    : "";

  if (!localAudio && !forvoLink) return "";

  return `
    <div class="audio-tools">
      ${localAudio}
      ${forvoLink}
    </div>
  `;
}

function composeRagAnswer(question, matches) {
  if (!matches.length) {
    return {
      title: "目前資料庫找不到很接近的內容",
      bullets: [
        "可以換一個問法，或加入更多詞句/文法資料到 `data/content.json`。",
        "這版是本機檢索式 RAG 雛形，還沒有接雲端 LLM。",
      ],
    };
  }

  const top = matches[0];
  const pronunciationMatches = matches.filter((item) => item.type === "發音規則").slice(0, 3);
  const grammarMatches = matches.filter((item) => item.type === "文法").slice(0, 3);
  const vocabularyMatches = matches.filter((item) => item.type === "單詞").slice(0, 3);
  const phraseMatches = matches.filter((item) => item.type === "詞句" || item.type === "對話句").slice(0, 3);
  const articleMatches = matches.filter((item) => item.type === "文章" || item.type === "文章句").slice(0, 3);
  const profileMatches = matches.filter((item) => item.type === "學習者設定").slice(0, 1);
  const bullets = [];

  if (profileMatches.length) {
    bullets.push(profileMatches[0].answer);
  } else if (/南越.*口音|口音.*差|北越|發音差/.test(question) && pronunciationMatches.length) {
    bullets.push("南越口音最先要掌握三類：聲調、開頭子音、尾音。尤其 hỏi/ngã 常合流，d/gi/v 常接近 y，tr/ch 與 s/x 在很多南越口語裡會靠近。");
  } else {
    bullets.push(top.answer);
  }
  if (pronunciationMatches.length) {
    bullets.push(`相關南越發音重點：${pronunciationMatches.map((item) => item.title).join("、")}。`);
  }
  if (grammarMatches.length) {
    bullets.push(`相關核心文法：${grammarMatches.map((item) => item.title).join("、")}。`);
  }
  if (vocabularyMatches.length) {
    bullets.push(`相關單詞：${vocabularyMatches.map((item) => `「${item.title}」`).join("、")}。`);
  }
  if (phraseMatches.length) {
    bullets.push(`可以一起練的例句：${phraseMatches.map((item) => `「${item.title}」`).join("、")}。`);
  }
  if (articleMatches.length) {
    bullets.push(`相關閱讀短文：${articleMatches.map((item) => `「${item.title}」`).join("、")}。`);
  }
  bullets.push("這個回答目前只根據本機教材庫整理；下方卡片就是它引用到的內容。之後接 embeddings + LLM 時，這些引用會變成模型回答的 context。");

  return {
    title: `根據知識庫回答：${question}`,
    bullets,
  };
}

function renderRagExamples() {
  if (!document.querySelector("#ragExamples")) return;
  const examples = ["南越口音差在哪？", "quẹo 是什麼意思？", "這句 Cho em hỏi 怎麼用？", "hỏi 和 ngã 怎麼聽？", "nha 怎麼用？", "mắc 有什麼例句？"];
  document.querySelector("#ragExamples").innerHTML = examples
    .map((example) => `<button class="rag-chip" type="button" data-rag-example="${example}">${example}</button>`)
    .join("");

  document.querySelectorAll("[data-rag-example]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#ragQuestion").value = button.dataset.ragExample;
      answerRagQuestion();
    });
  });
}

function setRagTtsStatus(message) {
  const status = document.querySelector("#ragTtsStatus");
  if (status) status.textContent = message;
}

function cleanRagAudioText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function registerRagTtsText(text) {
  const cleanText = cleanRagAudioText(text);
  if (!cleanText) return "";
  ragTtsSnippets.push(cleanText);
  return String(ragTtsSnippets.length - 1);
}

function renderRagTtsButton(snippetIndex, label = "播放越南文") {
  if (snippetIndex === "") return "";
  return `<button class="rag-audio-button" type="button" data-rag-tts="${escapeHtml(snippetIndex)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">▶</button>`;
}

function resetRagAudioButton(button = activeRagAudioButton) {
  if (!button) return;
  button.textContent = "▶";
  button.title = "播放越南文";
  button.setAttribute("aria-label", "播放越南文");
  button.classList.remove("is-playing");
  button.disabled = false;
}

function getRagAudioPlayer() {
  if (!ragAudioPlayer && typeof Audio !== "undefined") {
    ragAudioPlayer = new Audio();
    ragAudioPlayer.addEventListener("ended", playNextRagTtsChunk);
    ragAudioPlayer.addEventListener("error", () => {
      setRagTtsStatus("RAG 引用播放失敗，請確認 VieNeu-TTS 服務是否啟動。");
      stopRagTts();
    });
  }
  return ragAudioPlayer;
}

function stopRagTts() {
  const player = getRagAudioPlayer();
  if (player) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }
  if (ragAudioObjectUrl) {
    URL.revokeObjectURL(ragAudioObjectUrl);
    ragAudioObjectUrl = "";
  }
  ragAudioQueue = [];
  ragAudioIndex = 0;
  resetRagAudioButton();
  activeRagAudioButton = null;
}

function playRagTtsSnippet(index, button) {
  const text = ragTtsSnippets[Number(index)] || "";
  if (!text) {
    setRagTtsStatus("這張知識卡沒有可朗讀的越南文。");
    return;
  }
  if (activeRagAudioButton === button && button.classList.contains("is-playing")) {
    stopRagTts();
    setRagTtsStatus("已停止 RAG 引用播放。");
    return;
  }

  if (isStaticHosted) {
    window.open(googleTranslateTextUrl(text), "_blank", "noopener,noreferrer");
    setRagTtsStatus("GitHub Pages 不能啟動本機 VieNeu-TTS，已改開 Google 翻譯頁面。");
    return;
  }

  stopArticleAudio();
  stopPronunciationTts();
  stopRagTts();
  ragAudioQueue = chunkTextForTts(text, 220);
  ragAudioIndex = 0;
  activeRagAudioButton = button;
  button.textContent = "■";
  button.title = "停止播放";
  button.setAttribute("aria-label", "停止播放");
  button.classList.add("is-playing");
  setRagTtsStatus("正在請 VieNeu-TTS 產生 RAG 引用音檔。");
  playNextRagTtsChunk();
}

async function playNextRagTtsChunk() {
  const player = getRagAudioPlayer();
  if (!player || ragAudioIndex >= ragAudioQueue.length) {
    stopRagTts();
    setRagTtsStatus("RAG 引用播放完成。");
    return;
  }

  const text = ragAudioQueue[ragAudioIndex];
  ragAudioIndex += 1;
  const rate = getPronunciationRate();
  try {
    const response = await fetch("/api/vieneu/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text,
        voice_id: getSelectedVieneuVoiceId(),
      }),
    });

    if (!response.ok) {
      let message = "VieNeu-TTS 服務尚未啟動或產生失敗。";
      try {
        const detail = await response.json();
        if (detail?.error) message = detail.error;
      } catch {}
      setRagTtsStatus(message);
      stopRagTts();
      return;
    }

    const blob = await response.blob();
    if (ragAudioObjectUrl) URL.revokeObjectURL(ragAudioObjectUrl);
    ragAudioObjectUrl = URL.createObjectURL(blob);
    player.src = ragAudioObjectUrl;
    const safeRate = applySafePlaybackRate(player, rate);
    const cacheHint = response.headers.get("x-vieneu-cache") === "hit" ? "快取" : "新產生";
    setRagTtsStatus(`RAG 引用播放中（${ragAudioIndex}/${ragAudioQueue.length}，${safeRate.toFixed(2)}x，${cacheHint}）。`);
    await player.play();
  } catch {
    setRagTtsStatus("無法連到本機 VieNeu-TTS 服務。");
    stopRagTts();
  }
}

function bindRagTtsButtons() {
  document.querySelectorAll("[data-rag-tts]").forEach((button) => {
    button.addEventListener("click", () => playRagTtsSnippet(button.dataset.ragTts, button));
  });
}

function answerRagQuestion() {
  if (!document.querySelector("#ragQuestion")) return;
  const question = document.querySelector("#ragQuestion").value.trim();
  ragTtsSnippets = [];
  stopRagTts();
  if (!question) {
    document.querySelector("#ragAnswer").innerHTML = `
      <p class="eyebrow">Answer</p>
      <h3>先輸入問題</h3>
      <p>例如：南越口音差在哪？這句怎麼用？</p>
    `;
    document.querySelector("#ragResults").innerHTML = "";
    setRagTtsStatus("RAG 引用卡可播放越南文片段，使用 VieNeu-TTS 與安全速度。");
    return;
  }

  const matches = retrieveKnowledge(question);
  const answer = composeRagAnswer(question, matches);
  const answerAudioIndex = registerRagTtsText(matches.map((item) => item.audioText).filter(Boolean).slice(0, 4).join(". "));
  document.querySelector("#ragAnswer").innerHTML = `
    <p class="eyebrow">Answer</p>
    <div class="rag-title-row">
      <h3>${escapeHtml(answer.title)}</h3>
      ${renderRagTtsButton(answerAudioIndex, "播放回答引用")}
    </div>
    <ul>${answer.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
  `;

  document.querySelector("#ragResults").innerHTML = matches
    .map(
      (item) => {
        const audioIndex = registerRagTtsText(item.audioText);
        return `
        <article class="rag-card">
          <div class="rag-card__head">
            <div class="meta-row">
              <span class="pill">${escapeHtml(item.type)}</span>
              <span class="pill pill--review">score ${escapeHtml(item.score)}</span>
            </div>
            ${renderRagTtsButton(audioIndex)}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.subtitle)}</p>
        </article>
      `;
      }
    )
    .join("");
  setRagTtsStatus(matches.some((item) => item.audioText) ? "可按引用卡右上角播放越南文片段。" : "這次結果沒有可朗讀的越南文片段。");
  bindRagTtsButtons();
}

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  chunks = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.addEventListener("dataavailable", (event) => chunks.push(event.data));
  mediaRecorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    document.querySelector("#playback").src = URL.createObjectURL(blob);
    stream.getTracks().forEach((track) => track.stop());
  });
  mediaRecorder.start();
  document.querySelector("#recordButton").disabled = true;
  document.querySelector("#stopButton").disabled = false;
  if (!recordTarget) {
    document.querySelector("#recordHint").textContent = "正在錄音。建議先從資料庫選一句目標句。";
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  document.querySelector("#recordButton").disabled = false;
  document.querySelector("#stopButton").disabled = true;
}

function bindEvents() {
  window.addEventListener("hashchange", () => routeTo());
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      document.querySelectorAll(".nav-group").forEach((otherGroup) => {
        if (otherGroup !== group) otherGroup.removeAttribute("open");
      });
    });
  });
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest(".nav-group")?.removeAttribute("open");
    });
  });
  document.querySelector("#searchInput")?.addEventListener("input", renderPhrases);
  document.querySelector("#vocabSearchInput")?.addEventListener("input", renderVocabulary);
  document.querySelector("#articleSearchInput")?.addEventListener("input", renderArticles);
  document.querySelector("#pronunciationInput")?.addEventListener("input", renderPronunciationHints);
  document.querySelector("#pronunciationPlayButton")?.addEventListener("click", playPronunciationWithVieneu);
  document.querySelector("#pronunciationFallbackButton")?.addEventListener("click", openPronunciationInGoogleTranslate);
  document.querySelector("#pronunciationStopButton")?.addEventListener("click", stopPronunciationTts);
  document.querySelector("#pronunciationRate")?.addEventListener("input", renderPronunciationRateLabel);
  document.querySelector("#pronunciationVoiceSelect")?.addEventListener("change", () => {
    const voice = getSelectedPronunciationVoice();
    setPronunciationStatus(voice ? `已選擇語音：${voice.name}。` : "使用自動 vi-VN 語音。");
  });
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener?.("voiceschanged", renderPronunciationVoiceOptions);
  }
  document.querySelector("#ragAskButton")?.addEventListener("click", answerRagQuestion);
  document.querySelector("#ragQuestion")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      answerRagQuestion();
    }
  });
  document.querySelector("#recordButton")?.addEventListener("click", () => {
    startRecording().catch(() => {
      document.querySelector("#recordHint").textContent = "瀏覽器沒有開啟麥克風權限；請用 localhost 開啟並允許錄音。";
    });
  });
  document.querySelector("#stopButton")?.addEventListener("click", stopRecording);
}

function renderApp() {
  migrateReviewState();
  buildKnowledgeBase();
  applyPageQueryDefaults();
  renderRoutine();
  renderLearnerProfile();
  renderQuickLinks();
  renderTones();
  renderLessons();
  renderGrammar();
  renderVocabFilters();
  renderVocabulary();
  renderFilters();
  renderPhrases();
  renderArticleFilters();
  renderArticles();
  renderScenarioMap();
  renderPronounCoach();
  renderPronounScenarios();
  renderPronounRules();
  renderMistakeRadar();
  renderMistakeRepairLines();
  renderReviewBox();
  renderRagExamples();
  renderPronunciationLab();
  renderAudio();
  renderSources();
  saveState();
  routeTo();
  initCompanionWidget();
}

loadContent()
  .then(() => {
    bindEvents();
    renderApp();
  })
  .catch((error) => {
    document.querySelector("main").innerHTML = `
      <section class="section">
        <div class="panel">
          <h2>資料庫載入失敗</h2>
          <p>${error.message}</p>
          <p>請確認你是透過 <code>http://localhost:5178</code> 開啟，而不是直接打開 HTML 檔。</p>
        </div>
      </section>
    `;
  });
