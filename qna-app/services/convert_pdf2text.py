from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO

from base64 import b64decode


def decode_base64(base64_pdf):
    bytes = b64decode(base64_pdf, validate=True)
    if bytes[0:4] != b'%PDF':
        raise ValueError('Missing the PDF file signature')
    path = 'local_file.pdf'
    file = open(path, 'wb')
    file.write(bytes)
    file.close()
    return path


def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos = set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching,
                                  check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()
    return text


def get_paras(base64encoded):
    doc_path = decode_base64(base64encoded)
    text = convert_pdf_to_txt(doc_path)
    temp_paras = text.split('\n \n')
    if (len(temp_paras) == 1):
        temp_paras = text.split('\n\n')
    paras = []
    for para in temp_paras:
        new_para = para.replace('\n', '')
        paras.append(new_para)
    paras.pop()
    formatted_para = remove_last_line(paras[len(paras) - 1])
    paras = paras[:-1]
    paras.append(formatted_para)
    return paras


def remove_last_line(paragraph):
    lines = paragraph.split('.')
    lines = lines[:-1]
    formatted_paragraph = ''
    for line in lines:
        line = line + '.'
        formatted_paragraph = formatted_paragraph + line
    return formatted_paragraph


if __name__ == '__main__':
    path = '/home/userd672/Documents/non-work/HackerEarth-hackathon/pdf/3.pdf'

    # path = decode_base64(base64)
    paras = get_paras(path)
    print(paras)
    print(len(paras))
