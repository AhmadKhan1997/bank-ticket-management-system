from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Counter, Ticket
from .serializers import CategorySerializer, CounterSerializer, TicketSerializer
from .broadcast import broadcast_ticket_update

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class CounterListView(generics.ListAPIView):
    queryset = Counter.objects.filter(is_active=True)
    serializer_class = CounterSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        new_ticket = serializer.save()
        broadcast_ticket_update("created", TicketSerializer(new_ticket).data)


class TicketDetailView(generics.RetrieveUpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]


class CallNextTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        counter_id = request.data.get('counter_id')

        if counter_id is None:
            return Response(
                {"error": "counter_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            counter = Counter.objects.get(id=counter_id)
        except Counter.DoesNotExist:
            return Response(
                {"error": "Counter not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Ticket.Meta.ordering already sorts by skip_count then created_at,
        # so the first WAITING ticket in this queryset is the correct next one.
        waiting_tickets = Ticket.objects.filter(status=Ticket.STATUS_WAITING)

        if waiting_tickets.count() == 0:
            return Response(
                {"error": "No tickets waiting in the queue."},
                status=status.HTTP_404_NOT_FOUND,
            )

        next_ticket = waiting_tickets.first()

        next_ticket.status = Ticket.STATUS_CALLED
        next_ticket.counter = counter
        next_ticket.agent = request.user
        next_ticket.called_at = timezone.now()
        next_ticket.save()

        serializer = TicketSerializer(next_ticket)
        broadcast_ticket_update("called", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SkipTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            ticket = Ticket.objects.get(id=pk)
        except Ticket.DoesNotExist:
            return Response(
                {"error": "Ticket not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        ticket.skip_count = ticket.skip_count + 1
        ticket.status = Ticket.STATUS_WAITING
        ticket.counter = None
        ticket.agent = None
        ticket.called_at = None
        ticket.save()

        serializer = TicketSerializer(ticket)
        broadcast_ticket_update("skipped", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NoShowTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            ticket = Ticket.objects.get(id=pk)
        except Ticket.DoesNotExist:
            return Response(
                {"error": "Ticket not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        ticket.status = Ticket.STATUS_NO_SHOW
        ticket.closed_at = timezone.now()
        ticket.save()

        serializer = TicketSerializer(ticket)
        broadcast_ticket_update("no_show", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OpenTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            ticket = Ticket.objects.get(id=pk)
        except Ticket.DoesNotExist:
            return Response(
                {"error": "Ticket not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        ticket.status = Ticket.STATUS_IN_PROGRESS
        ticket.started_at = timezone.now()
        ticket.save()

        serializer = TicketSerializer(ticket)
        broadcast_ticket_update("opened", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CompleteTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            ticket = Ticket.objects.get(id=pk)
        except Ticket.DoesNotExist:
            return Response(
                {"error": "Ticket not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        problem_text = request.data.get('problem_description', '')
        solution_text = request.data.get('solution_provided', '')
        feedback_text = request.data.get('feedback', '')

        if problem_text.strip() == '' or solution_text.strip() == '':
            return Response(
                {"error": "problem_description and solution_provided are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ticket.status = Ticket.STATUS_COMPLETED
        ticket.problem_description = problem_text
        ticket.solution_provided = solution_text
        ticket.feedback = feedback_text
        ticket.closed_at = timezone.now()
        ticket.save()

        serializer = TicketSerializer(ticket)
        broadcast_ticket_update("completed", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

from accounts.permissions import IsAdminRole


class CounterDetailView(generics.RetrieveUpdateAPIView):
    queryset = Counter.objects.all()
    serializer_class = CounterSerializer
    permission_classes = [IsAdminRole]