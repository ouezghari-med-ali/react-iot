from django.contrib import admin
from .models import SensorData
from .models import User

@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ('temp', 'hum', 'date')  # Utilisez 'temp' et 'hum' au lieu de 'temperature' et 'humidity'


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'telegram_chat_id', 'alert_level')