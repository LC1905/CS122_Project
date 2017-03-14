
def get_score(dic1, dic2):
    '''
    Calculate the food, service, price, ambience score from sentiment 
    and word count dictionaries.
    Input:
	dictionary1:
	    key: words
	    value: {'neg': 0, 'obj': 0, 'pos': 0}
	dictionary2:
	    key: food, price, service, ambience
	    value: {'word', 0}
    Return: list of scores
    '''
    food = dic2['food']
    service = dic2['service']
    price = dic2['price']
    ambience = dic2['ambience']
    scores = []
    for word_list in [food, service, price, ambience]:
        neg_score = 0
        obj_score = 0
        pos_score = 0
        final_score = 0
        for word in word_list:
            if word in dic1.keys():
                if dic1[word] != None:
                    neg_score += dic1[word].get('neg', 0)
                    obj_score += dic1[word].get('obj', 0)
                    pos_score += dic1[word].get('pos', 0)
        total_score = neg_score + obj_score + pos_score
        if pos_score + neg_score != 0:
            neg_perct = neg_score/ total_score
            pos_perct = pos_score/ total_score
            final_score = round(pos_perct/(pos_perct + neg_perct) * 100, 2)
        else:
            final_score = 50.00
        scores.append(final_score)
    return scores
