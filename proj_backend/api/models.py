# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('receptionist', 'Receptionist'),
        ('visitor', 'Visitor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Visitor(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_initial = models.CharField(max_length=2, blank=True)
    age = models.PositiveIntegerField()
    address = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    purpose = models.CharField(max_length=100)
    purpose_other = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=100)
    department_other = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    time = models.TimeField()
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    location_history = models.JSONField(default=list, blank=True, help_text="List of locations (departments) visited by the visitor, in order.")

    class Meta:
        db_table = 'api_visitor'

    def __str__(self):
        return f"{self.last_name}, {self.first_name} - {self.date} {self.time}"
