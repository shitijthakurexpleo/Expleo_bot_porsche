from django.urls import path
from .views import *

urlpatterns = [
    path('api/ingest', ingest),
    path('api/generate_response', generate_response),
    path('api/folder_names', folder_names),
    path('api/models', model_names),
    path('api/prompts', prompts_list),
    path('api/clear_files', clear_files),
    path('api/clear_chat', clear_chat),
]
