from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .forms import NameForm

def get_name(request):
	if request.method == 'POST':
		form = NameForm(request.POST)
		return HttpResponse('thanks.')
	else:
		form = NameForm()

	return render(request, 'name.html', {'form': form})
