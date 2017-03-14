import nltk
import random
from nltk.corpus import gutenberg
from nltk.corpus import sentiwordnet as swn
#import nltk_simplify

category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}


def calc_score(sentence):
    word_to_score = {}
    sentence = nltk.word_tokenize(sentence)
    words = [word for word in sentence if word.isalpha()]
    pos_score = 0
    neg_score = 0
    obj_score = 0
    for word in sentence:
        tag = nltk.pos_tag([word])
        pos = nltk_simplify.simplify_wsj_tag(tag[0][1]).lower()
        related = list(swn.senti_synsets(word))
        if related != []:
            for possible in related:
                pos_score += possible.pos_score()
                neg_score += possible.neg_score()
                obj_score += possible.obj_score()
                word_to_score[word] = {'pos': pos_score/len(related), 'neg': neg_score/len(related), 'obj': obj_score/len(related)}
        pos_score = 0
        neg_score = 0
        obj_score = 0

    return word_to_score