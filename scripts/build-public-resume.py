#!/usr/bin/env python3
"""Render approved V5 wording as a public PDF; never fetch or rewrite source content."""
import argparse
import re
from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def inline(text):
    parts = re.split(r'(\*\*.*?\*\*)', text)
    out = ''.join('<b>'+escape(p[2:-2])+'</b>' if p.startswith('**') and p.endswith('**') else escape(p) for p in parts)
    for label, url in [
        ('linkedin.com/in/andrewpella','https://www.linkedin.com/in/andrewpella'),
        ('github.com/AndyPella/ai-portfolio-project','https://github.com/AndyPella/ai-portfolio-project'),
    ]:
        out = out.replace(label, '<link href="'+url+'" color="#215E99">'+label+'</link>')
    return out


def build(source, output, regular_font, bold_font):
    pdfmetrics.registerFont(TTFont('ResumeBody', str(regular_font)))
    pdfmetrics.registerFont(TTFont('ResumeBold', str(bold_font)))
    pdfmetrics.registerFontFamily('ResumeBody',normal='ResumeBody',bold='ResumeBold',italic='ResumeBody',boldItalic='ResumeBold')
    blue = colors.HexColor('#215E99')
    normal = ParagraphStyle('Body',fontName='ResumeBody',fontSize=9.5,leading=10.7,spaceAfter=1.5,alignment=TA_LEFT,textColor=colors.black)
    def style(name, **kw):
        return ParagraphStyle(name,parent=normal,**kw)
    styles = {
        'name':style('Name',fontName='ResumeBold',fontSize=20,leading=23,textColor=blue,spaceAfter=3,keepWithNext=True),
        'headline':style('Headline',fontName='ResumeBold',fontSize=11.5,leading=13.2,textColor=blue,spaceAfter=5,keepWithNext=True),
        'contact':style('Contact',fontSize=9.5,leading=11.2,spaceAfter=2,keepWithNext=True),
        'section':style('Section',fontName='ResumeBold',fontSize=12,leading=14,textColor=blue,spaceBefore=7,spaceAfter=3,keepWithNext=True),
        'employer':style('Employer',fontName='ResumeBold',fontSize=10.5,leading=12.4,textColor=blue,spaceBefore=4,spaceAfter=2,keepWithNext=True),
        'role':style('Role',fontName='ResumeBold',fontSize=10,leading=11.7,textColor=blue,spaceBefore=3,spaceAfter=3,keepWithNext=True),
        'bullet':style('Bullet',leftIndent=10,firstLineIndent=0,bulletIndent=0,spaceAfter=1.5),
        'body':normal,
    }
    lines=source.read_text().splitlines()
    if not lines or lines[0].strip()!='# Andrew Pella':
        raise ValueError('Expected the approved applicant source.')
    story=[];in_header=True;headline_done=False
    for raw in lines:
        line=raw.strip()
        if not line:continue
        if line.startswith('# '):
            kind='name';text=line[2:]
        elif line.startswith('## '):
            in_header=False;kind='section';text=line[3:]
        elif line.startswith('### '):kind='employer';text=line[4:]
        elif line.startswith('#### '):kind='role';text=line[5:]
        elif in_header and not headline_done and line.startswith('**'):
            kind='headline';text=line;headline_done=True
        elif in_header:kind='contact';text=line
        elif line.startswith('- '):kind='bullet';text=line[2:]
        else:kind='body';text=line
        story.append(Paragraph(inline(text),styles[kind],bulletText='•' if kind=='bullet' else None))
    output.parent.mkdir(parents=True,exist_ok=True)
    doc=SimpleDocTemplate(str(output),pagesize=letter,leftMargin=50.4,rightMargin=50.4,topMargin=39.6,bottomMargin=39.6,
        title='Andrew Pella Resume V5',author='Andrew Pella',subject='Technical product and platform leadership',pageCompression=1)
    doc.build(story)


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--font-regular',type=Path,required=True)
    p.add_argument('--font-bold',type=Path,required=True)
    a=p.parse_args();build(a.source,a.output,a.font_regular,a.font_bold)

if __name__=='__main__':main()
