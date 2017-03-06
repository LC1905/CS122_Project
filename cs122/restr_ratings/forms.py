from django import forms


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
