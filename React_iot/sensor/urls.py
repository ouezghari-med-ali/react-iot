from django.urls import path
from .views import SensorDataView, LastSensorDataView,IncidentStatusView, AcknowledgeIncidentView, ArchivedIncidentsView

urlpatterns = [
    path('data/', SensorDataView.as_view(), name='sensor_data'),
    path('data/last/', LastSensorDataView.as_view(), name='last_sensor_data'),
    path('incident/status/', IncidentStatusView.as_view(), name='incident_status'),
    path('incident/acknowledge/', AcknowledgeIncidentView.as_view(), name='acknowledge_incident'),
    path('incident/archives/', ArchivedIncidentsView.as_view(), name='archived_incidents'),
]
