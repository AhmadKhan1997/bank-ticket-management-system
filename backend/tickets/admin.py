from django.contrib import admin
from .models import Category, Counter, Ticket

admin.site.register(Category)
admin.site.register(Counter)
admin.site.register(Ticket)