from django.db import models

class Restaurant(models.Model):
    restr_name = models.CharField(max_length=200)
    restr_address = models.CharField(max_length=200)
    restr_score = models.FloatField()
    restr_cuisine = models.CharField(max_length=20)
    restr_price = models.CharField(max_length=200)
    restr_neighborhood = models.CharField(max_length=30)
    def __str__(self):
    	return self.restr_name


class Rating(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rating_text = models.CharField(max_length=2000)
    rating_date = models.CharField(max_length=200)
    rating_score = models.FloatField()
    def __str__(self):
    	return self.rating_text