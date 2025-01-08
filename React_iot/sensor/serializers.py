from rest_framework import serializers
from .models import SensorData, ArchivedIncident

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['temp', 'hum', 'date']  # Utiliser directement 'temp', 'hum' et 'date'

class ArchivedIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivedIncident
        fields = ['id', 'start_date', 'end_date', 'max_temperature', 'alert_count', 'acknowledged_by']
