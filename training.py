import csv
import nltk

def read_training():
    food, service, ambience, price = [], [], [], []
    with open('training.csv','r') as training:
        csv_reader = csv.reader(training)
        for row in csv_reader[1:]:
            food.append(row[0])
            service.append(row[1])
            ambience.append(row[2])
            price.append(row[3])

    return food, service, ambience, price

def raw_dictionary(sentences):
    dictionary = []
    for sentence in sentences:
        words = nltk.word_tokenize(sentence)
        for word in words:
            dictionary.append(word)
    return dictionary

def process_dictionary():


