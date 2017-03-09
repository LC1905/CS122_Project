from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from restr_ratings.models import Restaurant, Rating
from django import forms
COLUMN_NAMES = [
        'Name',
        'Neighborhood',
        'Cuisine',
        'Food Rating',
        'Ambience Rating',
        'Service Rating',
        'Price_rating',
]

restr_ls = ['Girl & the Goat', 'Oriole', 'Eden', 'Alinea', 'Lowcountry']



class SearchForm(forms.Form):
    restr = forms.CharField(
        label = 'Restaurant', 
        max_length = 100,
        required = True)
    nbh = forms.IntegerField(
        label = 'Rank Neighborhood', 
        help_text = 'e.g. 1 (meaning the most important)',
        required = True,
        min_value = 1,
        max_value = 3)
    catg = forms.IntegerField(
        label = 'Rank Category', 
        help_text = 'e.g. 3 (meaning the least important)',
        required = True,
        min_value = 1,
        max_value = 3)
    price = forms.IntegerField(
        label = 'Rank Price', 
        help_text = 'e.g. 2 (order must not repeat)',
        required = True,
        min_value = 1,
        max_value = 3)


def get_name(request):
    context = {}
    if request.method == 'POST':
        form = SearchForm(request.POST)

        # plot
        context['columns'] = COLUMN_NAMES
        summary = []
        for restr in restr_ls:
            r = Restaurant.objects.get(restr_name = restr)
            row = [r.restr_name, r.restr_neighborhood, r.restr_cuisine, r.food_score, r.ambience_score, r.service_score, r.price_score]
            summary.append(row)
        # name_ls = [Restaurant.objects.get(restr_name = restr).restr_name for restr in restr_ls]
        # nbh_ls = [Restaurant.objects.get(restr_name = restr).restr_neighborhood for restr in restr_ls]
        # cuisine_ls = [Restaurant.objects.get(restr_name = restr).restr_cuisine for restr in restr_ls]
        # food_ls = [Restaurant.objects.get(restr_name = restr).food_score for restr in restr_ls]
        # ambience_ls = [Restaurant.objects.get(restr_name = restr).ambience_score for restr in restr_ls]
        # service_ls = [Restaurant.objects.get(restr_name = restr).service_score for restr in restr_ls]
        # price_ls = [Restaurant.objects.get(restr_name = restr).price_score for restr in restr_ls]
        context['summary'] = summary
    else:
        form = SearchForm()
    context['form'] = form
    # return context['summary']

    return render(request, 'name.html', context)