import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SensorData, User, ArchivedIncident
from .serializers import SensorDataSerializer, ArchivedIncidentSerializer
from datetime import datetime

# Variables globales
compteur = 0  # Compteur d'alertes
incident = False  # Indicateur d'incident

# Fonction pour envoyer un message Telegram
def send_telegram_message(chat_id, message):
    telegram_token = '7558130646:AAFtB5ahO9TvHPZmNApNrjWwfjv2D9-n'
    url = f'https://api.telegram.org/bot{telegram_token}/sendMessage'
    payload = {
        'chat_id': chat_id,
        'text': message
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        print(f"Message envoyé avec succès à {chat_id}")
    else:
        print(f"Erreur lors de l'envoi du message : {response.status_code}")

# Fonction pour envoyer les alertes selon la hiérarchie
def envoyer_alertes_hierarchie(sensor_data):
    global compteur
    message = (
        f"Température : {sensor_data.temp}°C\n"
        f"Date : {sensor_data.date.strftime('%Y-%m-%d')}\n"
        f"Alerte : Température élevée, veuillez vérifier."
    )

    # Récupérer les utilisateurs par niveau d'alerte
    utilisateurs = User.objects.all().order_by('alert_level')

    # Logique des alertes hiérarchiques
    for user in utilisateurs:
        if (user.alert_level == 1 and compteur >= 1) or \
           (user.alert_level == 2 and compteur >= 4) or \
           (user.alert_level == 3 and compteur >= 7):
            personalized_message = f"{message}\nResponsable : {user.name}"
            send_telegram_message(user.telegram_chat_id, personalized_message)

class SensorDataView(APIView):
    """
    API view to handle retrieving and posting sensor data.
    """
    def get(self, request):
        data = SensorData.objects.all()
        serializer = SensorDataSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        global compteur, incident
        print("Données reçues : ", request.data)
        serializer = SensorDataSerializer(data=request.data)

        if serializer.is_valid():
            sensor_data = serializer.save()
            print(f"Temperature: {sensor_data.temp}, Threshold: 10")

            if sensor_data.temp > 10:
                print(f"High temperature detected: {sensor_data.temp}°C")
                incident = True  # Set incident to True
                if not incident:
                    compteur = 0
                compteur += 1
                print(f"Incident: {incident}, Counter: {compteur}")
                envoyer_alertes_hierarchie(sensor_data)
            else:
                incident = False
                compteur = 0
                print("Temperature normal, incident reset")

            return Response({
                **serializer.data,
                "incident_status": incident,
                "counter": compteur
            }, status=201)

        print("Erreurs de validation : ", serializer.errors)
        return Response(serializer.errors, status=400)

class LastSensorDataView(APIView):
    """
    API view to retrieve the latest sensor data.
    """
    def get(self, request):
        try:
            last_data = SensorData.objects.latest('date')
            serializer = SensorDataSerializer(last_data)
            return Response(serializer.data)
        except SensorData.DoesNotExist:
            return Response({"error": "Aucune donnée trouvée"}, status=404)

# Vue pour vérifier l'état actuel de l'incident
class IncidentStatusView(APIView):
    def get(self, request):
        global incident, compteur
        try:
            last_data = SensorData.objects.latest('date')
            print(f"Checking incident status - Last temp: {last_data.temp}")
            
            # Update incident status based on current temperature
            if last_data.temp > 10:
                incident = True
                if compteur == 0:
                    compteur = 1
                print(f"High temperature detected in status check: {last_data.temp}°C")
                return Response({
                    "incident": True,
                    "start_date": last_data.date.strftime('%Y-%m-%d %H:%M:%S'),
                    "compteur": compteur,
                    "current_temp": last_data.temp  # Added for debugging
                })
            else:
                incident = False
                compteur = 0
                print(f"Normal temperature in status check: {last_data.temp}°C")
                return Response({
                    "incident": False,
                    "current_temp": last_data.temp  # Added for debugging
                })
                
        except SensorData.DoesNotExist:
            print("No sensor data found")
            return Response({
                "incident": False,
                "error": "No sensor data available"
            })

class AcknowledgeIncidentView(APIView):
    def post(self, request):
        global incident, compteur
        try:
            last_data = SensorData.objects.latest('date')
            if incident:
                # Create archived incident
                ArchivedIncident.objects.create(
                    start_date=request.data.get('start_date'),
                    max_temperature=last_data.temp,
                    alert_count=compteur,
                    acknowledged_by=request.data.get('acknowledged_by', 'Unknown')
                )
                # Reset incident
                incident = False
                compteur = 0
                return Response({"message": "Incident acknowledged and archived"})
            return Response({"message": "No active incident to acknowledge"})
        except SensorData.DoesNotExist:
            return Response({"error": "No sensor data found"}, status=404)

class ArchivedIncidentsView(APIView):
    def get(self, request):
        archives = ArchivedIncident.objects.all().order_by('-start_date')
        serializer = ArchivedIncidentSerializer(archives, many=True)
        return Response(serializer.data)