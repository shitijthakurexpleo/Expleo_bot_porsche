from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from . import utils
from dotenv import load_dotenv
import os
from langchain_community.utilities.sql_database import SQLDatabase

load_dotenv()
# Create your views here.
conversation = []

@api_view(['GET'])
def folder_names(request):
    '''
    Function to list all folder names
    '''
    json_folders = json.dumps(utils.folders)
    print(json_folders)
    return Response(json_folders, status=200)

@api_view(['GET'])
def model_names(request):
    '''
    Function to list all model names
    '''
    json_models = json.dumps(utils.models)
    print(json_models)
    return Response(json_models, status=200)
    

@api_view(['POST'])
def ingest(request):
    '''
    Function used to convert XML files from dataframe into sqlite DB
    '''
    #/api/ingest
    #TODO: 
    # 1. ingest files from source directory(data)
    print("DataPath",os.environ.get('Data_PATH'))
    utils.ingest(data_path='data')
    # 4. response -> status-200, 
    return Response('Ingest completed successfully',status=200)
    pass

@api_view(['GET'])
def prompts_list(request):
    '''
    Function to list all prompts
    '''
    jsone_prompts = json.dumps(utils.prompts)
    print(jsone_prompts)
    return Response(jsone_prompts, status=200)

@api_view(['POST'])
def clear_files(request):
    '''
    Function used to clear sqlite DB
    '''
    #/api/clear
    # TODO:
    # 1. shutil.clear /data/db
    utils.clear_dir(path='data/db')
    # 2. reponse -> status-200
    return Response('Files Cleared successfully', status=200)

@api_view(['POST'])
def clear_chat(request):
    '''
    Function used to clear conversation history
    '''
    #TODO:
    # 1. clear conversation
    conversation.clear()
    return Response('Conversation Cleared successfully', status=200)

@api_view(['POST'])
def generate_response(request):
    '''
    Function used to generate response based on user input
    '''
    # TODO:
    # input: user question, folder, model_name
    response = json.loads(request.body)
    user_question = response['input']
    folder_name = response['folder']
    model_name = response['model_name']
    # 1. get inputs
    print(user_question,folder_name,model_name)
    # 2. add input to conversation
    conversation.append({'role':'user', 'content':user_question})
    #TODO
    db_path = 'data/db/porsche.db'
    # 3. Select the model type
    if model_name == 'mistral-7b':
        chain = utils.Mistral_Chain()
        answer = chain.invoke({"question": user_question})
    elif model_name == 'mistral-7b-instruct':
        chain = utils.Mistral_Chain_Instruct()
        if os.path.exists(db_path):
            db = SQLDatabase.from_uri(f"sqlite:///{db_path}")
            sql_query = chain.invoke({"question":f"[INST]{user_question}[/INST]"})
            print(sql_query)
            ans = db.run(f'{sql_query}')
            print(ans)
            answer = utils.format_result(ans)
    else:
        return Response('Model Name incorrect', status=404)
   
    # 4. add answer to conversation
    conversation.append({'role':'bot', 'content':answer})
    # 5. stringify conversation
    response_json = json.dumps(conversation)
    print(response_json)
    return Response(response_json, status=200)