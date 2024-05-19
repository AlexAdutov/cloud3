from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    """
    Разрешает доступ только для администратора
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsAdminOrUser(BasePermission):
    """
    Разрешает доступ только для администратора или пользователя
    """
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user == obj) or bool(request.user and request.user.is_superuser)


class IsAdminOrFileOwner(BasePermission):
    """
    Разрешает доступ только для администратора или владельца файла
    """
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user == obj.cloud_user) or bool(request.user and request.user.is_superuser)
