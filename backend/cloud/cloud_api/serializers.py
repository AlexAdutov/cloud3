import re

from rest_framework import serializers

from .models import CloudUser, File


class CloudUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CloudUser
        fields = ['username', 'password', 'email', 'is_superuser']

    def validate_username(self, value):
        """
        Валидирует username
        (только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов)
        """
        pattern = r'^[a-zA-Z][a-zA-Z0-9]{3,19}$'
        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError('Логин не соответствует правилам.')
        return value

    def validate_password(self, value):
        """
        Валидирует сложность пароля
        (не менее 6 символов, как минимум одна заглавная буква, одна цифра и один специальный символ)
        """
        pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[\W\_]).{6,}$'
        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError('Пароль не соответствует правилам.')
        return value


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = '__all__'


class FileSerializerUserDetail(serializers.ModelSerializer):
    class Meta:
        model = CloudUser


class CloudUsersDetailSerializer(serializers.ModelSerializer):
    files = FileSerializer(read_only=True, many=True)

    class Meta:
        model = CloudUser
        fields = ['id', 'username', 'email', 'date_joined', 'last_login', 'files', 'is_superuser']
