import sys
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from restr_ratings.models import Restaurant, Rating
from django import forms
import matplotlib
matplotlib.use('Agg')
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import django

from essential import output

COLUMN_NAMES = [
        'Name',
        'Neighborhood',
        'Cuisine',
        'Price',
        'Food Score',
        'Ambience Score',
        'Service Score',
        'Price Score',
]

MAX_NUM = 7

class SearchForm(forms.Form):
    restr = forms.CharField(
        label = 'Restaurant', 
        max_length = 100,
        required = True)
    location = forms.CharField(
        label = 'Location',
        help_text = 'Specify branch location. (Optional)',
        max_length = 100,
        required = False)
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
        context['search'] = True
        form = SearchForm(request.POST)
        args = {}
        if form.is_valid():
            restr = form.cleaned_data['restr']
            location = form.cleaned_data['location']
            nbh = form.cleaned_data['nbh']
            catg = form.cleaned_data['catg']
            price = form.cleaned_data['price']
        args['restr'] = [restr]
        if location:
            args['restr'] = [restr, location]
        ls = sorted([[nbh,'nbh'],[price,'price'],[catg,'category']])
        args['order'] = [i[1] for i in ls]
        all_ls = output.find_restr(args, Restaurant, MAX_NUM)
        context['columns'] = COLUMN_NAMES
        if all_ls == []:
            context['summaries'] = []
            context['text'] = 'Sorry, I did not find the restaurant you are looking for. Please try another one.'
        else:
            context['graphics'] = []
            for restr_ls in all_ls:
                path_name = output.plot_scatter(restr_ls, Restaurant, str(all_ls.index(restr_ls)))
                context['graphics'].append(path_name)
            context['summaries'] = []             
            for restr_ls in all_ls:
                summary = []
                for r in restr_ls:
                    row = [r.restr_name, r.restr_neighborhood, r.restr_cuisine, r.restr_price, r.food_score, r.ambience_score, r.service_score, r.price_score]
                    summary.append(row)
                context['summaries'].append(summary)

    else:
        form = SearchForm()
        context['search'] = False
        context['text'] = 'If the restaurant doesn\'t show up, make sure the spelling is correct or try another one!'
        context['suggest'] = 'Suggested Searches: The Purple Pig, Oriole, MingHin Cuisine (Location: The Loop)'
    context['form'] = form

    return render(request, 'name.html', context)
