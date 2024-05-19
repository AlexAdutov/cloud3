'''Этот код представляет API-представления для вашего приложения Django. Вот краткое описание каждого из них:
CloudUserAPICreate: Это представление REST API для создания нового пользователя. Оно обрабатывает POST-запросы и создает нового пользователя в базе данных.
UserLoginAPIView: Это представление REST API для аутентификации пользователей. Оно принимает POST-запрос с логином и паролем пользователя, а затем аутентифицирует пользователя.
UserLogoutAPIView: Это представление REST API для выхода пользователя из системы. Оно обрабатывает GET-запрос и разрывает сеанс пользователя.
SessionView: Это представление REST API для проверки сеанса пользователя. Оно возвращает информацию о текущем пользователе и его статусе аутентификации.
CSRFTokenView: Это представление REST API для получения токена CSRF. Оно возвращает токен CSRF для защиты от межсайтовой подделки запросов (CSRF).
CloudUserAPIRetrieveUpdateDestroy: Это представление REST API для просмотра, обновления и удаления пользователей. Оно позволяет только администраторам просматривать, обновлять и удалять пользователей.
CloudUserAPIList: Это представление REST API для просмотра списка пользователей. Оно возвращает список всех пользователей в системе.
FileAPICreate: Это представление REST API для загрузки нового файла. Оно принимает POST-запрос с данными файла и сохраняет его в базе данных.
FileAPIRetrieveUpdateDestroy: Это представление REST API для просмотра, обновления и удаления файлов. Оно позволяет пользователям просматривать, обновлять и удалять только свои собственные файлы.
UserFilesAPIRetrieve: Это представление REST API для просмотра файлов, принадлежащих определенному пользователю.
FileAPIDownload: Это представление REST API для скачивания файла. Оно возвращает запрошенный файл для скачивания.
FileAPIExternalDownload: Это представление REST API для скачивания файла по внешней ссылке. Оно возвращает запрошенный файл для скачивания по его внешнему ключу.
FileAPICreateExternalLink: Это представление REST API для создания внешней ссылки на файл. Оно генерирует уникальный внешний ключ и связывает его с запрошенным файлом.
'''

import os
import logging

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password
from django.http import FileResponse
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cloud.settings import MEDIA_ROOT
from .models import CloudUser, File
from .permissions import IsAdmin, IsAdminOrUser, IsAdminOrFileOwner
from .serializers import CloudUserSerializer, FileSerializer, CloudUsersDetailSerializer
from .utils import generate_external_link_key

logger = logging.getLogger('main')

class CloudUserAPICreate(generics.CreateAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer

    def perform_create(self, serializer):
        username = serializer.validated_data['username']
        password = make_password(serializer.validated_data['password'])
        serializer.save(storage_directory=username, password=password, is_staff=True, is_active=True)
        logger.info(f'Зарегистрирован новый пользователь {username}')


class UserLoginAPIView(APIView):
    def post(self, request, format=None):
        if request.user.is_authenticated:
            return Response({'detail': 'Пользователь уже аутентифицирован.'}, status=status.HTTP_200_OK)
        else:
            username = request.data.get('username')
            password = request.data.get('password')
        if username is None or password is None:
            return Response({'detail': 'Укажите логин и пароль.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            logger.warning(f'Неудачная попытка входа в систему')
            return Response({'detail': 'Неверные данные.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            login(request, user)
            logger.info(f'Пользователь {username} успешно вошёл в систему')
            return Response(
                {
                    'detail': 'Успешный вход в систему.',
                    'userID': user.id,
                    'username': user.username,
                    'isAdmin': request.user.is_superuser
                },
                status=status.HTTP_200_OK
            )


class UserLogoutAPIView(APIView):
    @staticmethod
    def get(request, format=None):
        logout(request)
        logger.info(f'Пользователь {request.user} вышел из системы')

        return Response({'detail': 'Успешный выход из системы.'}, status=status.HTTP_200_OK)


class SessionView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return Response(
            {
                'detail': 'Пользователь успешно аутентифицирован.',
                'userID': request.user.id,
                'username': request.user.username,
                'isAdmin': request.user.is_superuser
            },
            status=status.HTTP_200_OK
        )


class CSRFTokenView(APIView):
    @staticmethod
    def get(request, format=None):
        csrf_token = get_token(request)
        return Response({'csrf': csrf_token}, status=status.HTTP_200_OK)


class CloudUserAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUserSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        instance.delete()
        instance.delete_storage()
        logger.info(f'Пользователь {instance} удален')


class CloudUserAPIList(generics.ListAPIView):
    queryset = CloudUser.objects.all().order_by('-date_joined')
    serializer_class = CloudUsersDetailSerializer
    permission_classes = [IsAdmin]


class FileAPICreate(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        file_exist = self.queryset.filter(filename=serializer.validated_data['content'].name).filter(cloud_user=serializer.validated_data['cloud_user'])
        if file_exist:
            raise ValidationError({'content': ['Файл с таким именем уже существует']})
        uploaded_file_name = serializer.validated_data['content'].name
        uploaded_file_size = serializer.validated_data['content'].size
        serializer.save(filename=uploaded_file_name, size=uploaded_file_size)
        logger.info(f'Пользователь {serializer.validated_data["cloud_user"]} загрузил файл {serializer.validated_data["content"].name}')


class FileAPIRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def perform_destroy(self, instance):
        storage = instance.content.storage
        path = instance.content.path
        instance.delete()
        storage.delete(path)
        logger.info(f'Файл {instance} пользователя {instance.cloud_user} удалён')

    def perform_update(self, serializer):
        if 'filename' in serializer.validated_data:
            file_exist = self.queryset.filter(filename=serializer.validated_data['filename']).filter(cloud_user=self.request.user)
            if file_exist:
                raise ValidationError({'content': ['Файл с таким именем уже существует']})
            old_name = serializer.instance.filename
            old_path = serializer.instance.content.path
            new_filename = serializer.validated_data['filename']
            content = serializer.instance.cloud_user.username + '/' + new_filename
            os.rename(old_path, os.path.join(serializer.instance.content.storage.location, serializer.instance.cloud_user.username, new_filename))
            serializer.save(content=content)
            logger.info(f'Пользователь {self.request.user} изменил имя файла {old_name} на {new_filename}')
        else:
            serializer.save()
            logger.info(f'Пользователь {self.request.user} изменил данные файла {serializer.instance.filename}')


class UserFilesAPIRetrieve(generics.RetrieveAPIView):
    queryset = CloudUser.objects.all()
    serializer_class = CloudUsersDetailSerializer
    permission_classes = [IsAdminOrUser]


class FileAPIDownload(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            file = self.queryset.get(pk=pk)
        except ObjectDoesNotExist:
            logger.error(f'Файл с ключом {pk} не найден в базе данных')
            raise NotFound(detail=f'Запись о файле c id {pk} не найдена в базе данных')
        self.check_object_permissions(request, file)
        file_path = f'{MEDIA_ROOT}/{file.content}'
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'), as_attachment=True)
            response['Access-Control-Expose-Headers'] = 'Filename'
            response['Content-Disposition'] = f'attachment; filename="{file}"'
            response['Filename'] = file
            file.last_download = timezone.now()
            file.save()
            logger.info(f'Успешно скачан файл {file.content}')
            return response
        else:
            logger.error(f'Файл отсутствует по пути {file.content}')
            return Response({'detail': 'Файл не найден'}, status=status.HTTP_404_NOT_FOUND)


class FileAPIExternalDownload(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get(self, request, *args, **kwargs):
        link_key = kwargs.get('link_key')
        try:
            file = self.queryset.get(external_link_key=link_key)
        except ObjectDoesNotExist:
            logger.error(f'Попытка скачать файл с внешним ключом {link_key}, который не найден в базе данных')
            return redirect('/download')
        file_path = f'{MEDIA_ROOT}/{file.content}'
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'), as_attachment=True)
            response['Access-Control-Expose-Headers'] = 'Filename'
            response['Content-Disposition'] = f'attachment; filename="{file}"'
            response['Filename'] = file
            file.last_download = timezone.now()
            file.save()
            logger.info(f'Успешно скачан файл {file.content}')
            return response
        else:
            logger.error(f'Попытка скачать файл, отсутствуещий по пути {file.content}')
            return redirect('/download')


class FileAPICreateExternalLink(generics.RetrieveAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAdminOrFileOwner]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            file = self.queryset.get(pk=pk)
        except ObjectDoesNotExist:
            logger.error(f'Файл с ключом {pk} не найден в базе данных')
            raise NotFound(detail=f'Запись о файле c id {pk} не найдена в базе данных')
        self.check_object_permissions(request, file)
        for i in range(25):
            external_link_key = generate_external_link_key()
            if File.objects.filter(external_link_key=external_link_key).exists():
                continue
            else:
                file.external_link_key = external_link_key
                file.save()
                logger.info(f'Успешная генерация внешнего ключа для файла {file.content}')
                return self.retrieve(request, *args, **kwargs)
        else:
            logger.error(f'Ошибка генерации внешнего ключа для файла {file.content}')
            return Response({'detail': 'Не удалось создать ключ внешней ссылки, обратитесь к администратору'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

