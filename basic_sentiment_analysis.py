# Source: http://www.laurentluce.com/posts/twitter-sentiment-analysis-using-python-and-nltk/
# Source: http://streamhacker.com/2010/05/10/text-classification-sentiment-analysis-naive-bayes-classifier/


import nltk
from nltk.classify import NaiveBayesClassifier 
from nltk.corpus import movie_reviews

neg_ids = movie_reviews.fileids('neg')
pos_ids = movie_reviews.fileids('pos')
training_len = len(neg_ids+ pos_ids) * 3//4

def add_polarity():
    neg_reviews = []
    pos_reviews = []
    for neg_id in neg_ids:
        review = movie_reviews.words(fileids = neg_id)
        neg_reviews.append((review, 'negative'))
    for pos_id in pos_ids:
        review = movie_reviews.words(fileids = pos_id)
        pos_reviews.append((review, 'positive'))
    return neg_reviews + pos_reviews


def get_words(reviews):
    words = []
    for sentence, sentiment in add_polarity():
        sentence = [word.lower() for word in sentence if word.isalpha() and len(word) >= 3]
        words.extend(sentence)
    return words


def get_word_features():
    reviews = add_polarity()
    training_reviews = reviews[:training_len]
    wordlist = get_words(training_reviews)
    wordlist = nltk.FreqDist(wordlist)
    word_features = wordlist.keys()
    return word_features


def extract_features(document):
    word_features = get_word_features()
    document_words = set(document)
    features = {}
    for word in word_features:
        features['contains(%s)' % word] = (word in document_words)
    return features


def generate_classifier(training_reviews):
    training_set = nltk.classify.apply_features(extract_features, training_reviews)
    classifier = NaiveBayesClassifier.train(training_set)
    return classifier


def classify(review):
    classifier = generate_classifier(add_polarity()[:training_len])
    classification = classifier.classify(extract_features(review))
    return classification


def check_accuracy():
    classifier =  generate_classifier(add_polarity()[:training_len])
    test_data = add_polarity()[training_len:]
    print('accuracy:', nltk.classify.util.accuracy(classifier, extract_features(test_data)))
    print(classifier.show_most_informative_features())


