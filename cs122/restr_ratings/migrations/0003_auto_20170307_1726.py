# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-07 17:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restr_ratings', '0002_restaurant_restr_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='ambience_score',
            field=models.FloatField(default=-1),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='food_score',
            field=models.FloatField(default=-1),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='price_score',
            field=models.FloatField(default=-1),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='service_score',
            field=models.FloatField(default=-1),
        ),
    ]
