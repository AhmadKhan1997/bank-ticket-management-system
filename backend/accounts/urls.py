from django.urls import path
from .views import CurrentUserView, AgentListCreateView, AgentDeleteView

urlpatterns = [
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('agents/', AgentListCreateView.as_view(), name='agent-list-create'),
    path('agents/<int:pk>/', AgentDeleteView.as_view(), name='agent-delete'),
]