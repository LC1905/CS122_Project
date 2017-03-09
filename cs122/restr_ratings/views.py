from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from restr_ratings.models import Restaurant, Rating
from django import forms
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import output

COLUMN_NAMES = [
        'Name',
        'Neighborhood',
        'Cuisine',
        'Food Rating',
        'Ambience Rating',
        'Service Rating',
        'Price_rating',
]

MAX_NUM = 7

class SearchForm(forms.Form):
    restr = forms.CharField(
        label = 'Restaurant', 
        max_length = 100,
        required = True)
    location = forms.CharField(
        labels = 'Location',
        help_text = 'Specify branch location. (Optional)'
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
        form = SearchForm(request.POST)
        args = {}
        restr = form.clean_data['restr']
        location = forms.clean_data['location']
        nbh = form.clean_data['nbh']
        catg = form.clean_data['catg']
        price = form.clean_data['price']
        args['restr'] = [restr]
        if location:
            args['restr'] = [restr, location]
        ls = sorted([[nbh,'nbh'],[price,'price'],[catg,'category']])
        args['order'] = [i[1] for i in ls]
        
        try:
            all_ls = output.find_restr(args, Restaurant, MAX_NUM)
            for i, restr_ls in enumerate(all_ls):
                fig = output.plot_scatter(restr_ls, Restaurant)
                canvas = FigureCanvas(fig)
                graphic_i = django.http.HttpResponse(content_type ='image/png')
                canvas.print_png(graphic_i)
                context['graphic'+str(i)] = graphic_i
                
        context['columns'] = COLUMN_NAMES            
        for i, restr_ls in enumerate(all_ls):
            summary = []
            for r in restr_ls:
                row = [r.restr_name, r.restr_neighborhood, r.restr_cuisine, r.food_score, r.ambience_score, r.service_score, r.price_score]
                summary.append(row)
            context['summary'+str(i)] = summary
        context['table_num'] = len(all_ls)
    else:
        form = SearchForm()
    context['form'] = form

    return render(request, 'name.html', context)
