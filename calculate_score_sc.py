import random_dict

from random_dict import random_dict

sentences, words_score = random_dict()

def extract_words(reviews_dict):
	enviro_words = []
	food_words = []
	price_words = []
	service_words = []
	for review in reviews_dict:
		food_words.extend(review['food'])
		enviro_words.extend(review['environment'])
		price_words.extend(review['price'])
		service_words.extend(review['service'])
	return food_words, enviro_words, service_words, price_words

def calculate_score(words):
	neg_score = 0
	obj_score = 0
	pos_score = 0
	final_score = 0
	for word in words:
		if word in words_score:
			neg_score += words_score[word]['neg']
			obj_score += words_score[word]['obj']
			pos_score += words_score[word]['pos']
	total_score = neg_score + obj_score + pos_score
	
	if pos_score + neg_score != 0:
		neg_perct = neg_score/ total_score
		pos_perct = pos_score/ total_score
		final_score = pos_perct/(pos_perct + neg_perct) * 100
	else:
		final_score = -1
	
	return final_score

def go():
	'''
	calculate the score of each catagory for a restaurant 

	input: reviews_dict. a dictionary that contains all reviews after categorization
	output: a score for each category
	'''
	reviews_dict = random_dict()[0]
	score_dict = {}
	food, enviro, service, price = extract_words(reviews_dict)
	score_dict['food'] = calculate_score(food)
	score_dict['service'] = calculate_score(service)
	score_dict['environment'] = calculate_score(enviro)
	score_dict['price'] = calculate_score(price)
	return score_dict
