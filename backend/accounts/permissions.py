from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated == False:
            return False

        if request.user.role == request.user.ROLE_ADMIN:
            return True
        else:
            return False