import sys
import matplotlib.pyplot as plt
import numpy as np
import calculate_score
from itertools import chain

sys.path.append('../CS122_Project/cs122/')
from restr_ratings.models import Restaurant, Rating

def find_restr(args, Restaurant, max_num):
    '''
    E.g. args = {'restr': ['Eden'], 'order': ['nbh','price','category']}
    Output: list of restaurant names
    '''
    restr = args['restr']
    order = args['order']
    if len(restr) == 2:
        my_restr = Restaurant.objects.filter(restr_name = restr[0], restr_neighborhood = restr[1])
    else:
        my_restr = Restaurant.objects.filter(restr_name = restr[0])
    for restr_i in my_restr:
        name_i = restr_i.restr_name
        nbh_i = restr_i.restr_neighborhood
        price_i = restr_i.restr_price
        category_i = restr_i.restr_cuisine
        selection = Restaurant.objects.filter(restr_neighborhood = nbh_i, restr_price = price_i, 
                                              restr_cuisine = category_i)

        if 'nbh' in order[:2] and 'price' in order[:2]:
            sel1 = Restaurant.objects.filter(restr_neighborhood = nbh_i, restr_price = price_i)
        elif 'nbh' in order[:2] and 'category' in order[2]:
            sel1 = Restaurant.objects.filter(restr_neighborhood = nbh_i, restr_cuisine = category_i)
        elif 'price' in order[:2] and 'category' in order[2]:
            sel1 = Restaurant.objects.filter(restr_price = price_i, restr_cuisine = category_i)

        if order[0] == 'nbh':
            sel2 = Restaurant.objects.filter(restr_neighborhood = nbh_i)
        elif order[0] == 'price':
            sel2 = Restaurant.objects.filter(restr_neighborhood = price_i)
        elif order[0] == 'category':
            sel2 = Restaurant.objects.filter(restr_cuisine = category_i)
        ls = [i.restr_name for i in selection]
        ls1 = [i.restr_name for i in sel1]
        ls2 = [i.restr_name for i in sel2]
        restr_ls = list(set(ls + ls1 + ls2))[:max_num]
        return restr_ls

'''
def plot_scatter(restr_df):

    names = restr_df['restr']
    food_scores = restr_df['food_s']
    service_scores = restr_df['serv_s']
    fig, ax = plt.subplots()
    plt.title('Restaurant Comparison')
    plt.scatter(food_scores, service_scores)
    plt.scatter(food_scores[0],service_scores[0], s=np.pi*6**2, color='red')
    ax.set_xlabel('food score')
    ax.set_ylabel('service score')
    for i, txt in enumerate(names):
        ax.annotate(txt, (food_scores[i],service_scores[i]))
    fig.show()
'''