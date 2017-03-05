import nltk
import random
from nltk.corpus import gutenberg
from nltk.corpus import sentiwordnet as swn

category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}


def calc_score(sentence):
    word_to_score = {}
    sentence = nltk.word_tokenize(sentence)
    words = [word for word in sentence if word.isalpha()]
    for word in sentence:
        tag = nltk.pos_tag([word])
        if tag[0][1] in category:
            cat = category[tag[0][1]]
            related = list(swn.senti_synsets(word,cat))
            corr_synset = [possible for possible in related if possible.synset.name().split('.')[0] == word]
            if corr_synset != []:
                pos = corr_synset[0].pos_score()
                neg = corr_synset[0].neg_score()
                obj = corr_synset[0].obj_score()
                word_to_score[word] = {'pos': pos, 'neg': neg, 'obj': obj}

    return word_to_score