from django import forms

class NameForm(forms.Form):
	restaurant = forms.CharField(label = 'Restaurant', max_length = 100)