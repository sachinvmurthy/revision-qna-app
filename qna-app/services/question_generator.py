from question_generation import pipelines
import logging

qna_nlp = pipelines.pipeline("question-generation")
e2e_nlp = pipelines.pipeline("e2e-qg")


class questions_answers:
    question: str
    answer: str

    def __init__(self, question, answer):
        self.question = question
        self.answer = answer


def get_qna(text):
    logging.info("get QnA called")
    dataList = qna_nlp(text)
    questions = []
    for index in range(len(dataList)):
        answer = dataList[index]['answer']
        question = dataList[index]['question']
        questions.append(questions_answers(question, answer))
    logging.info("qna nlp call complete")
    return questions


def get_multi_para_qna(paragraph, qna_list):
    dataList = qna_nlp(paragraph)
    for index in range(len(dataList)):
        answer = dataList[index]['answer']
        question = dataList[index]['question']
        qna_list.append(questions_answers(question, answer))


def e2e_questions(text):
    return e2e_nlp(text)


if __name__ == '__main__':
    text = "A solution has a solvent and a solute as its\
            components. The component of the solution\
            that dissolves the other component in it\
            (usually the component present in larger\
            amount) is called the solvent. The component\
            of the solution that is dissolved in the solvent\
            (usually present in lesser quantity) is called\
            the solute."
    get_qna(text)
