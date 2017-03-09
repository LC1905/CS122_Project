'''
This file is completely entitled from nltk's source code.
http://pydoc.net/Python/nltk/2.0.3/nltk.tag.simplify/
'''

brown_mapping1 = {
    'j': 'ADJ', 'p': 'PRO', 'm': 'MOD', 'q': 'DET',
    'w': 'WH', 'r': 'ADV', 'i': 'P',
    'u': 'UH', 'e': 'EX', 'o': 'NUM', 'b': 'V',
    'h': 'V', 'f': 'FW', 'a': 'DET', 't': 'TO',
    'cc': 'CNJ', 'cs': 'CNJ', 'cd': 'NUM',
    'do': 'V', 'dt': 'DET',
    'nn': 'N', 'nr': 'N', 'np': 'NP', 'nc': 'N'
    }
brown_mapping2 = {
    'vb': 'V', 'vbd': 'VD', 'vbg': 'VG', 'vbn': 'VN'
    }

def simplify_brown_tag(tag):
    tag = tag.lower()
    if tag[0] in brown_mapping1:
        return brown_mapping1[tag[0]]
    elif tag[:2] in brown_mapping1:   # still doesn't handle DOD tag correctly
        return brown_mapping1[tag[:2]]
    try:
        if '-' in tag:
            tag = tag.split('-')[0]
        return brown_mapping2[tag]
    except KeyError:
        return tag.upper()

# Wall Street Journal tags (Penn Treebank)

wsj_mapping = {
    '-lrb-': '(',   '-rrb-': ')',    '-lsb-': '(',
    '-rsb-': ')',   '-lcb-': '(',    '-rcb-': ')',
    '-none-': '',   'cc': 'CNJ',     'cd': 'NUM',
    'dt': 'DET',    'ex': 'EX',      'fw': 'FW', # existential "there", foreign word
    'in': 'P',      'jj': 'ADJ',     'jjr': 'ADJ',
    'jjs': 'ADJ',   'ls': 'L',       'md': 'MOD',  # list item marker
    'nn': 'N',      'nnp': 'NP',     'nnps': 'NP',
    'nns': 'N',     'pdt': 'DET',    'pos': '',
    'prp': 'PRO',   'prp$': 'PRO',   'rb': 'ADV',
    'rbr': 'ADV',   'rbs': 'ADV',    'rp': 'PRO',
    'sym': 'S',     'to': 'TO',      'uh': 'UH',
    'vb': 'V',      'vbd': 'VD',     'vbg': 'VG',
    'vbn': 'VN',    'vbp': 'V',      'vbz': 'V',
    'wdt': 'WH',    'wp': 'WH',      'wp$': 'WH',
    'wrb': 'WH',
    'bes': 'V',     'hvs': 'V',     'prp^vbp': 'PRO'   # additions for NPS Chat corpus
    }

def simplify_wsj_tag(tag):
    if tag and tag[0] == '^':
        tag = tag[1:]
    try:
        tag = wsj_mapping[tag.lower()]
    except KeyError:
        pass
    return tag.upper()


# Default tag simplification

def simplify_tag(tag):
    return tag[0].upper()



if __name__ == "__main__":
    import doctest
    doctest.testmod(optionflags=doctest.NORMALIZE_WHITESPACE)