import random
import string

def get_user_directory_path(instance, filename):
    """
    Определяет путь к файлу при его сохранении
    """
    return f'{instance.cloud_user.username}/{filename}'

def generate_external_link_key():
    """
    Генерирует ключ из символов и цифр
    """
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(6))
