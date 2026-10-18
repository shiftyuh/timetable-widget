// ============================================================
// 今日课表小组件（Scriptable）—— 数据科学与大数据技术241 · 吴嘉琪
// · 只看「今天」的课，一行一节
// · 教室/老师显示全名
// · 今天没课时自动切换成「放松模式」，随机一句暖心话
// 学期基准：第 1 周周一 = 2026-08-31
// 用法：Scriptable 新建脚本 → 粘贴 → 命名「课表」→ 桌面加 Scriptable 中/大组件
// ============================================================

const DATA = {"student":"吴嘉琪","klass":"数据科学与大数据技术241","courses":[{"d":1,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17-18","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":2,"s":1,"e":2,"n":"操作系统","t":"胡雅婷","w":"13-17","r":"专业实验室316-A（尚B-3楼） 组1"},{"d":2,"s":1,"e":2,"n":"数据可视化技术","t":"李亚峤","w":"3-5","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":4,"s":1,"e":2,"n":"软件工程","t":"赵彩云","w":"11-14","r":"专业实验室315-A（尚B-3楼） 组1"},{"d":6,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":7,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":3,"s":3,"e":4,"n":"机器学习","t":"贾丙静","w":"1-5 7-18","r":"软件实验室(8)-B（龙湖图书馆1楼）,软件实验室(8)-A（龙湖图书馆1楼）"},{"d":4,"s":3,"e":4,"n":"Hadoop大数据技术原理与应用","t":"董辉","w":"1-4 6-8 10-18","r":"致知楼A303"},{"d":5,"s":3,"e":4,"n":"机器学习","t":"贾丙静","w":"1-3 6-17","r":"软件实验室(7)-B（龙湖图书馆1楼）,软件实验室(7)-A（龙湖图书馆1楼）"},{"d":1,"s":5,"e":6,"n":"操作系统","t":"胡雅婷","w":"单1-3 单7-17","r":"致知楼A206"},{"d":1,"s":5,"e":6,"n":"Hadoop大数据技术原理与应用","t":"董辉","w":"双2-4 双8-18","r":"软件实验室(7)-A（龙湖图书馆1楼） 组1"},{"d":3,"s":5,"e":6,"n":"计算机组成原理","t":"王珏","w":"13-16","r":"计算机组成原理实验室116（尚B-1楼） 组1"},{"d":4,"s":5,"e":6,"n":"操作系统","t":"胡雅婷","w":"1-4 6-8 10-16","r":"致知楼A207"},{"d":5,"s":5,"e":6,"n":"大学体育(Ⅴ)","t":"费战斗","w":"1-3 6","r":"龙湖校区篮球场-1"},{"d":6,"s":5,"e":6,"n":"大学体育(Ⅴ)","t":"费战斗","w":"2-3","r":"龙湖校区篮球场-1"},{"d":1,"s":7,"e":8,"n":"数据可视化技术","t":"李亚峤","w":"3-5 7-16","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":2,"s":7,"e":8,"n":"软件工程","t":"赵彩云","w":"1-5 7-13","r":"致知楼A207"},{"d":4,"s":7,"e":8,"n":"计算机组成原理","t":"王珏","w":"1-4 6-8 10-17","r":"致知楼A303"},{"d":4,"s":7,"e":8,"n":"NoSQL数据库实训","t":"宁洪伟","w":"18","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":5,"s":7,"e":8,"n":"计算机组成原理","t":"王珏","w":"3 6-8 10-17","r":"致知楼A205"},{"d":1,"s":9,"e":10,"n":"计算机组成原理","t":"王珏","w":"3","r":"致知楼A303"},{"d":1,"s":9,"e":10,"n":"操作系统","t":"胡雅婷","w":"5","r":"致知楼A208"},{"d":4,"s":9,"e":10,"n":"NoSQL数据库实训","t":"宁洪伟","w":"12-18","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"}]};

const BASE_MONDAY = new Date(2026, 7, 31);
const DAY_NAMES = ["", "一", "二", "三", "四", "五", "六", "日"];
const COLOR_BG = new Color("#0a2540");
const COLOR_MAIN = Color.white();
const COLOR_SUB = new Color("#9bb7d4");
const COLOR_ACCENT = new Color("#7dd3fc");

// 多教室合并写法（只用于合并同一实验室的 A/B，其余显示全名）
const ROOM_MERGE = {
  "专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）":"专业实验室315-A/B（尚B-3楼）",
  "软件实验室(8)-B（龙湖图书馆1楼）,软件实验室(8)-A（龙湖图书馆1楼）":"软件实验室(8)-A/B（龙湖图书馆1楼）",
  "软件实验室(7)-B（龙湖图书馆1楼）,软件实验室(7)-A（龙湖图书馆1楼）":"软件实验室(7)-A/B（龙湖图书馆1楼）"
};
function fullRoom(r){
  if (!r) return "—";
  if (ROOM_MERGE[r]) return ROOM_MERGE[r];
  return String(r).replace(/\s*组\d+\s*$/,"").trim();
}

function weekOf(date){
  const d0 = new Date(BASE_MONDAY.getFullYear(), BASE_MONDAY.getMonth(), BASE_MONDAY.getDate());
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(Math.round((d1 - d0) / 86400000) / 7) + 1;
}
function isActive(weeksStr, wk){
  for (let tok of String(weeksStr).split(/\s+/)) {
    if (!tok) continue;
    let parity = null;
    if (tok[0] === "单") { parity = 1; tok = tok.slice(1); }
    else if (tok[0] === "双") { parity = 0; tok = tok.slice(1); }
    let a, b;
    if (tok.includes("-")) { const p = tok.split("-"); a = +p[0]; b = +p[1]; }
    else { a = b = +tok; }
    if (!isNaN(a) && !isNaN(b) && wk >= a && wk <= b) {
      if (parity === null) return true;
      if (parity === 1 && wk % 2 === 1) return true;
      if (parity === 0 && wk % 2 === 0) return true;
    }
  }
  return false;
}

// ---- 今天 ----
const now = new Date();
const wk = weekOf(now);
let todayWd = now.getDay(); if (todayWd === 0) todayWd = 7;
const isWeekend = (todayWd === 6 || todayWd === 7);

const today = DATA.courses
  .filter(c => c.d === todayWd && isActive(c.w, wk))
  .sort((a, b) => a.s - b.s);

// ---- 空课日的暖心话（按日期固定，同一天不会跳来跳去）----
const WEEKEND_LINES = [
  ["周末愉快 🦈", "好好休息，睡到自然醒吧"],
  ["好好补个觉 😴", "今天不用赶教室，慢慢来～"],
  ["放松一下吧 🍵", "做点喜欢的事，开心最重要"],
  ["给自己放个假 🌊", "躺着、发呆、追剧，都算正事"],
  ["愉快的一天 ☀️", "记得好好吃饭、好好睡觉呀"]
];
const WEEKDAY_LINES = [
  ["今天没课 ✨", "自由的一天，做点想做的吧"],
  ["今天没课 😌", "看看书、补补觉，都由你"],
  ["今天没课 🌤️", "出去走走、晒晒太阳也不错"],
  ["今天没课 🎧", "听听歌，享受一下慢节奏"]
];
const dayIndex = Math.floor(now.getTime() / 86400000);
const lines = isWeekend ? WEEKEND_LINES : WEEKDAY_LINES;
const pick = lines[dayIndex % lines.length];

// ---- 渲染 ----
const w = new ListWidget();
w.backgroundColor = COLOR_BG;
w.setPadding(14, 16, 14, 16);

// 标题行
const head = w.addStack();
head.centerAlignContent();
const ht = head.addText("📅 今日课表");
ht.font = Font.boldSystemFont(14);
ht.textColor = COLOR_SUB;
head.addSpacer();
const wt = head.addText("第" + wk + "周 周" + DAY_NAMES[todayWd]);
wt.font = Font.mediumSystemFont(12);
wt.textColor = COLOR_ACCENT;
w.addSpacer(10);

if (!today.length) {
  // 放松模式
  w.addSpacer();
  const emoji = w.addText(isWeekend ? "🛌" : "🌤️");
  emoji.font = Font.systemFont(30);
  emoji.centerAlignText();
  w.addSpacer(8);
  const big = w.addText(pick[0]);
  big.font = Font.boldSystemFont(20);
  big.textColor = COLOR_MAIN;
  big.centerAlignText();
  w.addSpacer(6);
  const sub = w.addText(pick[1]);
  sub.font = Font.mediumSystemFont(13);
  sub.textColor = COLOR_SUB;
  sub.centerAlignText();
  w.addSpacer();
} else {
  const spacious = today.length <= 3;   // 课不多→三行舒展；课多→两行紧凑
  for (let i = 0; i < today.length; i++) {
    const c = today[i];
    const row = w.addStack();
    row.centerAlignContent();

    const left = row.addStack();
    left.layoutVertically();
    const nm = left.addText(c.n);
    nm.font = Font.semiboldSystemFont(16);
    nm.textColor = COLOR_MAIN;
    if (spacious) {
      const t1 = left.addText(c.t);
      t1.font = Font.mediumSystemFont(11.5);
      t1.textColor = COLOR_SUB;
      const r1 = left.addText(fullRoom(c.r));
      r1.font = Font.mediumSystemFont(11.5);
      r1.textColor = COLOR_SUB;
    } else {
      const sub = left.addText(c.t + " · " + fullRoom(c.r));
      sub.font = Font.mediumSystemFont(11);
      sub.textColor = COLOR_SUB;
      sub.lineLimit = 2;
    }

    row.addSpacer(8);
    const pr = row.addText("第" + c.s + "-" + c.e + "节");
    pr.font = Font.semiboldSystemFont(12);
    pr.textColor = COLOR_ACCENT;

    if (i < today.length - 1) w.addSpacer(spacious ? 9 : 6);
  }
}

w.addSpacer();

// 每日自动刷新
const t2 = new Date();
w.refreshAfterDate = new Date(t2.getFullYear(), t2.getMonth(), t2.getDate()+1, 0, 5, 0);

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  await w.presentMedium();
}
Script.complete();