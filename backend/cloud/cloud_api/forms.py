from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CloudUser

class CloudUserCreationForm(UserCreationForm):

    class Meta:
        model = CloudUser
        fields = ['username', 'email']

class CloudUserChangeForm(UserChangeForm):

    class Meta:
        model = CloudUser
        fields = ['username', 'email']
