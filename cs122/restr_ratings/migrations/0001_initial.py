# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-03-04 20:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating_text', models.CharField(max_length=2000)),
                ('rating_date', models.CharField(max_length=200)),
                ('rating_score', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('restr_name', models.CharField(max_length=200)),
                ('restr_address', models.CharField(max_length=200)),
                ('restr_score', models.FloatField()),
                ('restr_cuisine', models.CharField(max_length=20)),
                ('restr_price', models.CharField(max_length=200)),
                ('restr_neighborhood', models.CharField(max_length=30)),
            ],
        ),
        migrations.AddField(
            model_name='rating',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restr_ratings.Restaurant'),
        ),
    ]