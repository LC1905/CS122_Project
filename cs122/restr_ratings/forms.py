from django import forms

class NameForm(forms.Form):
	restaurant = forms.CharField(label = 'Restaurant', max_length = 100)
	neighborhood = forms.CharField(label = 'neighborhood', max_length = 100)
