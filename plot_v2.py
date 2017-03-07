import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import calculate_score

sys.path.append('../CS122_Project/cs122/')

from restr_ratings.models import Restaurant, Rating

def sample_df_init():
    header = ['restr','score', 'category','price','address','nbh']
    restr1 = ['Sample1',4, 'American','$$','address','Hyde Park']
    restr2 = ['Sample2',3.5, 'Japanese', '$$', 'address','Hyde Park']
    restr3 = ['Sample3',4, 'American','$$$','address','Hyde Park']
    sample_df = pd.DataFrame([restr1,restr2,restr3], columns = header)
    return sample_df

def sample_df_all():
    header = ['restr','score', 'category','price','address','nbh', 'envr_s','food_s','price_s','serv_s']
    restr1 = ['Sample1',4, 'American','$$','address','Hyde Park',20,30,35,25]
    restr2 = ['Sample2',3.5, 'Japanese', '$$', 'address','Hyde Park',15,25,30,30]
    restr3 = ['Sample3',4, 'American','$$$','address','Hyde Park',30,30,10,30]
    sample_df = pd.DataFrame([restr1,restr2,restr3], columns = header)
    return sample_df


def select_restr(restr, order, df, max_num):
    '''
    Select restaurants to be plotted. 
    Input:
        restr: (list) name (and nbh) of the restaurant
        order: (list) order of selection, any combination of nbh, price, category
        df: dataframe from crawler
            columns = ['restr','score','category','price','address','nbh', 'url']
        max_num: max number of other restaurants to include on the plot 
    Return: filtered dataframe
    '''
    if len(restr) == 1:
        my_restr = df.objects.filter(restr_name = restr[0])
    elif len(restr) == 2:
        my_restr = df.objects.filter(restr_name = restr[0], restr_neighborhood = restr[1])
    df_ls = []
    for i in my_restr.index:
        restr_i = my_restr.loc[i]
        selection = df.objects.filter(restr_neighborhood = restr_i.restr_neighborhood, restr_price = restr_i.restr_price,
                                    restr_cuisine = restr_i.restr_cuisine)
        if len(selection) >= max_num:
            selection = selection[:max_num]
        else:
            sel1 = df[(df[order[0]]==value[0]) & (df[order[1]]==value[1])]
            if len(sel1) + len(selection) >= max_num:
                sel1 = sel1[:(max_num-len(selection)+1)]
            else:
                sel2 = df[df[order[0]]==value[0]]
                if len(selection) + len(sel1) + len(sel2) >= max_num:
                    sel2 = sel2[:(max_num-len(selection)-len(sel1)+1)]
            selection = selection.append(sel1).append(sel2).drop_duplicates()
            print(selection)
        restr_i.append(selection)
        df_ls.append(restr_i)

    return df_ls

def get_score(restr_df):
    '''
    Need to incorporate calculate_score. Output dataframe has 4 additional
    columns for environment, food, price, and service scores.
    '''
    return []

def plot_scatter(restr_df):
    '''
    Test this with sample_df_all.
    '''
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
