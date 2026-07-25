from django.urls import path
from .views import (
    CategoryListView,
    CounterListView,
    CounterDetailView,
    TicketListCreateView,
    TicketDetailView,
    CallNextTicketView,
    SkipTicketView,
    NoShowTicketView,
    OpenTicketView,
    CompleteTicketView,
)
from .tts_view import AnnouncementAudioView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('counters/', CounterListView.as_view(), name='counter-list'),
    path('counters/<int:pk>/', CounterDetailView.as_view(), name='counter-detail'),
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/call-next/', CallNextTicketView.as_view(), name='ticket-call-next'),
    path('tickets/<int:pk>/skip/', SkipTicketView.as_view(), name='ticket-skip'),
    path('tickets/<int:pk>/no-show/', NoShowTicketView.as_view(), name='ticket-no-show'),
    path('tickets/<int:pk>/open/', OpenTicketView.as_view(), name='ticket-open'),
    path('tickets/<int:pk>/complete/', CompleteTicketView.as_view(), name='ticket-complete'),
    path('announcement-audio/', AnnouncementAudioView.as_view(), name='announcement-audio'),
]