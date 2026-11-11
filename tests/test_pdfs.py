"""Structural and full-text checks supplement mandatory visual review.
Run: python -m unittest discover -s tests -p 'test_*.py'
Dependencies: pypdf, pymupdf.
"""
import hashlib
import html
import json
from pathlib import Path
import re
import unittest
import fitz
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'documents/translations/cv.json').read_text(encoding='utf-8-sig'))

def normalize(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', value))).strip()

def strings(value):
    if isinstance(value,str): yield value
    elif isinstance(value,list):
        for child in value: yield from strings(child)
    elif isinstance(value,dict):
        for child in value.values(): yield from strings(child)

class Documents(unittest.TestCase):
    def path(self,suffix):return ROOT/f'assets/cv/Richard_Marlon_Balestrim_CV_{suffix}.pdf'
    def test_portuguese_unchanged(self):
        original=(ROOT/'Richard Balestrim (Atualizado).docx.pdf').read_bytes()
        self.assertEqual(hashlib.sha256(original).hexdigest(),'55aeac1f9e297b7415038956cc07b06bde70345ba00f92853a2b759736e02788')
        self.assertEqual(self.path('PT').read_bytes(),original)
    def test_three_valid_two_page_a4_documents(self):
        for suffix in ['PT','ES','EN']:
            with self.subTest(suffix=suffix):
                path=self.path(suffix)
                self.assertGreater(path.stat().st_size,10000)
                reader=PdfReader(path,strict=True)
                self.assertEqual(len(reader.pages),2)
                self.assertFalse(reader.is_encrypted)
                for page in reader.pages:
                    self.assertAlmostEqual(float(page.mediabox.width),595.2756,delta=1)
                    self.assertAlmostEqual(float(page.mediabox.height),841.8898,delta=1)
                    self.assertGreater(len(page.extract_text()),1000)
                doc=fitz.open(path)
                self.assertFalse(doc.is_repaired)
                for page in doc:
                    self.assertGreater(len(page.get_pixmap().samples),10000)
    def test_every_translated_content_item_is_present(self):
        for lang,suffix in [('es-AR','ES'),('en','EN')]:
            with self.subTest(lang=lang):
                reader=PdfReader(self.path(suffix),strict=True)
                text=normalize(' '.join(p.extract_text() for p in reader.pages))
                for item in strings(DATA[lang]):self.assertIn(normalize(item),text)
                self.assertNotIn('\ufffd',text)
                self.assertEqual(reader.trailer['/Root']['/Lang'],lang)
    def test_contacts_names_technologies_and_links(self):
        for suffix in ['PT','ES','EN']:
            with self.subTest(suffix=suffix):
                doc=fitz.open(self.path(suffix));text=normalize(' '.join(p.get_text() for p in doc))
                for term in ['Richard Marlon Balestrim','44 999430660','richardbalestrim8@gmail.com','Honorable Senado de la Nación Argentina','Escuela de Educación Secundaria N° 13','Hub de Leitura','Cypress','Cucumber','Appium','Postman','WebdriverIO','Charles Proxy','Jenkinsfile','Python','MongoDB','TypeScript','2026','2022','2016','2025','2009']:
                    self.assertIn(term,text)
                links=[l['uri'].replace('http:','https:') for p in doc for l in p.get_links() if 'uri' in l]
                for url in ['https://www.linkedin.com/in/richard-marlon-balestrim','https://richielmartillo.github.io/qa-portfolio/','https://github.com/richielmartillo/hub-de-leitura-api-cypress','https://github.com/richielmartillo/hub-de-leitura-testes-api-postman']:
                    self.assertIn(url,links)
    def test_page_organization_fonts_and_text_bounds(self):
        for lang,suffix in [('es-AR','ES'),('en','EN')]:
            doc=fitz.open(self.path(suffix));d=DATA[lang]
            for key in ['summaryLabel','educationLabel','experienceLabel','projectsLabel']:
                self.assertIn(d[key],doc[0].get_text())
            for key in ['projectContext','languagesLabel','skillsLabel','coursesLabel','internationalLabel']:
                self.assertIn(d[key],doc[1].get_text())
            for page in doc:
                for font in page.get_fonts():
                    if 'Arial' in font[3]:self.assertGreater(len(doc.extract_font(font[0])[3]),0)
                for x0,y0,x1,y1,text,*_ in page.get_text('blocks'):
                    self.assertTrue(x0>=40 and x1<=556 and y0>=35 and y1<=822,(suffix,text))

if __name__=='__main__':unittest.main()
