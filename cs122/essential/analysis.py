import csv
import nltk
from essential import training
import numpy as np
from nltk.corpus import sentiwordnet as swn

nltk_category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}

food, service, ambience, price = training.process_dictionary()
#price[99] = '$'
food_vector = np.array(100*[1]+300*[0])
service_vector = np.array(100*[0]+100*[1]+200*[0])
ambience_vector = np.array(200*[0]+100*[1]+100*[0])
price_vector = np.array(300*[0]+100*[1])

def import_model():
    '''
    This function imports the trained topic model
    '''
    food, service, ambience, price = [], [], [], []
    with open('model.csv', 'r') as model:
        reader = csv.reader(model)
        for row in reader:
            food.append(row[0])
            service.append(row[1])
            ambience.append(row[2])
            price.append(row[3])
    return food, service, ambience, price


def find_vector(sentence):
    '''
    This function finds the associated vector for a given sentence.
    '''
    vector = []
    food, service, ambience, price = import_model()
    vocabulary = food + service + ambience + price
    for i, word in enumerate(vocabulary):
        if word in sentence:
            vector.append(1)
        else:
            vector.append(0)
    return vector


def find_category(sentence):
    '''
    This function find the topic related to a given sentence.
    '''
    length = len(sentence)
    vector = np.array(find_vector(sentence))
    food_chance = np.inner(food_vector, vector)
    service_chance = np.inner(service_vector, vector)
    ambience_chance = np.inner(ambience_vector, vector)
    price_chance = np.inner(price_vector, vector)
    topic = sorted([(food_chance, 'food'), (service_chance, 'service'), (ambience_chance, 'ambience'), (price_chance, 'price')])
    if topic[-1][0]/length >= 0.01:
        return topic[-1][1]


def calc_score(word):
    '''
    This function uses SentiWordNet to calculate the sentimental score related to a given word.
    '''
    pos_score = 0
    neg_score = 0
    obj_score = 0
    related = list(swn.senti_synsets(word))
    if related != []:
        for possible in related:
            pos_score += possible.pos_score()
            neg_score += possible.neg_score()
            obj_score += possible.obj_score()
        word_to_score = {'pos': pos_score/len(related), 'neg': neg_score/len(related), 'obj': obj_score/len(related)}
        return word_to_score


def review_analysis(reviews):
    '''
    This function does both sentimental analysis and topic modeling on given reviews
    Input: reviews, string
    Returns: 
        review_sentiment: a dictionary mapping words to their sentimental scores
        review_count: a dicionary mapping topics to related words, and words to the number of their appearances
    '''
    review_sentiment = {}
    review_count = {'food': {}, 'service': {}, 'price': {}, 'ambience':{}}
    sentences = nltk.sent_tokenize(reviews)
    for sentence in sentences:
        sentence = training.process_sentence(sentence)
        if find_category(sentence) != None:
            category = find_category(sentence)
            for word in sentence:
                if not word in review_count[category]:
                    review_count[category][word] = 0
                review_count[category][word] += 1       
                review_sentiment[word] = calc_score(word)
    return review_sentiment, review_count



