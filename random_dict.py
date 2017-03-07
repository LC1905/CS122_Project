import nltk
import random
from nltk.corpus import gutenberg
from nltk.corpus import sentiwordnet as swn

category = {'JJ': 'a', 'JJR': 'a', 'JJS': 'a', 'PRP': 'n', 'NN': 'n', 'NNS': 'n', 'NNP': 'n',
'NNPS': 'n', 'RB': 'r', 'RBR': 'r', 'RBS': 'r', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v'}

def random_dict():
    genres_code = {1: 'service', 2: 'food', 3: 'environment', 4: 'price'}
    sentences = []
    word_to_score = {}
    i = 0
    while i < 100:
        genres = {'service': [], 'food': [], 'environment': [], 'price': []}
        score = {}
        start = random.randint(0, length)
        end = start + random.randint(0, min(length - start, 40))
        sentence = bible[start:end]
        for word in sentence:
            tag = nltk.pos_tag([word])
            if tag[0][1] in category:
                cat = category[tag[0][1]]
                related = list(swn.senti_synsets(word,cat))
                corr_synset = [possible for possible in related if possible.synset.name().split('.')[0] == word]
                if corr_synset != []:
                    genre = genres_code[random.randint(1, 4)]
                    genres[genre].append(word)
                    pos = corr_synset[0].pos_score()
                    neg = corr_synset[0].neg_score()
                    obj = corr_synset[0].obj_score()
                    word_to_score[word] = {'pos': pos, 'neg': neg, 'obj': obj}
        sentences.append(genres)
        i += 1
    return sentences, word_to_score
