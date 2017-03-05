#Source: https://rstudio-pubs-static.s3.amazonaws.com/79360_850b2a69980c4488b1db95987a24867a.html

import nltk
import bs4
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from gensim import corpora, models
import gensim
import crawler
import numpy as np


food = ['food', 'taste', 'dish', 'savory', 'sweet', 'salty', 'eat', 'flavor', 'tasty', 'yummy']
service = ['service', 'friendly', 'quick', 'attitude', 'staff', 'efficient', 'slow', 'inefficient']
ambience = ['clean', 'location', 'space', 'classy', 'room', 'look', 'vibe', 'comfy', 'comfortable', 'homey']
price = ['price', 'cheap', 'expensive', 'quite', 'inexpensive', 'affordable', 'bill','overpriced', 'reasonable']
food_vector = np.array(8 * [1] + 20 * [0])
service_vector = np.array(8 * [0] + 6 * [1] + 14 * [0])
ambience_vector = np.array(14 * [0] + 6 * [1] + 8 * [0])
price_vector = np.array(20 * [0] + 8 * [1])

def sample_reviews():
    rest, reviews = crawler.crawler('MingHin Cuisine', 'Chicago', 'IL', 1)
    en_stop = get_stop_words('en')
    #tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
    p_stemmer = PorterStemmer()
    contents = []
    for key, info in reviews.items():
        for customer, review in info.items():
            content = review['content'].lower()
            content = nltk.word_tokenize(content)
            content_alpha = [i for i in content if i.isalpha()]
            stopped_content = [i for i in content_alpha if not i in en_stop]
            stemmed_content = [p_stemmer.stem(i) for i in stopped_content]
        contents.append(stemmed_content)
    return contents


def topic_model():
    reviews = sample_reviews()
    dictionary = corpora.Dictionary(reviews)
    corpus = [dictionary.doc2bow(review) for review in reviews]
    ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=4, id2word = dictionary, passes=20)
    print(ldamodel.print_topics(num_topics=4, num_words=2))


def process_vocabulary():
    p_stemmer = PorterStemmer()
    stemmed_food = [p_stemmer.stem(word) for word in food]
    stemmed_service = [p_stemmer.stem(word) for word in service]
    stemmed_ambience = [p_stemmer.stem(word) for word in ambience]
    stemmed_price = [p_stemmer.stem(word) for word in price]
    return stemmed_food, stemmed_service, stemmed_ambience, stemmed_price

def review_categories(review):
    en_stop = get_stop_words('en')
    p_stemmer = PorterStemmer()
    sentences = nltk.sent_tokenize(review)
    review = {}
    count = 1
    for sentence in sentences:
        review[count] = {}
        review[count]['sentence'] = sentence
        sentence = nltk.word_tokenize(sentence)
        sentence = [word.lower() for word in sentence if word.isalpha()]
        sentence = [word for word in sentence if not word in en_stop]
        sentence = [p_stemmer.stem(word) for word in sentence]
        #review[count]['vector'] = find_vector(sentence)
        review[count]['category'] = find_category(sentence)
        count += 1

    return review


def find_vector(sentence):
    vocabularies = process_vocabulary()[0] + process_vocabulary()[1] + process_vocabulary()[2] + process_vocabulary()[3]
    vector = []
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

