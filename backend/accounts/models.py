from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = "ADMIN"
    ROLE_AGENT = "AGENT"

    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_AGENT, "Agent"),
    ]

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=ROLE_AGENT,
    )

    def is_admin_user(self):
        if self.role == self.ROLE_ADMIN:
            return True
        else:
            return False

    def is_agent_user(self):
        if self.role == self.ROLE_AGENT:
            return True
        else:
            return False

    def __str__(self):
        return self.username + " (" + self.role + ")"