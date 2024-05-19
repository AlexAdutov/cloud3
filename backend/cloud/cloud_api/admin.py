from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CloudUserCreationForm, CloudUserChangeForm
from .models import CloudUser, File

class CloudUserAdmin(UserAdmin):
    add_form = CloudUserCreationForm
    form = CloudUserChangeForm
    model = CloudUser
    list_display = ['username', 'email']


admin.site.register(CloudUser, CloudUserAdmin)
admin.site.register(File)
