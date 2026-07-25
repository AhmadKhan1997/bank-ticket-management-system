from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    def handle(self, *args, **options):
        username = "admin"
        email = "admin@example.com"
        password = "admin1234"

        user_exists = User.objects.filter(username=username).exists()

        if user_exists == True:
            self.stdout.write("Admin user already exists, skipping.")
        else:
            new_user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
            )
            new_user.role = User.ROLE_ADMIN
            new_user.save()
            self.stdout.write("Admin user created successfully.")