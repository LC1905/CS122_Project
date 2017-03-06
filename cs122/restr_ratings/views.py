from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .forms import SearchForm

def get_name(request):
	context = {}
	if request.method == 'POST':
		form = SearchForm(request.POST)
		# plot
		return HttpResponse('thanks.')
	else:
		form = SearchForm()
	context['form'] = form
	return render(request, 'name.html', context)
