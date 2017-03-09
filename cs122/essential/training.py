import csv
import nltk
from nltk.stem.porter import PorterStemmer
from stop_words import get_stop_words
from nltk.stem import WordNetLemmatizer

def read_training():
    food, service, ambience, price = [], [], [], []
    with open('../essential/training.csv','r') as training:
        csv_reader = csv.reader(training, skipinitialspace = True)
        for row in csv_reader:
            #print(row)
            food.append(row[0])
            service.append(row[1])
            ambience.append(row[2])
            price.append(row[3])
    food = [sentence for sentence in food[1:] if sentence != '']
    service = [sentence for sentence in service[1:] if sentence != '']
    ambience = [sentence for sentence in ambience[1:] if sentence != '']
    price = [sentence for sentence in price[1:] if sentence != '']
    return food, service, ambience, price

def raw_dictionary(category):
    dictionary = []
    wnl = WordNetLemmatizer()
    en_stop = get_stop_words('en')
    p_stemmer = PorterStemmer()
    for sentence in category:
        words = nltk.word_tokenize(sentence)
        dictionary += [word.lower() for word in words if word.isalpha()]
        dictionary = [wnl.lemmatize(word, 'v') for word in dictionary if word not in en_stop]
        dictionary = [wnl.lemmatize(word) for word in dictionary]
    fdist = nltk.FreqDist(dictionary)
    return fdist.most_common()


def overlap(word, food, service, ambience, price, threshold = 50):
    food, service, ambience, price = food[:threshold], service[:threshold], ambience[:threshold], price[:threshold]
    if word in food and word in service:
        return True
    elif word in food and word in ambience:
        return True
    elif word in food and word in price:
        return True
    elif word in service and word in ambience:
        return True
    elif word in service and word in price:
        return True
    elif word in ambience and word in price:
        return True
    else:
        return False


def process_dictionary():
    food, service, ambience, price = read_training()
    food_voc = [word[0] for word in raw_dictionary(food)]
    service_voc = [word[0] for word in raw_dictionary(service)]
    ambience_voc = [word[0] for word in raw_dictionary(ambience)]
    price_voc = [word[0] for word in raw_dictionary(price)]
    food_voc = [word for word in food_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    service_voc = [word for word in service_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    ambience_voc = [word for word in ambience_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    price_voc = [word for word in price_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    return food_voc[:100], service_voc[:100], ambience_voc[:100], price_voc[:100]
