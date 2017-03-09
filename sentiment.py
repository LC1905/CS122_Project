import nltk
import random
from nltk.corpus import gutenberg
from nltk.corpus import sentiwordnet as swn
import nltk_simplify

category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}


def calc_score(sentence):
    word_to_score = {}
    sentence = nltk.word_tokenize(sentence)
    words = [word for word in sentence if word.isalpha()]
    for word in sentence:
        tag = nltk.pos_tag([word])
        pos = nltk_simplify.simplify_wsj_tag(tag[0][1]).lower()
        related = list(swn.senti_synsets(word))
        for possible in related:
            if possible.synset.name().split('.')[0] == word and possible.synset.pos() == pos:
                corr_synset = possible
                if corr_synset != None:
                    pos = corr_synset.pos_score()
                    neg = corr_synset.neg_score()
                    obj = corr_synset.obj_score()
                    word_to_score[word] = {'pos': pos, 'neg': neg, 'obj': obj}

    return word_to_score