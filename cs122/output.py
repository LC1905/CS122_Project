import sys
import matplotlib.pyplot as plt
import numpy as np
import analysis

sys.path.append('../CS122_Project/cs122/')
from restr_ratings.models import Restaurant, Rating

MAX_NUM = 7

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
    
    all_ls = []
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

        all_selection = selection | sel1 | sel2
        restr_ls = all_selection[: max_num+1]
        for selected in restr_ls:
            all_reviews = selected.rating_set.all()
            all_texts = ' '.join([str(review) for review in all_reviews[:4] if review != None])
            review_sentiment, review_count = analysis.review_analysis(all_texts)
            selected.food_score = 40 + len(selected.restr_name)
            selected.service_score = 50
            selected.price_score = 36
            selected.ambience_score = 73
            # calculate individual restaurant score based on all reviews
            # update scores to database
        all_ls.append(restr_ls)
    return all_ls

def plot_scatter(restr_ls, Restaurant):
    name_ls = []
    food_score_ls = []
    service_score_ls = []
    for restr in restr_ls:
        name_ls.append(restr.restr_name)
        food_score_ls.append(restr.food_score)
        service_score_ls.append(restr.service_score)
    fig, ax = plt.subplots()
    plt.title('Restaurant Comparison')
    plt.scatter(food_score_ls, service_score_ls)
    plt.scatter(food_score_ls[0], service_score_ls[0], s=np.pi*6**2, color='red')
    ax.set_xlabel('food_score')
    ax.set_ylabel('service_score')
    for i, txt in enumerate(name_ls):
        ax.annotate(txt, (food_score_ls[i], service_score_ls[i]))
    fig.show()
    return fig
