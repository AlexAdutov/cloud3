from django.urls import path

from .views import CloudUserAPICreate, CloudUserAPIList, CloudUserAPIRetrieveUpdateDestroy, FileAPICreate, \
    FileAPIRetrieveUpdateDestroy, FileAPIDownload, FileAPICreateExternalLink, FileAPIExternalDownload, UserLoginAPIView, \
    UserLogoutAPIView, SessionView, CSRFTokenView, UserFilesAPIRetrieve

urlpatterns = [
    path('api/login/', UserLoginAPIView.as_view()),
    path('api/logout/', UserLogoutAPIView.as_view()),
    path('api/session/', SessionView.as_view()),
    path('api/csrf/', CSRFTokenView.as_view()),

    path('api/users/', CloudUserAPIList.as_view()),
    path('api/users/registration/', CloudUserAPICreate.as_view()),
    path('api/users/<int:pk>/', CloudUserAPIRetrieveUpdateDestroy.as_view()),

    path('api/userfiles/<int:pk>/', UserFilesAPIRetrieve.as_view()),
    path('api/files/upload/', FileAPICreate.as_view()),
    path('api/files/<int:pk>/', FileAPIRetrieveUpdateDestroy.as_view()),
    path('api/files/<int:pk>/download/', FileAPIDownload.as_view()),
    path('api/files/<int:pk>/generatelink/', FileAPICreateExternalLink.as_view()),

    path('f/<str:link_key>', FileAPIExternalDownload.as_view()),
]
