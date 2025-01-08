from django.db import models

class SensorData(models.Model):
    temp = models.FloatField()  # Température
    hum = models.FloatField()   # Humidité
    date = models.DateTimeField(auto_now_add=True)  # Date de la mesure

    def __str__(self):
        return f"Temp: {self.temp}, Hum: {self.hum}"


class User(models.Model):
    name = models.CharField(max_length=100)  # Nom de l'utilisateur
    telegram_chat_id = models.CharField(max_length=50)  # ID Telegram de l'utilisateur
    alert_level = models.IntegerField()  # Niveau d'alerte (1, 2 ou 3)

    def __str__(self):
        return f"{self.name} (Niveau {self.alert_level})"


class ArchivedIncident(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(auto_now_add=True)
    max_temperature = models.FloatField()
    alert_count = models.IntegerField()
    acknowledged_by = models.CharField(max_length=100)  # Name of person who acknowledged

    def __str__(self):
        return f"Incident from {self.start_date} to {self.end_date}"