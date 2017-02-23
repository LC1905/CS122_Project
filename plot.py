import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import calculate_score

def sample_df_init():
    header = ['restr','score', 'category','price','address','nbh', 'url']
    restr1 = ['Sample1',4, 'American','$$','address','Hyde Park','url']
    restr2 = ['Sample2',3.5, 'Japanese', '$$', 'address','Hyde Park','url']
    restr3 = ['Sample3',4, 'American','$$$','address','Hyde Park','url']
    sample_df = pd.DataFrame([restr1,restr2,restr3], columns = header)
    return sample_df

def sample_df_all():
    header = ['restr','score', 'category','price','address','nbh', 'envr_s','food_s','price_s','serv_s']
    restr1 = ['Sample1',4, 'American','$$','address','Hyde Park',20,30,35,25]
    restr2 = ['Sample2',3.5, 'Japanese', '$$', 'address','Hyde Park',15,25,30,30]
    restr3 = ['Sample3',4, 'American','$$$','address','Hyde Park',30,30,10,30]
    sample_df = pd.DataFrame([restr1,restr2,restr3], columns = header)
    return sample_df

def select_restr(restr, nbh, df, max_num):
    '''
    Select restaurants to be plotted.
    Input:
        restr: (str) name of restaurant
        nbh: (str) neighborhood (to deal with multiple locations)
        df: dataframe from crawler
            columns = ['restr','score','category','price','address','nbh', 'url']
        max_num: max number of other restaurants to include on the plot 
    Return: filtered dataframe
    '''
    restr_df = df[(df['restr'] == restr) & (df['nbh'] == nbh)]
    restr_name = restr_df['restr'][0]
    restr_cat = restr_df['category'][0]
    restr_price = restr_df['price'][0]
    # Select all restr in the same neighborhood
    select_df = df[(df['nbh'] == nbh) & (df['restr'] != restr_name)]
    if len(select_df) >= max_num:
        # Drop restr of different category
        to_drop = select_df[(select_df['category'] != restr_cat)]
        if len(to_drop) >= len(select_df) - max_num:
            select_df = select_df.drop(to_drop.index[:len(select_df) - max_num])
        else:
            select_df = select_df.drop(to_drop.index)[:max_num]
    if len(select_df) < max_num:
        # Add restr from other neighborhoods of the same category and price
        to_add = df[df['category'] == restr_cat and df['price'] == restr_price]
        select_df.append(to_add[:max_num-len(select_df)])
    restr_df = restr_df.append(select_df)
    return restr_df

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
    ax.scatter(food_scores, service_scores)
    for i, txt in enumerate(names):
        ax.annotate(txt, (food_scores[i],service_scores[i]))
    fig.show()
