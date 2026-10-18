// ============================================================
// 课表小组件（Scriptable）—— 数据科学与大数据技术241 · 吴嘉琪
// 数据来源：教务系统导出（已解析）
// 学期基准：第 1 周周一 = 2026-08-31
// 用法：
//   1. Scriptable 新建脚本 → 粘贴本文件 → 命名「课表」→ Done
//   2. 桌面长按 → + → Scriptable → 选「课表」→ 选【大】尺寸 → 添加
//   3. 点一下小组件可看大图；在 Scriptable 内运行会全屏预览
// ============================================================

const DATA = {"student":"吴嘉琪","klass":"数据科学与大数据技术241","courses":[{"d":1,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17-18","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":2,"s":1,"e":2,"n":"操作系统","t":"胡雅婷","w":"13-17","r":"专业实验室316-A（尚B-3楼） 组1"},{"d":2,"s":1,"e":2,"n":"数据可视化技术","t":"李亚峤","w":"3-5","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":4,"s":1,"e":2,"n":"软件工程","t":"赵彩云","w":"11-14","r":"专业实验室315-A（尚B-3楼） 组1"},{"d":6,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":7,"s":1,"e":4,"n":"计算机组成原理课程设计","t":"王珏","w":"17","r":"计算机组成原理实验室116（尚B-1楼）"},{"d":3,"s":3,"e":4,"n":"机器学习","t":"贾丙静","w":"1-5 7-18","r":"软件实验室(8)-B（龙湖图书馆1楼）,软件实验室(8)-A（龙湖图书馆1楼）"},{"d":4,"s":3,"e":4,"n":"Hadoop大数据技术原理与应用","t":"董辉","w":"1-4 6-8 10-18","r":"致知楼A303"},{"d":5,"s":3,"e":4,"n":"机器学习","t":"贾丙静","w":"1-3 6-17","r":"软件实验室(7)-B（龙湖图书馆1楼）,软件实验室(7)-A（龙湖图书馆1楼）"},{"d":1,"s":5,"e":6,"n":"操作系统","t":"胡雅婷","w":"单1-3 单7-17","r":"致知楼A206"},{"d":1,"s":5,"e":6,"n":"Hadoop大数据技术原理与应用","t":"董辉","w":"双2-4 双8-18","r":"软件实验室(7)-A（龙湖图书馆1楼） 组1"},{"d":3,"s":5,"e":6,"n":"计算机组成原理","t":"王珏","w":"13-16","r":"计算机组成原理实验室116（尚B-1楼） 组1"},{"d":4,"s":5,"e":6,"n":"操作系统","t":"胡雅婷","w":"1-4 6-8 10-16","r":"致知楼A207"},{"d":5,"s":5,"e":6,"n":"大学体育(Ⅴ)","t":"费战斗","w":"1-3 6","r":"龙湖校区篮球场-1"},{"d":6,"s":5,"e":6,"n":"大学体育(Ⅴ)","t":"费战斗","w":"2-3","r":"龙湖校区篮球场-1"},{"d":1,"s":7,"e":8,"n":"数据可视化技术","t":"李亚峤","w":"3-5 7-16","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":2,"s":7,"e":8,"n":"软件工程","t":"赵彩云","w":"1-5 7-13","r":"致知楼A207"},{"d":4,"s":7,"e":8,"n":"计算机组成原理","t":"王珏","w":"1-4 6-8 10-17","r":"致知楼A303"},{"d":4,"s":7,"e":8,"n":"NoSQL数据库实训","t":"宁洪伟","w":"18","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"},{"d":5,"s":7,"e":8,"n":"计算机组成原理","t":"王珏","w":"3 6-8 10-17","r":"致知楼A205"},{"d":1,"s":9,"e":10,"n":"计算机组成原理","t":"王珏","w":"3","r":"致知楼A303"},{"d":1,"s":9,"e":10,"n":"操作系统","t":"胡雅婷","w":"5","r":"致知楼A208"},{"d":4,"s":9,"e":10,"n":"NoSQL数据库实训","t":"宁洪伟","w":"12-18","r":"专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）"}]};

const BASE_MONDAY = new Date(2026, 7, 31);   // 第1周周一
const DAY_NAMES = ["", "一", "二", "三", "四", "五", "六", "日"];
// 每门课固定配色（互不撞色）
const COURSE_COLORS = {
  "计算机组成原理":"#3B82F6",
  "计算机组成原理课程设计":"#6366F1",
  "操作系统":"#F59E0B",
  "数据可视化技术":"#EF4444",
  "软件工程":"#10B981",
  "机器学习":"#A855F7",
  "Hadoop大数据技术原理与应用":"#14B8A6",
  "大学体育(Ⅴ)":"#EC4899",
  "NoSQL数据库实训":"#0EA5E9"
};
const PALETTE = ["#3B82F6","#F59E0B","#EF4444","#10B981","#A855F7","#14B8A6","#EC4899","#0EA5E9","#6366F1"];

// 课程简称（太长塞不下时用这个）
const SHORT = {
  "计算机组成原理课程设计":"计组课设",
  "计算机组成原理":"计组",
  "操作系统":"操作系统",
  "数据可视化技术":"数据可视",
  "软件工程":"软件工程",
  "机器学习":"机器学习",
  "Hadoop大数据技术原理与应用":"Hadoop",
  "大学体育(Ⅴ)":"体育",
  "NoSQL数据库实训":"NoSQL"
};
function shortName(n){
  if (SHORT[n]) return SHORT[n];
  return n.length > 5 ? n.slice(0,5) : n;
}
// 教室简称（太长塞不下）
const ROOM_SHORT = {
  "计算机组成原理实验室116（尚B-1楼）":"116·尚B1",
  "专业实验室316-A（尚B-3楼） 组1":"316A·尚B3",
  "专业实验室315-A（尚B-3楼） 组1":"315A·尚B3",
  "专业实验室315-A（尚B-3楼）,专业实验室315-B（尚B-3楼）":"315A/B·尚B3",
  "软件实验室(8)-B（龙湖图书馆1楼）,软件实验室(8)-A（龙湖图书馆1楼）":"软8-B/A",
  "软件实验室(7)-B（龙湖图书馆1楼）,软件实验室(7)-A（龙湖图书馆1楼）":"软7-B/A",
  "软件实验室(7)-A（龙湖图书馆1楼） 组1":"软7-A",
  "龙湖校区篮球场-1":"篮球场-1",
  "致知楼A205":"A205","致知楼A206":"A206","致知楼A207":"A207",
  "致知楼A208":"A208","致知楼A303":"A303"
};
function shortRoom(r){
  if (!r) return "";
  if (ROOM_SHORT[r]) return ROOM_SHORT[r];
  let s = String(r).split(",")[0].replace(/\s*组\d+\s*$/,"").trim();
  return s.length > 9 ? s.slice(0,9) : s;
}
function colorFor(n){
  if (COURSE_COLORS[n]) return COURSE_COLORS[n];
  let h = 0;
  for (let i=0;i<n.length;i++) h = (h*31 + n.charCodeAt(i)) % 9973;
  return PALETTE[h % PALETTE.length];
}

// ---- 周次判断 ----
function weekOf(date){
  const d0 = new Date(BASE_MONDAY.getFullYear(), BASE_MONDAY.getMonth(), BASE_MONDAY.getDate());
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(Math.round((d1 - d0) / 86400000) / 7) + 1;
}
function isActive(weeksStr, wk){
  const toks = String(weeksStr).split(/\s+/);
  for (let tok of toks) {
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

// ---- 组装本周网格 ----
const now = new Date();
const wk = weekOf(now);
let todayWd = now.getDay(); if (todayWd === 0) todayWd = 7;

const grid = {};   // grid[day][period] = [课程...]
let maxP = 8;
for (const c of DATA.courses) {
  if (!isActive(c.w, wk)) continue;
  if (!grid[c.d]) grid[c.d] = {};
  for (let p = c.s; p <= c.e; p++) {
    if (!grid[c.d][p]) grid[c.d][p] = [];
    grid[c.d][p].push(c);
    if (p > maxP) maxP = p;
  }
}

// ================= 绘制 =================
const W = 660, H = 692, PAD = 14;
const TITLE_H = 30, HEAD_H = 26, LEFT_W = 30;
const rows = maxP;
const rowH = (H - PAD*2 - TITLE_H - HEAD_H) / rows;
const colW = (W - PAD*2 - LEFT_W) / 7;

const ctx = new DrawContext();
ctx.size = new Size(W, H);
ctx.opaque = true;

// 背景
ctx.setFillColor(new Color("#0f172a"));
ctx.fillRect(new Rect(0, 0, W, H));

// 今天所在列的底色
ctx.setFillColor(new Color("#1b263b"));
ctx.fillRect(new Rect(PAD + LEFT_W + (todayWd-1)*colW, PAD + TITLE_H, colW, H - PAD*2 - TITLE_H));

// 标题
ctx.setFont(Font.boldSystemFont(19));
ctx.setTextColor(new Color("#e2e8f0"));
ctx.setTextAlignedLeft();
ctx.drawTextInRect("第 " + wk + " 周 · 本周课表", new Rect(PAD, PAD, W-120, TITLE_H));
ctx.setFont(Font.mediumSystemFont(13));
ctx.setTextColor(new Color("#7dd3fc"));
ctx.setTextAlignedRight();
ctx.drawTextInRect("今天 周" + DAY_NAMES[todayWd], new Rect(W-140-PAD, PAD+3, 140, TITLE_H));

// 表头（星期）
ctx.setFont(Font.mediumSystemFont(13));
for (let d = 1; d <= 7; d++) {
  const x = PAD + LEFT_W + (d-1)*colW;
  ctx.setTextColor(d === todayWd ? new Color("#7dd3fc") : new Color("#94a3b8"));
  ctx.setTextAlignedCenter();
  ctx.drawTextInRect(DAY_NAMES[d], new Rect(x, PAD + TITLE_H, colW, HEAD_H));
}

// 格线（用 1px 矩形画，Path.line 在 Scriptable 里不存在）
ctx.setFillColor(new Color("#22304a"));
for (let r = 0; r <= rows; r++) {
  const y = PAD + TITLE_H + HEAD_H + r*rowH;
  ctx.fillRect(new Rect(PAD, y, W - PAD*2, 1));
}
for (let d = 0; d <= 7; d++) {
  const x = PAD + LEFT_W + d*colW;
  ctx.fillRect(new Rect(x, PAD + TITLE_H, 1, H - PAD - (PAD + TITLE_H)));
}

// 课程方块
for (let r = 0; r < rows; r++) {
  const p = r + 1;
  const y = PAD + TITLE_H + HEAD_H + r*rowH;
  // 节次号
  ctx.setFont(Font.mediumSystemFont(12));
  ctx.setTextColor(new Color("#64748b"));
  ctx.setTextAlignedCenter();
  ctx.drawTextInRect(String(p), new Rect(PAD, y, LEFT_W, rowH));

  for (let d = 1; d <= 7; d++) {
    const list = (grid[d] && grid[d][p]) || [];
    if (!list.length) continue;
    const x = PAD + LEFT_W + (d-1)*colW;
    const n = list.length;
    for (let k = 0; k < n; k++) {
      const ch = (rowH / n);
      const cy = y + k*ch;
      const rect = new Rect(x+1.5, cy+1.5, colW-3, ch-3);
      const pth = new Path();
      pth.addRoundedRect(rect, 5, 5);
      ctx.addPath(pth);
      ctx.setFillColor(new Color(colorFor(list[k].n)));
      ctx.fillPath();

      const c = list[k];
      const compact = n > 1;                       // 一格两课时压缩显示
      const lines = compact
        ? [shortName(c.n), shortRoom(c.r)]
        : [shortName(c.n), c.t, shortRoom(c.r)];
      const sizes = compact ? [9, 8] : [11, 9, 9];
      const gap = 2;
      let th = 0; for (let s of sizes) th += s; th += gap*(lines.length-1);
      let ly = rect.y + (rect.height - th)/2;
      for (let i = 0; i < lines.length; i++) {
        ctx.setFont(Font.mediumSystemFont(sizes[i]));
        ctx.setTextColor(Color.white());
        ctx.setTextAlignedCenter();
        ctx.drawTextInRect(lines[i], new Rect(rect.x+2, ly, rect.width-4, sizes[i]+3));
        ly += sizes[i] + gap;
      }
    }
  }
}

const img = ctx.getImage();

// ================= 输出 =================
if (config.runsInWidget) {
  const w = new ListWidget();
  w.setPadding(0,0,0,0);
  w.addImage(img);
  // 明天凌晨自动刷新（周数/课程会跟着日期变）
  const t = new Date();
  w.refreshAfterDate = new Date(t.getFullYear(), t.getMonth(), t.getDate()+1, 0, 5, 0);
  Script.setWidget(w);
} else {
  await QuickLook.present(img);
}
Script.complete();