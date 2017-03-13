import csv
import nltk
from stop_words import get_stop_words
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

def read_training():
    '''
    This functions read training data and groups it into lists of sentences describing
    food, service, ambience, price, respectively.
    '''
    food, service, ambience, price = [], [], [], []
    with open('/home/student/CS122_Project/cs122/essential/training.csv','r') as training:
        csv_reader = csv.reader(training)
        for row in csv_reader:
            food.append(row[0])
            service.append(row[1])
            ambience.append(row[2])
            price.append(row[3])
    food = [sentence for sentence in food[1:] if sentence != '']
    service = [sentence for sentence in service[1:] if sentence != '']
    ambience = [sentence for sentence in ambience[1:] if sentence != '']
    price = [sentence for sentence in price[1:] if sentence != '']
    return food, service, ambience, price


def process_sentence(sentence):
    '''
    This function processing a given sentence by tokenizing and stemming it.
    '''
    wnl = WordNetLemmatizer()
    en_stop = get_stop_words('en')
    sentence = nltk.word_tokenize(sentence)
    sentence = [word.lower() for word in sentence if word.isalpha() or word == '$']
    sentence = [wnl.lemmatize(word, 'v') for word in sentence if not word in en_stop]
    sentence = [wnl.lemmatize(word) for word in sentence]
    return sentence
    

def raw_dictionary(category):
    '''
    This function generates the raw dictionary for the given category, returning the
    vocabularies in the order of their frequencies.
    '''
    dictionary = []
    for sentence in category:
        dictionary += process_sentence(sentence)
    fdist = nltk.FreqDist(dictionary)
    return fdist.most_common()



def overlap(word, food, service, ambience, price, threshold = 1):
    '''
    This function checks if a word overlaps (using the given threshold)
    Currently we set threshold to 1 because our training model is relatively small
    and it works better if we include those overlapping words
    '''
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
    '''
    This function processes the raw dictionary and return the first 100 vocabularies in each topic.
    '''
    food, service, ambience, price = read_training()
    food_voc = [word[0] for word in raw_dictionary(food) if len(word[0]) >= 3]
    service_voc = [word[0] for word in raw_dictionary(service) if len(word[0]) >= 3]
    ambience_voc = [word[0] for word in raw_dictionary(ambience) if len(word[0]) >= 3]
    price_voc = [word[0] for word in raw_dictionary(price) if len(word[0]) >= 3]
    food_voc = [word for word in food_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    service_voc = [word for word in service_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    ambience_voc = [word for word in ambience_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    price_voc = [word for word in price_voc if not overlap(word, food_voc, service_voc, ambience_voc, price_voc)]
    return food_voc[:100], service_voc[:100], ambience_voc[:100], price_voc[:100]


def export_model():
    '''
    This function exports the model to csv
    '''
    food, service, ambience, price = process_dictionary()
    price[99] = '$'
    with open('model.csv', 'w') as model:
        writer = csv.writer(model)
        for i in range(100):
            writer.writerow([food[i], service[i], ambience[i], price[i]])