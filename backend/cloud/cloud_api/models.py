import os
import shutil
import logging

from django.contrib.auth.models import AbstractUser
from django.db import models

from cloud.settings import MEDIA_ROOT
from .utils import get_user_directory_path

# Получаем логгер с именем 'main' из конфигурации логирования
logger = logging.getLogger('main')

# Класс модели пользователя
class CloudUser(AbstractUser):
    email = models.EmailField(unique=True)  # Поле для адреса электронной почты пользователя
    storage_directory = models.CharField(max_length=100, blank=True)  # Папка хранения пользователя

    # Метод для удаления директории пользователя
    def delete_storage(self):
        # Удаляем директорию пользователя и все ее содержимое
        shutil.rmtree(os.path.join(MEDIA_ROOT, str(self.storage_directory)), ignore_errors=True)
        logger.info(f'Директория пользователя {self.username} удалена')

    def __str__(self):
        return self.username  # Возвращаем имя пользователя в виде строки


# Класс модели файла
class File(models.Model):
    cloud_user = models.ForeignKey(CloudUser, on_delete=models.CASCADE, related_name='files')  # Связь с пользователем
    filename = models.CharField(max_length=100, blank=True)  # Имя файла
    size = models.IntegerField(blank=True)  # Размер файла
    comment = models.CharField(max_length=255, blank=True)  # Комментарий к файлу
    date_uploaded = models.DateTimeField(auto_now_add=True)  # Дата загрузки файла
    last_download = models.DateTimeField(null=True)  # Дата последней загрузки
    external_link_key = models.URLField(blank=True)  # Ключ для внешней ссылки на файл
    content = models.FileField(upload_to=get_user_directory_path)  # Файловое поле с пользовательским путем сохранения

    def __str__(self):
        return self.filename  # Возвращаем имя файла в виде строки
