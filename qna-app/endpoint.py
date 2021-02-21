from fastapi import FastAPI
from pydantic import BaseModel
from services import question_generator, convert_pdf2text
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

origins = [
    "http://localhost:8060",
    "http://localhost:8080",
    "http://localhost:8090",
    "http://18.188.61.131/ui/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class text_qna_request(BaseModel):
    text: str


class pdf_qna_request(BaseModel):
    base64encoded: str


@app.post("/qna/getqna/text")
async def getTextQnA(req: text_qna_request):
    logging.info("text qna endpoint called")
    paragraph = req.text
    questions = question_generator.get_qna(paragraph)
    logging.info("qna text call complete")
    return questions


@app.post("/getqna/pdf")
async def getPdfQnA(req: pdf_qna_request):
    logging.info(req.base64encoded)
    paragraphs = convert_pdf2text.get_paras(req.base64encoded)
    qna_list = []
    for paragraph in paragraphs:
        question_generator.get_multi_para_qna(paragraph, qna_list)
    return qna_list
