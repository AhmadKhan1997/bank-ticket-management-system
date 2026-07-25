from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer, CreateAgentSerializer
from .permissions import IsAdminRole


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class AgentListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(role=User.ROLE_AGENT)
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateAgentSerializer
        else:
            return UserSerializer


class AgentDeleteView(generics.DestroyAPIView):
    queryset = User.objects.filter(role=User.ROLE_AGENT)
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]