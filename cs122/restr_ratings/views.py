from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .forms import SearchForm
import output

def get_name(request):
    context = {}
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            args = {}
            restr = form.clean_data['restr']
            if restr:
                arg['restr'] = restr
            nbh = form.clean_data['nbh']
            catg = form.clean_data['catg']
            price = form.clean_data['price']
            if nbh and catg and price:
                ls = sorted([[nbh,'nbh'],[price,'price'],[catg,'category']])
                arg['order'] = [i[1] for i in ls]
            # <<<This is the output>>>
            # try:
            #     restr_table = output.find_restr(args)
            #     restr_plot = output.plot_scatter(restr_table)
    return HttpResponse('thanks.')
    else:
        form = SearchForm()
    context['form'] = form

    return render(request, 'name.html', context)
