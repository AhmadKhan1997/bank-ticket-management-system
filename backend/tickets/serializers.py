from rest_framework import serializers
from .models import Category, Counter, Ticket


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'prefix_code', 'is_active']


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = ['id', 'number', 'name', 'is_active', 'current_agent', 'categories']


class TicketSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_number',
            'category',
            'category_name',
            'counter',
            'agent',
            'status',
            'skip_count',
            'problem_description',
            'solution_provided',
            'feedback',
            'created_at',
        ]