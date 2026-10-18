import re, json
from html.parser import HTMLParser

html = open('/tmp/kb.html', encoding='utf-8').read()

class T(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables=[]; self.rows=None; self.cell=None; self.buf=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='table':
            self.rows=[]; self.tables.append(self.rows)
        elif tag=='tr' and self.rows is not None:
            self.cur=[]
        elif tag in ('td','th'):
            self.cell={'rs':int(a.get('rowspan',1)),'cs':int(a.get('colspan',1)),'t':''}
            self.buf=[]
        elif tag=='br' and self.cell is not None:
            self.buf.append('\n')
    def handle_endtag(self, tag):
        if tag in ('td','th') and self.cell is not None:
            txt=''.join(self.buf)
            txt=re.sub(r'[ \t]*\n[ \t]*','\n',txt)
            txt=re.sub(r'[ \t]+',' ',txt).replace('\xa0',' ')
            self.cell['t']=txt.strip()
            self.cur.append(self.cell); self.cell=None
        elif tag=='tr' and self.rows is not None:
            self.rows.append(self.cur); self.cur=None
    def handle_data(self, data):
        if self.cell is not None: self.buf.append(data)

p=T(); p.feed(html)
rows = p.tables[0]   # 第一张表 = 课表

# 展开 rowspan
grid=[]; pending={}
for ri,row in enumerate(rows):
    r=[]; ci=0
    for cell in row:
        while (ri,ci) in pending: r.append(pending.pop((ri,ci))); ci+=1
        r.append(cell)
        for dc in range(1,cell['cs']):
            for k in range(cell['rs']): pending[(ri+k,ci+dc)]=cell
        for k in range(1,cell['rs']): pending[(ri+k,ci)]=cell
        ci+=cell['cs']
    while (ri,ci) in pending: r.append(pending.pop((ri,ci))); ci+=1
    grid.append(r)

hdr_i=next(i for i,row in enumerate(grid) if any('节次' in c['t'] for c in row))
daycol={}
for ci,c in enumerate(grid[hdr_i]):
    if c['t'].startswith('星期'): daycol[ci]=c['t']

def parse_course(line):
    # 找「(课程代码) (教师)」这一段作为锚点，前面是课名，后面是 (周次,教室)
    m=re.search(r'\(([A-Za-z][A-Za-z0-9\-._]*[^()]*)\)\s*\(([\u4e00-\u9fa5]{2,6})\)\s*(.*)$', line.strip())
    if not m: return None
    code,teacher,rest=m.group(1).strip(),m.group(2).strip(),m.group(3).strip()
    name=line.strip()[:m.start()].strip()
    if rest.startswith('(') and rest.endswith(')'): rest=rest[1:-1]
    if ',' in rest: weeks,room=rest.split(',',1)
    elif '，' in rest: weeks,room=rest.split('，',1)
    else: weeks,room=rest,''
    return dict(name=name, code=code, teacher=teacher, weeks=weeks.strip(), room=room.strip())

def merge_courses(txt):
    lines=[l.strip() for l in txt.split('\n') if l.strip()]
    out=[]
    for l in lines:
        if l.startswith('(') and out: out[-1]+=' '+l
        else: out.append(l)
    return out

courses=[]; seen=set()
for ri in range(hdr_i+1,len(grid)):
    row=grid[ri]
    m=re.match(r'第(\d+)节', row[0]['t'] if row else '')
    if not m: continue
    period=int(m.group(1))
    for ci,c in enumerate(row):
        if ci not in daycol: continue
        if not c['t']: continue
        if id(c) in seen: continue      # 跨 rowspan 的行只取第一行(起始节)
        seen.add(id(c))
        for line in merge_courses(c['t']):
            line=line.strip()
            if not line: continue
            pc=parse_course(line)
            if not pc:
                print("!! 未解析:", line[:70]); continue
            pc['day']=ci
            pc['dayName']=daycol[ci]
            pc['start']=period
            pc['end']=period+c['rs']-1
            courses.append(pc)

out=dict(student=(re.search(r'学生姓名[:：]\s*([^\s&]+)', re.sub(r'<[^>]+>',' ',html)) or [None,'?'])[1],
         klass=(re.search(r'所属班级[:：]\s*([^\s&]+)', re.sub(r'<[^>]+>',' ',html)) or [None,'?'])[1],
         courses=courses)
json.dump(out, open('/tmp/kb.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("学生:", out['student'], "| 班级:", out['klass'])
print("课程条目:", len(courses))
for c in courses:
    print(f"{c['dayName']} 第{c['start']}-{c['end']}节 | {c['name']} | {c['teacher']} | {c['weeks']} | {c['room'][:26]}")