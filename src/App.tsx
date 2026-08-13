import { useEffect, useState, type MouseEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  CircleHelp,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Scale,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import heroImage from "../assets/images/首页图片.png";
import ucasSlide from "../assets/images/ucas_slide.png";
import bgiSlide from "../assets/images/bgi_slide.png";

const notice = "学生整理，非官方信息，仅供参考；请以当年官方招生文件为准。";

const navItems = [
  ["首页", "home"],
  ["2026 报考样本", "sample"],
];

const cardItems = [
  ["项目身份", "identity"],
  ["培养路径", "training"],
  ["考试与复试", "exam"],
  ["优势与缺点", "tradeoffs"],
];

const scoreRows = [
  { range: "240-249分", applied: 1, accepted: 0, note: "（少干计划）" },
  { range: "290-299分", applied: 2, accepted: 0 },
  { range: "300-309分", applied: 5, accepted: 2 },
  { range: "310-319分", applied: 1, accepted: 1 },
  { range: "320-329分", applied: 2, accepted: 2 },
  { range: "330-339分", applied: 7, accepted: 6 },
  { range: "340-349分", applied: 3, accepted: 3 },
  { range: "350-359分", applied: 2, accepted: 1 },
  { range: "360-369分", applied: 1, accepted: 1 },
  { range: "370-379分", applied: 2, accepted: 2 },
];

const subjectStatGroups = [
  {
    title: "全体考生统计",
    count: 26,
    tone: "all",
    rows: [
      { subject: "专硕・专业课", high: 113, low: 56, median: 90 },
      { subject: "专硕・政治", high: 71, low: 45, median: 55 },
      { subject: "专硕・数学二", high: 131, low: 85, median: 111 },
      { subject: "专硕・英语二", high: 88, low: 53, median: 76 },
    ],
  },
  {
    title: "被录取考生专项统计",
    count: 18,
    tone: "accepted",
    rows: [
      { subject: "专硕・专业课", high: 113, low: 73, median: 94 },
      { subject: "专硕・政治", high: 71, low: 50, median: 57.5 },
      { subject: "专硕・数学二", high: 131, low: 99, median: 118 },
      { subject: "专硕・英语二", high: 88, low: 61, median: 77.5 },
    ],
  },
] as const;

function ScoreDistributionChart() {
  const maxCount = 8;
  const width = 920;
  const height = 310;
  const pad = { top: 32, right: 26, bottom: 62, left: 44 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const groupWidth = plotWidth / scoreRows.length;
  const countY = (value: number) =>
    pad.top + plotHeight - (value / maxCount) * plotHeight;
  const rateY = (value: number) =>
    pad.top + plotHeight - (value / 100) * plotHeight;
  const ratePoints = scoreRows
    .map(
      (row, index) =>
        `${pad.left + groupWidth * (index + 0.5)},${rateY(row.applied ? (row.accepted / row.applied) * 100 : 0)}`,
    )
    .join(" ");

  return (
    <section className="score-chart" aria-labelledby="score-chart-title">
      <div className="score-chart-heading">
        <div>
          <p className="score-chart-kicker">分数段概览</p>
          <h3 id="score-chart-title">初试分数与录取情况</h3>
        </div>
        <div className="score-chart-legend" aria-label="图例">
          <span>
            <i className="legend-applied" />
            报考人数
          </span>
          <span>
            <i className="legend-accepted" />
            录取人数
          </span>
          <span>
            <i className="legend-rate" />
            分段录取率
          </span>
        </div>
      </div>
      <div className="score-chart-scroll">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="各初试分数段的报考人数、录取人数和分段录取率柱线图"
        >
          {[0, 2, 4, 6, 8].map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={countY(tick)}
                y2={countY(tick)}
                className="chart-grid-line"
              />
              <text
                x={pad.left - 10}
                y={countY(tick) + 4}
                className="chart-axis-label"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          ))}
          <text x={pad.left} y={18} className="chart-axis-title">
            人数
          </text>
          <text
            x={width - pad.right}
            y={18}
            className="chart-axis-title"
            textAnchor="end"
          >
            录取率
          </text>
          {scoreRows.map((row, index) => {
            const x = pad.left + groupWidth * index;
            const center = x + groupWidth / 2;
            const appliedX = center - 19;
            const acceptedX = center + 3;
            return (
              <g key={row.range} className="chart-group">
                <title>{`${row.range}：报考 ${row.applied} 人，录取 ${row.accepted} 人，录取率 ${row.applied ? Math.round((row.accepted / row.applied) * 100) : 0}%`}</title>
                <rect
                  x={appliedX}
                  y={countY(row.applied)}
                  width="16"
                  height={pad.top + plotHeight - countY(row.applied)}
                  className="chart-bar-applied"
                />
                <rect
                  x={acceptedX}
                  y={countY(row.accepted)}
                  width="16"
                  height={pad.top + plotHeight - countY(row.accepted)}
                  className="chart-bar-accepted"
                />
                <text
                  x={center}
                  y={height - 25}
                  className="chart-x-label"
                  textAnchor="middle"
                >
                  {row.range.replace("分", "")}
                </text>
              </g>
            );
          })}
          <polyline points={ratePoints} className="chart-rate-line" />
          {scoreRows.map((row, index) => {
            const x = pad.left + groupWidth * (index + 0.5);
            const rate = row.applied ? (row.accepted / row.applied) * 100 : 0;
            return (
              <circle
                key={row.range}
                cx={x}
                cy={rateY(rate)}
                r="4"
                className="chart-rate-dot"
              />
            );
          })}
        </svg>
      </div>
      <p className="chart-caption">
        柱形表示各分数段报考与录取人数，折线表示该分数段录取率。
      </p>
    </section>
  );
}

const qaItems = [
  [
    "什么样的情况不适合报考华大专项？",
    "有名校情结的慎重报，在国科大无论是本科生还是研究生都有后悔没去 92 的，所以一定想清楚了再报，不要入学了再后悔。其次对学术有较高追求的也慎重报考，华大这里有的组偏学术，有的组偏工程，整体上来说还是偏工程，尤其是之后想入职高校的，华大导师基本给不了太多的帮助。除非你转生物方向或生信方向。生信方向的学术大牛很多。",
  ],
  [
    "华大的学习地点？",
    "前半年在北京，后面 2.5 年在北京、深圳、杭州、青岛、海南、武汉等地，具体在哪要看自己的组在哪办公。",
  ],
  ["考什么？", "北京 22408"],
  [
    "华大的名额？",
    "按照这两届来看基本是 30 到 15 之间，如果保研没保满则剩下的名额分给考研的，直博不占硕士名额。",
  ],
  [
    "如果没考上华大专项可以调剂非全么？",
    "可以，而且会在华大这边出录取名单之前就先告诉你华大没录取，可以选择调剂非全。前提是今年非全招的不好，有很多名额剩余。",
  ],
  [
    "需不需要提前联系导师？",
    "不需要，华大的录取方式是复试完定好录取哪些人之后再选导师。华大的导师手底下有员工，不缺一个打工的学生，有没有都一样，导师不会关心你是否会被录取，所以提前联系导师没有一点用处，其次录取完全由华大教育学院决定，导师属于华大研究院，在公司里属于两个不同的部门，所以导师无权干涉录取结果（除非你很 nb 能联系到领导）。",
  ],
  [
    "华大做什么？",
    "没有纯计算机的组，主要以生信为主，其次还有测序仪相关的业务。生信主要是华大研究院和华大股份在做，生信分为算法和生信分析，生信分析比较偏重数据处理和生物学解释，生信算法以数据去噪、增强等为主，也有一些组会以深度学习为主；测序仪主要是华大智造在做，主要是硬件开发，对嵌入式感兴趣的可以考虑华大智造。",
  ],
  [
    "华大的深度学习做什么？",
    "有的组做大模型，有的组做传统的深度学习。大部分使用的都是 nlp 领域的模型，会根据需求进行预训练或微调，做 cv 的较少在华大看来深度学习方法不是研究内容只是工具，只需要针对具体的问题选择合适模型就行，至于模型的架构、实现方法等完全不关心，如果想在组里做深度学习相关的那么需要提前想好你做的这个东西对组里目前的项目有没有帮助？做的东西即使准确率提升了但相比于传统方法效率和稳定性是否提升了？是否需要庞大的硬件资源支持？靠一个人是否能把研究推动下去？考虑好这些才有可能得到组里的支持。华大的大模型目前主要是处理长序列数据，并且做大模型的组方向比较重叠，等双选时可以深入了解，不过这都是后话了。",
  ],
  [
    "华大发什么论文？",
    "以期刊类文章为主，想发计算机会议靠自己，华大除个别组外，对发计算机会议不提供任何支持。华大只关心大文章（例如 CNS 和子刊）和大项目，小的期刊文章对华大来说没有帮助而且还要华大掏版面费。顺带一提虽然生信类的期刊也有做深度学习的，但是和计算机会议对比就能发现差别，生信期刊还是侧重结果，深度学习方法只是工具，不会有太多方法创新，而计算机会议更注重方法创新。",
  ],
  [
    "华大的计算资源？",
    "CPU 类型的服务器管够（但是很难用），GPU 目前不富裕，一般会使用武汉超算中心的 A100 or 崖州湾集群，极少有组有自己的八卡服务器。也有个别组通过合作获得了丰富的 GPU 资源，总体上来说不碰预训练就是够的。",
  ],
  [
    "华大的补助？",
    "在北京时：国科大 400+AI 院 250+国家 600+华大 2000\n回华大后：国科大 400+AI 院 250+国家 600+华大 3300\n除此之外每年有全覆盖的 6000 奖学金\n研二国科大 400 不发了，华大涨 500.",
  ],
  ["华大的毕业条件？", "没要求，修够学分完成毕业论文即可。"],
  [
    "华大的优势？",
    "个人认为最大的优势是可以自由更换导师，不像高校里那么严格，所以不怕遇到差导。其次就是有较多的学习地点可选，还有就是适合躺平混学历（躺平不要去纯生信的组）。",
  ],
  ["华大的生源？", "第一届收 92 对半\n第二届 92 和双非对半"],
  [
    "什么背景比较稳？",
    "本科越好对专业相关性的要求越低，9 本可以跨专业，双非需要专业强相关，如果是一本以下还需要项目经验，例如从事过互联网企业的工作。华大对学历没有歧视，本质上还是要收能干活能创造价值的学生，不要用看待学校的眼光看待华大，华大只保你毕业，至于教书育人那不是华大的本职工作。",
  ],
  [
    "学费标准？",
    "按照国科大全日制的标准 8000/年，在北京只收半年住宿费，回华大后免住宿费。",
  ],
  ["入学后英语免修标准？", "英二75分"],
  [
    "毕业证和学位证？",
    "发国科大的毕业证和学位证，人工智能专业（085410），非定向，毕业证和学位证均不会出现华大的字样，也没有华大的章。",
  ],
  [
    "可以硕转博么？",
    "可以，需要在硕转博之前修够学分，之后走按国科大的要求通过考核即可。但是名额有限。",
  ],
  ["毕业后可以留华大么？", "可以留华大，但是也是要走正常校招社招。"],
  ["华大有士兵计划么？", "有的，咨询招生老师即可"],
  ["华大放实习么？", "原则上不放实习，按华大老师的说法：在华大就算是实习了"],
  [
    "华大工作时间？",
    "早 9:00-11:30，下午 14:00-18:00，大部分组不打卡，但是基本上都会偶尔加班。",
  ],
  ["华大的寒暑假多长？", "规定寒假+暑假一共 5 天（具体看导师）"],
] as const;

function Notice({ inverse = false }: { inverse?: boolean }) {
  return (
    <p className={`notice ${inverse ? "notice-inverse" : ""}`}>
      <ShieldAlert size={14} />
      {notice}
    </p>
  );
}
function Eyebrow({ children }: { children: string }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionHeader({
  icon: Icon,
  index,
  title,
  titleClassName,
  children,
  onClick,
}: {
  icon: typeof BookOpen;
  index: string;
  title: string;
  titleClassName?: string;
  children?: string;
  onClick?: () => void;
}) {
  return (
    <header
      className={`section-header ${onClick ? "section-return" : ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `返回${title}` : undefined}
    >
      <span className="section-icon">
        <Icon size={22} />
      </span>
      <div>
        <Eyebrow>{index}</Eyebrow>
        <h2 className={titleClassName}>{title}</h2>
        {children && <p>{children}</p>}
      </div>
    </header>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onClick,
}: {
  question: string;
  answer: string;
  open: boolean;
  onClick: () => void;
}) {
  const moveSpotlight = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - bounds.top}px`,
    );
  };
  return (
    <article
      onMouseMove={moveSpotlight}
      className={`faq-item ${open ? "is-open" : ""}`}
    >
      <button onClick={onClick} aria-expanded={open} className="faq-question">
        <span>{question}</span>
        <ChevronDown size={18} />
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqGroup, setFaqGroup] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [cardRailVisible, setCardRailVisible] = useState(false);
  const [page, setPage] = useState(() =>
    window.location.hash === "#sample" ? "sample" : "home",
  );
  const scrollToCard = (id: string) => {
    document.documentElement.classList.add("card-jump");
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target)
        window.scrollTo({
          top: window.scrollY + target.getBoundingClientRect().top - 84,
          behavior: "smooth",
        });
      window.setTimeout(
        () => document.documentElement.classList.remove("card-jump"),
        650,
      );
    });
  };
  const navigate = (id: string) => {
    setMenuOpen(false);
    if (id === "home" || id === "sample") {
      const nextPage = id === "sample" ? "sample" : "home";
      window.history.pushState(
        null,
        "",
        nextPage === "sample" ? "#sample" : window.location.pathname,
      );
      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (page !== "home") {
      window.history.pushState(null, "", window.location.pathname);
      setPage("home");
      requestAnimationFrame(() => scrollToCard(id));
      return;
    }
    scrollToCard(id);
  };
  const faqGroups = [
    { label: "综合问题", items: qaItems.slice(0, 8) },
    { label: "报考与录取", items: qaItems.slice(8, 16) },
    { label: "培养与体验", items: qaItems.slice(16) },
  ];

  useEffect(() => {
    const platform = document.querySelector(".platform-cards");
    if (!platform) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardRailVisible(entry.isIntersecting),
      { threshold: 0.04 },
    );
    observer.observe(platform);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncPage = () =>
      setPage(window.location.hash === "#sample" ? "sample" : "home");
    window.addEventListener("popstate", syncPage);
    window.addEventListener("hashchange", syncPage);
    return () => {
      window.removeEventListener("popstate", syncPage);
      window.removeEventListener("hashchange", syncPage);
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>
      <nav className="site-nav" aria-label="站内导航">
        <button
          onClick={() => navigate("home")}
          className="brand-name"
          aria-label="回到首页"
        >
          <Sparkles size={16} />
          华大联培报考指南
        </button>
        <div className="nav-links">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => navigate(id)}>
              {label}
            </button>
          ))}
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {menuOpen && (
          <div className="mobile-nav">
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => navigate(id)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>
      <main
        id="main"
        className={page === "sample" ? "sample-page" : "home-page"}
      >
        <section
          className="hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-shade" />
          <div className="hero-caption">
            <Eyebrow>华大报考指南</Eyebrow>
            <h1 className="hero-title">
              <span>中国科学院大学</span>
              <span>人工智能学院</span>
              <span>华大基因联培</span>
            </h1>
            <button onClick={() => navigate("identity")} className="hero-link">
              开始阅读 <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-notice">
            <Notice />
          </div>
          <button
            onClick={() => navigate("identity")}
            className="hero-down"
            aria-label="向下浏览"
          >
            <ArrowDown size={18} />
          </button>
        </section>

        <div className="content-stage">
          <div className="content-side-rails" aria-hidden="true">
            <img src={ucasSlide} alt="" />
            <img src={bgiSlide} alt="" />
          </div>
          <div className="content-main">
            <div className="platform-cards">
              <aside
                className={`card-rail ${cardRailVisible ? "is-visible" : ""}`}
                aria-label="章节卡片导航"
              >
                <p>章节导航</p>
                {cardItems.map(([label, id], index) => (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    aria-label={`前往${label}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {label}
                  </button>
                ))}
              </aside>
              <section id="identity" className="content-section">
                <div className="content-wrap">
                  <SectionHeader
                    icon={Building2}
                    index="01 / 项目身份"
                    title="华大的基本介绍"
                    onClick={() => navigate("identity")}
                  />
                  <div className="key-facts key-facts-featured">
                    <p className="key-facts-title">
                      学籍归属：中国科学院大学人工智能学院
                    </p>
                    <ul>
                      <li>
                        <strong>项目性质</strong>
                        <span>人工智能学院与华大基因公司的联合培养项目。</span>
                      </li>
                      <li>
                        <strong>录取与在读信息</strong>
                        <span>
                          录取通知书、学生证和学信网信息均显示人工智能学院。
                        </span>
                      </li>
                      <li>
                        <strong>毕业证书</strong>
                        <span>毕业证不出现“华大基因”字样。</span>
                      </li>
                    </ul>
                  </div>
                  <Notice />
                </div>
              </section>

              <section id="training" className="content-section section-mist">
                <div className="content-wrap">
                  <SectionHeader
                    icon={GraduationCap}
                    index="02 / 培养路径"
                    title="培养方式"
                    onClick={() => navigate("training")}
                  />
                  <div className="key-facts">
                    <p className="key-facts-title">
                      先在北京培养一学期，后续自主选择联培或科研路径
                    </p>
                    <ul>
                      <li>
                        <strong>研一上学期</strong>
                        <span>
                          在北京中国科学院大学玉泉路校区培养一个学期。
                        </span>
                      </li>
                      <li>
                        <strong>后续安排</strong>
                        <span>
                          可在华大基因公司进行联培学习，或自行联系中国科学院大学导师进行科研。
                        </span>
                      </li>
                      <li>
                        <strong>联培地点</strong>
                        <span>华大基因公司培养可自选基地。</span>
                      </li>
                    </ul>
                  </div>
                  <p className="list-label">可选培养基地</p>
                  <ul className="location-list">
                    <li>
                      <MapPin size={18} />
                      华大基因公司深圳总部（盐田区梅沙街道 大梅沙景区）
                    </li>
                    <li>
                      <MapPin size={18} />
                      华大基因北京创新研究院（中关村科学城东升科技园）
                    </li>
                    <li>
                      <MapPin size={18} />
                      华大基因武汉研究院（东湖新技术开发区高新大道）
                    </li>
                    <li>
                      <MapPin size={18} />
                      华大基因三亚研究院（崖州区崖州湾科技城）
                    </li>
                    <li>
                      <MapPin size={18} />
                      华大基因杭州研究院（西湖区振中路）
                    </li>
                    <li>
                      <MapPin size={18} />
                      华大基因青岛研究院（黄岛区团结路）
                    </li>
                  </ul>
                  <Notice />
                </div>
              </section>

              <section
                id="sample"
                className={`content-section sample-standalone ${page === "sample" ? "is-current-page" : ""}`}
              >
                <div className="content-wrap">
                  <SectionHeader
                    icon={BarChart3}
                    index="03 / 2026 报考样本"
                    title="26报考数据"
                    onClick={() => navigate("sample")}
                  />
                  <div className="sample-meta">
                    <span>考试科目为22408</span>
                    <span>历史样本</span>
                  </div>
                  <ScoreDistributionChart />
                  <div className="score-table">
                    <table>
                      <thead>
                        <tr>
                          <th>初试分数段</th>
                          <th>报考人数</th>
                          <th>录取人数</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scoreRows.map(({ range, applied, accepted, note }) => (
                          <tr key={range}>
                            <td>{range}</td>
                            <td>报考 {applied} 人</td>
                            <td>
                              录取 {accepted} 人{note}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="stat-grid">
                    <article>
                      <span>录取最低分</span>
                      <strong>301分</strong>
                    </article>
                    <article>
                      <span>录取最高分</span>
                      <strong>375分</strong>
                    </article>
                    <article>
                      <span>录取中位数</span>
                      <strong>336分</strong>
                    </article>
                    <article>
                      <span>复录比</span>
                      <strong>1.44</strong>
                    </article>
                  </div>
                  <div className="subject-stat-groups">
                    {subjectStatGroups.map((group) => (
                      <section
                        className={`subject-stat-group subject-stat-${group.tone}`}
                        key={group.title}
                      >
                        <header>
                          <div>
                            <p>单科成绩</p>
                            <h3>{group.title}</h3>
                          </div>
                          <span>{group.count} 人</span>
                        </header>
                        <div className="subject-stat-grid">
                          {group.rows.map((row) => (
                            <article key={row.subject}>
                              <h4>{row.subject}</h4>
                              <dl>
                                <div>
                                  <dt>最高</dt>
                                  <dd>{row.high}</dd>
                                </div>
                                <div>
                                  <dt>最低</dt>
                                  <dd>{row.low}</dd>
                                </div>
                                <div>
                                  <dt>中位</dt>
                                  <dd>{row.median}</dd>
                                </div>
                              </dl>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <Notice />
                </div>
              </section>

              <section id="exam" className="content-section section-mist">
                <div className="content-wrap">
                  <SectionHeader
                    icon={FileText}
              index="03 / 考试与复试"
                    title="初复试占比"
                    onClick={() => navigate("exam")}
                  />
                  <div className="key-facts">
                    <p className="key-facts-title">
                      初试与复试各占 50%，复试为纯面试考察
                    </p>
                    <ul>
                      <li>
                        <strong>985、211 本科</strong>
                        <span>
                          在复试中通常更有优势，无论是否科班，建议结合自身情况报考。
                        </span>
                      </li>
                      <li>
                        <strong>双非本科</strong>
                        <span>需要在复试中凭竞争力脱颖而出。</span>
                      </li>
                      <li>
                        <strong>近年趋势</strong>
                        <span>从今年情况看，录取呈现保护高分的趋势。</span>
                      </li>
                    </ul>
                  </div>
                  <Notice />
                </div>
              </section>

              <section id="tradeoffs" className="content-section">
                <div className="content-wrap">
                  <SectionHeader
                    icon={Scale}
              index="04 / 华大基因优势与缺点"
                    title="华大基因优势"
                    onClick={() => navigate("tradeoffs")}
                  />
                  <div className="benefit-grid">
                    <article>
                      <h3>培养节奏相对轻</h3>
                      <p>
                        科研压力相对较小，常规作息为朝九晚六、周末双休，拥有更多时间探索感兴趣的就业方向。
                      </p>
                    </article>
                    <article>
                      <h3>开题前可转组</h3>
                      <p>
                        目标组愿意接收的前提下，可在开题前自由转组，降低与导师不匹配的风险。
                      </p>
                    </article>
                    <article>
                      <h3>补助较多</h3>
                      <p>
                        华大学费全免；研究生上学期每月补助为 3900
                        元，之后每年增加 500 元。
                      </p>
                    </article>
                    <article>
                      <h3>AI 研究覆盖广</h3>
                      <p>
                        除生物科技方向外，也覆盖 Agent、LLM、具身智能机械臂
                        VLA、AI Infra 等前沿方向。
                      </p>
                    </article>
                  </div>
                  <div className="drawback">
                    <h3>需要提前知道的限制</h3>
                    <p>
                      <strong>日常实习：</strong>
                      企业联培原则上不放日常实习；与导师协商后，多数情况下可安排研二暑期实习。
                    </p>
                  </div>
                  <button
                    className="sample-page-link"
                    onClick={() => navigate("sample")}
                  >
                    查看 2026 报考样本 <ArrowRight size={17} />
                  </button>
                  <Notice />
                </div>
              </section>
            </div>

            <section id="faq" className="faq-section">
              <div className="content-wrap">
                <SectionHeader
                  icon={CircleHelp}
              index="05 / 完整 Q&A"
                  title="华大基因Q&A（感谢华大憨批哥，Arch，Ceyan整理）"
                  titleClassName="faq-title-inline"
                />
                <p className="faq-intro"></p>
                <div className="faq-layout">
                  <aside className="faq-side">
                    <div className="faq-categories" role="tablist">
                      {faqGroups.map((group, index) => (
                        <button
                          key={group.label}
                          role="tab"
                          aria-selected={faqGroup === index}
                          className={faqGroup === index ? "is-active" : ""}
                          onClick={() => {
                            setFaqGroup(index);
                            setOpenFaq(-1);
                          }}
                        >
                          <span>{group.label}</span>
                          <ArrowRight size={15} />
                        </button>
                      ))}
                    </div>
                    <div className="faq-contact">
                      <Mail size={20} />
                      <h3>仍有问题？</h3>
                      <p>
                        本站不提供官方咨询。涉及报考资格、招生名额和政策变动的问题，请联系当年招生单位。
                      </p>
                      <a href="mailto:admissions@bgi.com">
                        联系招生单位 <ArrowRight size={15} />
                      </a>
                    </div>
                  </aside>
                  <div className="faq-list" role="tabpanel">
                    {faqGroups[faqGroup].items.map(
                      ([question, answer], index) => (
                        <FaqItem
                          key={question}
                          question={question}
                          answer={answer}
                          open={openFaq === index}
                          onClick={() =>
                            setOpenFaq(openFaq === index ? -1 : index)
                          }
                        />
                      ),
                    )}
                  </div>
                </div>
                <Notice inverse />
              </div>
            </section>
            <section
              className="community-section"
              aria-labelledby="community-title"
            >
              <div className="community-card">
                <div className="community-group">
                  <MessageCircle size={26} aria-hidden="true" />
                  <div>
                    <p className="eyebrow">交流社群</p>
                    <h2 id="community-title">点击加入华大 QQ 交流群</h2>
                    <span>群号：946372576</span>
                  </div>
                  <a
                    className="community-join"
                    href="https://qun.qq.com/join.html?gc=946372576"
                    target="_blank"
                    rel="noreferrer"
                  >
                    加入群聊 <ArrowRight size={16} />
                  </a>
                </div>
                <div className="friend-links" aria-label="友链">
                  <p>友链</p>
                  <a
                    href="https://iie.cskaoyan.cn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    中科院信工所报考指南 <ArrowRight size={15} />
                  </a>
                  <a
                    href="https://iscas.cskaoyan.cn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    中科院软件所报考指南 <ArrowRight size={15} />
                  </a>
                  <a
                    href="https://sict.cskaoyan.cn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    中科院沈计所报考指南 <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer>
        <div>
          <Sparkles size={15} />
          <span>华大联培报考指南</span>
        </div>
        <p>{notice}</p>
        <small>© 2026 CAS & BGI Joint Program Guide</small>
      </footer>
    </>
  );
}
