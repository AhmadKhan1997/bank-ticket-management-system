from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    prefix_code = models.CharField(max_length=3, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Counter(models.Model):
    number = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    current_agent = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_counter",
    )

    categories = models.ManyToManyField(
        Category,
        related_name="counters",
        blank=True,
    )

    def __str__(self):
        return "Counter " + str(self.number)


class Ticket(models.Model):
    STATUS_WAITING = "WAITING"
    STATUS_CALLED = "CALLED"
    STATUS_IN_PROGRESS = "IN_PROGRESS"
    STATUS_COMPLETED = "COMPLETED"
    STATUS_NO_SHOW = "NO_SHOW"

    STATUS_CHOICES = [
        (STATUS_WAITING, "Waiting"),
        (STATUS_CALLED, "Called"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_NO_SHOW, "No Show"),
    ]

    ticket_number = models.CharField(max_length=10, unique=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="tickets",
    )
    counter = models.ForeignKey(
        Counter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tickets",
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="handled_tickets",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_WAITING,
    )

    skip_count = models.PositiveIntegerField(default=0)

    problem_description = models.TextField(blank=True)
    solution_provided = models.TextField(blank=True)
    feedback = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["skip_count", "created_at"]

    def __str__(self):
        return self.ticket_number