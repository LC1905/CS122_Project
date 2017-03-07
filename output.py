import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import calculate_score
import os

DATA_DIR = os.path.dirname(__file__)
DATABASE_FILENAME = os.path.join(DATA_DIR, 'db.sqlite3')

def is_valid(args):
    restr = args['restr']
    order = args['order']
    return (restr != '') and (len(order)==3)

def prepare_
def construct_query(args):
    if is_valid(args):
        restr = args['restr']
        order = args['order']
        query = ['SELECT restr_name, restr_address, restr_score, restr_cuisine',
                  'restr_price, restr_neighborhood, food_score, service_score',
                  'ambience_score, price_score, rating_text FROM Restaurant',
                  'JOIN Rating on '

def find_restr(args):
