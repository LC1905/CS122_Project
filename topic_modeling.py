#Source: https://rstudio-pubs-static.s3.amazonaws.com/79360_850b2a69980c4488b1db95987a24867a.html

import nltk
import bs4
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from gensim import corpora, models
import gensim
import crawler

def sample_reviews():
    rest, reviews = crawler.crawler('MingHin Cuisine', 'Chicago', 'IL', 1)
    en_stop = get_stop_words('en')
    #tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
    p_stemmer = PorterStemmer()
    contents = []
    for key, info in reviews.items():
        for customer, review in info.items():
            content = review['content'].lower()
            print('-----------------------------------')
            print(content)
            print('-----------------------------------')
            content = nltk.word_tokenize(content)
            print('AFTER TOKENIZING')
            print(content)
            print('------------------------------------')
            content_alpha = [i for i in content if i.isalpha()]
            print('WITH ONLY WORDS')
            print(content_alpha)
            print('-------------------------------------')
            stopped_content = [i for i in content_alpha if not i in en_stop]
            print('DELETING STOPPING WORDS')
            print(stopped_content)
            print('-------------------------------------')
            stemmed_content = [p_stemmer.stem(i) for i in stopped_content]
            print('STEMMED')
            print(stemmed_content)
            print('-------------------------------------')
        contents.append(stemmed_content)
    return contents

def topic_model():
    reviews = sample_reviews()
    dictionary = corpora.Dictionary(reviews)
    corpus = [dictionary.doc2bow(review) for review in reviews]
    ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=4, id2word = dictionary, passes=20)
    print(ldamodel.print_topics(num_topics=4, num_words=2))