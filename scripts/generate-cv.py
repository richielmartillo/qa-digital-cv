"""Generate reviewed translations only; Portuguese is copied byte-for-byte.
Requires reportlab and Arial TTF fonts (CV_FONT_DIR or Windows Fonts).
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_CENTER

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/cv'
SOURCE = ROOT / 'Richard Balestrim (Atualizado).docx.pdf'
EXPECTED = '55aeac1f9e297b7415038956cc07b06bde70345ba00f92853a2b759736e02788'
LINKS = ['https://github.com/richielmartillo/hub-de-leitura-api-cypress',
         'https://github.com/richielmartillo/hub-de-leitura-testes-api-postman']
W, H = 595.2756, 841.8898  # ISO A4; original export is rounded to 596 x 842.
LEFT, RIGHT = 42.5, 554.0
FONT_DIR = Path(os.environ.get('CV_FONT_DIR', 'C:/Windows/Fonts'))
for face, filename in [('Arial','arial.ttf'),('Arial-Bold','arialbd.ttf'),('Arial-Italic','ariali.ttf'),('Arial-BoldItalic','arialbi.ttf')]:
    pdfmetrics.registerFont(TTFont(face, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')


def generate(lang, data):
    path = DEST / ('Richard_Marlon_Balestrim_CV_' + {'es-AR':'ES','en':'EN'}[lang] + '.pdf')
    c = canvas.Canvas(str(path), pagesize=(W,H), pageCompression=1, invariant=1)
    c.setTitle('Richard Marlon Balestrim - ' + data['objective'])
    c.setAuthor('Richard Marlon Balestrim')
    c.setSubject('Curriculum vitae - ' + lang)
    c._doc.Catalog.Lang = PDFString(lang)

    def para(text, top, x=LEFT, width=RIGHT-LEFT, face='Arial', size=10, leading=11.5, align=0):
        p = Paragraph(text, ParagraphStyle('cv', fontName=face, fontSize=size, leading=leading, alignment=align))
        _, height = p.wrap(width, H)
        if top + height > H-20:
            raise ValueError(f'{lang}: content beyond page: {text}')
        p.drawOn(c, x, H-top-height)
        return top+height

    def bar(label, top):
        c.setFillColorRGB(.86,.86,.86)
        c.rect(LEFT,H-top-12,RIGHT-LEFT,12,fill=1,stroke=0)
        c.setFillColorRGB(0,0,0)
        para(label,top,x=LEFT,face='Arial-Bold')

    def bullets(items, top, limit, italic=False, gap=0):
        for item in items:
            c.setFillColorRGB(0,0,0)
            c.circle(62, H-top-6, 1.65, fill=1, stroke=0)
            top = para(item,top,x=78.5,width=RIGHT-78.5,face='Arial-Italic' if italic else 'Arial') + gap
        if top > limit:
            raise ValueError(f'{lang}: block overflow: {top:.1f} > {limit}; {items[-1]}')
        return top

    # Two-column identity, same hierarchy and contacts as the original.
    c.setLineWidth(.7);c.line(316.5,H-57,316.5,H-149)
    para('Richard Marlon Balestrim',82,x=48,width=251,size=20,leading=23,align=TA_CENTER)
    para('LinkedIn:',105,x=48,width=251,align=TA_CENTER)
    para('<link href="https://www.linkedin.com/in/richard-marlon-balestrim" color="blue"><u>www.linkedin.com/in/richard-marlon-balestrim</u></link>',116,x=48,width=251,size=9.5,align=TA_CENTER)
    para('GitHub:',128,x=48,width=251,align=TA_CENTER)
    para('<link href="https://richielmartillo.github.io/qa-portfolio/" color="blue"><u>github.com/richielmartillo/qa-portfolio</u></link>',139,x=48,width=251,size=9.5,align=TA_CENTER)
    for i,line in enumerate(['44 999430660','richardbalestrim8@gmail.com',data['location'],data['relocation']]):
        para(line,85+i*13.5,x=330,width=212,align=TA_CENTER)
    para(data['objectiveLabel'],172,size=9,align=TA_CENTER)
    para(data['objective'],185,size=16,leading=19,align=TA_CENTER)
    bar(data['summaryLabel'],212)
    end = para(data['summary'],234)
    assert end <= 283, (lang,'summary',end)
    bullets(data['qualifications'],292,387)
    bar(data['educationLabel'],396)
    bullets(data['education'],411,450)
    bar(data['experienceLabel'],460)
    for job,top,limit in zip(data['jobs'],[482,574,684],[570,680,779]):
        para('<u>'+job['company']+'</u>',top,face='Arial-Italic' if 'note' in job else 'Arial',width=355)
        c.setFont('Arial-Bold',10)
        c.drawRightString(RIGHT,H-top-9,job['period'])
        top += 12
        if 'note' in job:
            top=para('('+job['note']+')',top,face='Arial-Italic')
        top=para(job['role'],top,face='Arial-BoldItalic' if job is data['jobs'][0] else 'Arial-Bold')+2
        bullets(job['bullets'],top,limit,italic='note' in job)
    bar(data['projectsLabel'],784)
    para(data['projectTitle'],807,face='Arial-Bold')
    c.showPage()
    para(data['projectContext'],48,face='Arial-Italic')
    bullets(data['projectBullets'],72,136)
    para(data['repositoriesLabel'],141,face='Arial-Bold')
    bullets(['<link href="'+url+'" color="blue"><u>'+title+'</u></link>' for title,url in zip(data['repositories'],LINKS)],164,201,italic=True,gap=2)
    bar(data['languagesLabel'],215)
    bullets(data['languages'],230,274,gap=2)
    bar(data['skillsLabel'],281)
    bullets(data['skills'],297,381,gap=2)
    bar(data['coursesLabel'],388)
    bullets(data['courses'],404,520,gap=2)
    bar(data['internationalLabel'],524)
    bullets(data['international'],540,630,gap=2)
    c.save()
    print(path.relative_to(ROOT))


def main():
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==EXPECTED, 'Original PDF changed; review before generation.'
    DEST.mkdir(exist_ok=True)
    data=json.loads((ROOT/'documents/translations/cv.json').read_text(encoding='utf-8-sig'))
    for lang,content in data.items():
        generate(lang,content)
    shutil.copyfile(SOURCE, DEST/'Richard_Marlon_Balestrim_CV_PT.pdf')

if __name__=='__main__':
    main()
