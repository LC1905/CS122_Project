import nltk
import numpy


text = nltk.corpus.genesis.words('english-kjv.txt')
bigrams = nltk.bigrams(text)
cfdist = nltk.ConditionalFreqDist(bigrams)

def generate_model(cfdist, word, num=15):
    for i in range(num):
        print(word, end=' ')
        word = cfdist[word].max()

def content_fraction(text):
    stopwords = nltk.corpus.stopwords.words('english')
    content = [word for word in text if word.lower() not in stopwords]
    return len(content) / len(text)

def word_feats(words):
    return dict([word, True] for word in words)