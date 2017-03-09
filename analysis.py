import nltk
import bs4
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from gensim import corpora, models
import gensim
import numpy as np
import nltk_simplify
from nltk.corpus import sentiwordnet as swn

food = ['food', 'taste', 'dish', 'savory', 'sweet', 'salty', 'eat', 'flavor']
service = ['service', 'friendly', 'quick', 'attitude', 'staff', 'efficient']
ambience = ['clean', 'location', 'space', 'classy', 'room', 'look']
price = ['price', 'cheap', 'expensive', 'quite', 'inexpensive', 'affordable', 'bill','overpriced']

nltk_category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}

food_vector = np.array(8 * [1] + 20 * [0])
service_vector = np.array(8 * [0] + 6 * [1] + 14 * [0])
ambience_vector = np.array(14 * [0] + 6 * [1] + 8 * [0])
price_vector = np.array(20 * [0] + 8 * [1])

'''
def process_vocabulary():
    p_stemmer = PorterStemmer()
    stemmed_food = [p_stemmer.stem(word) for word in food]
    stemmed_service = [p_stemmer.stem(word) for word in service]
    stemmed_ambience = [p_stemmer.stem(word) for word in ambience]
    stemmed_price = [p_stemmer.stem(word) for word in price]
    return stemmed_food, stemmed_service, stemmed_ambience, stemmed_price
'''


def find_vector(sentence):
    vector = []
    p_stemmer = PorterStemmer()
    stemmed_food = [p_stemmer.stem(word) for word in food]
    stemmed_service = [p_stemmer.stem(word) for word in service]
    stemmed_ambience = [p_stemmer.stem(word) for word in ambience]
    stemmed_price = [p_stemmer.stem(word) for word in price]
    vocabularies = stemmed_food + stemmed_service + stemmed_ambience + stemmed_price
    for vocabulary in vocabularies:
        if vocabulary in sentence:
            vector.append(1)
        else:
            vector.append(0)
    return vector


def find_category(sentence):
    vector = np.array(find_vector(sentence))
    food_chance = np.inner(food_vector, vector)
    service_chance = np.inner(service_vector, vector)
    ambience_chance = np.inner(ambience_vector, vector)
    price_chance = np.inner(price_vector, vector)
    topic = sorted([(food_chance, 'food'), (service_chance, 'service'), (ambience_chance, 'ambience'), (price_chance, 'price')])
    if topic[-1][0] != 0:
        return topic[-1][1]


def calc_score(word):
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


def review_analysis(review):
    wnl = WordNetLemmatizer()
    review_sentiment = {}
    review_count = {'food': {}, 'service': {}, 'price': {}, 'ambience':{}}
    en_stop = get_stop_words('en')
    p_stemmer = PorterStemmer()
    sentences = nltk.sent_tokenize(review)
    for sentence in sentences:
        sentence = nltk.word_tokenize(sentence)
        sentence = [word.lower() for word in sentence if word.isalpha()]
        sentence = [word for word in sentence if not word in en_stop]
        sentence_stemmed = [p_stemmer.stem(word) for word in sentence]
        if find_category(sentence_stemmed) != None:
            category = find_category(sentence_stemmed)
            for word in sentence:
                wnl.lemmatize(word,'v')
                tokens = [token.lower() for token in word_tokenize(word)]
                lemmatized = [wnl.lemmatize(token) for token in tokens]
                word = lemmatized[0]
                if not word in review_count[category]:
                    review_count[category][word] = 0
                review_count[category][word] += 1       
                review_sentiment[word] = calc_score(word)
    return review_sentiment, review_count



