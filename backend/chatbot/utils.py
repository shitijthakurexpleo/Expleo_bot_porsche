import re
import ast
import os
import glob
import shutil
import sqlite3
import pandas as pd
from typing import List
from .constants import *
import xml.etree.ElementTree as ET
from langchain.docstore.document import Document
from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.utilities.sql_database import SQLDatabase
from langchain.chains import create_sql_query_chain
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_community.llms.llamacpp import LlamaCpp
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool

def XML_Reader(file_path):
    # Parse XML data
    tree = ET.parse(file_path)
    root = tree.getroot()
    return root

def load_single_document(file_path: str) -> Document:
    # Loads a single document from a file path
    if file_path.endswith(".xml"):
        loader = XML_Reader(file_path)
    return loader

def load_documents(source_dir: str) -> List[Document]:
    # Loads all documents from source documents directory
    xml_files = glob.glob(os.path.join(source_dir, "**/*.xml"), recursive=True)
    loaded_documents = []
    for file_path in xml_files:
        load_one_path_docs = load_single_document(file_path)
        for document in load_one_path_docs:
            loaded_documents.append(document)
    return loaded_documents

def clear_dir(path):
    try:
        shutil.rmtree(path)
        print(f"Removed directory at {path}")
    except OSError as error:
        print(f"Error Occurred: {path} : {error.strerror}")

def pattern_to_dataframe (dataframe):
    
    df = dataframe
    pattern_string = r"(Manuell getestet.*)"
    df['Manual'] = ''
    df['Manual'] = df['ValuationComment'].str.contains(pattern_string)

    columns_to_search = ['ValuationComment']
    for col in columns_to_search:
        mask = df[col].str.contains(pattern_string, case=False, na=False)
        df.loc[mask, col] = ''
   
    pattern_string1 = 'False'
    columns_to_search = ['Manual']
    for col in columns_to_search:
        mask = df[col].astype(str).str.contains(pattern_string1, case=False, na=False)
        df.loc[mask, col] = ''

    pattern_string2 = 'True'
    for col in columns_to_search:
        mask1 = df[col].astype(str).str.contains(pattern_string2, case=False, na=False)
        df.loc[mask1, col] = 'PASS'
        
    # Dropping the Comment column
    columns_to_drop = ['Comment']
    df.drop(columns=columns_to_drop, inplace=True)

    # Removing the white spaces on comment
    df['ValuationComment'] = df['ValuationComment'].apply(lambda x: re.sub(r'\s*$', '', x) if isinstance(x, str) else x)

    new_column_names = {'Name': 'Name','Valuation':'Output','ValuationComment':'Comment','Gesamtergebnis': 'Total','Manual': 'Manually_Tested'}

    # Rename columns using .rename() methodNames
    df1 = df.rename(columns=new_column_names)
    
    return df1


def ingest(data_path):
    # list for document and df
    document = []
    dataframe_data = []

    for folder_name in folders['folder_name']:
        source_directory = data_path + '/' + folder_name
        print("in loader")
        if os.path.exists(source_directory):
            print("loading documents")
            documents = load_documents(source_directory)
        # Extract data from testCase elements
        for report in documents:

            for testCase in report.findall('.//testCase'):
                comment = testCase.get('comment')
                name = testCase.get('name')
                valuation = testCase.get('valuation')
                valuationComment = testCase.get('valuationComment')

                data = {
                    'Comment': comment,
                    'Name': name,
                    'Valuation': valuation,
                    'ValuationComment': valuationComment
                }

                dataframe_data.append(data)
                
            # First df
            df = pd.DataFrame(dataframe_data)
            
            dataframe_data1 = []

            pattern_string = r"Gesamtergebnis: (\w+)"
            for x in df['Comment']:
                pattern = re.findall(pattern_string, ""+x, re.DOTALL)
                if pattern:
                    data = {
                        'Gesamtergebnis': pattern[0]
                    }
                    dataframe_data1.append(data)
                else:
                    dataframe_data1.append({
                        'Gesamtergebnis': ''
                    })

            df1 = pd.DataFrame(dataframe_data1)
            
            new_df = pd.concat([df, df1], axis=1)

            # matching pattern to dataframe
            new_dataframe = pattern_to_dataframe(new_df)
            print(new_dataframe)
            #connect sqlite3
            conn = sqlite3.connect(f"{os.environ.get('DB_PATH')}")

            # Transfer data to SQLite database
            new_dataframe.to_sql('db', conn, if_exists='replace', index=False)
            
            conn.close()

def Mistral_Chain():
    
    answer_prompt = PromptTemplate.from_template(
        """<s>[INST]Given a user question and the result. You are a bot suppose to answer the question using the result given.

    Question: {question}
    Result: {result}
    [/INST]
    </s>
    Answer: """
    )
    
    answer_prompt1 = PromptTemplate.from_template(
        """<s>[INST]Given the following user question and result, answer the user question.

    Question: {question}
    Result: {result}
    [/INST]
    </s>
    Answer: """
    )
    model_path = (r"models\mistral-7b-instruct-v0.2.Q5_0.gguf")
    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
    llm = LlamaCpp(
            model_path=model_path,
            verbose=True,
            n_ctx=2048,
            context_window=4096,
            max_new_tokens=1000,
            callback_manager=callback_manager,
            top_k=50,
            temperature=0.3,
            repetition_penalty=1.03,
            streaming=False,
    )
    print("LLM Loaded")
    # connect DB
    db = SQLDatabase.from_uri(f"sqlite:///{os.environ.get('DB_PATH')}")
    execute_query = QuerySQLDataBaseTool(db=db)
    write_query = create_sql_query_chain(llm, db=db)
    answer = answer_prompt | llm | StrOutputParser()
    chain = (
        RunnablePassthrough.assign(query=write_query).assign(
            result=itemgetter("query") | execute_query
        )
        | answer
    )

    return chain

def Mistral_Chain_Instruct():
    model_path = (r"models\mistral-7b-instruct-v0.2.Q5_0.gguf")
    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
    llm = LlamaCpp(
            model_path=model_path,
            verbose=True,
            n_ctx=2048,
            context_window=4096,
            max_new_tokens=1000,
            callback_manager=callback_manager,
            top_k=50,
            temperature=0.3,
            repetition_penalty=1.03,
            streaming=False,
    )
    print("LLM Loaded")
    # Connect DB
    db = SQLDatabase.from_uri(f"sqlite:///{os.environ.get('DB_PATH')}")

    sql_chain = create_sql_query_chain(llm, db=db)
    
    return sql_chain
    
def format_result(result):
    answers = ast.literal_eval(result)
    output = ''
    for answer in answers:
        if answer[0] != '':
            output = output + str(answer[0]) +'.\n'
    return output