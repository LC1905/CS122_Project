# CS122 Project: Yelp Crawler
#
# Last modified: Feb 9 4:50 pm by Shucen Liu
#

import re
import bs4
import sys
import csv
import util 
import os
import sys
import ratings
import numpy as np
import pandas as pd
import django

sys.path.append('../CS122_Project/cs122/')

from restr_ratings.models import Restaurant, Rating
initial_url = 'https://www.yelp.com/search?cflt=restaurants&find_loc=Chicago%2C+IL'
limiting_domain = 'www.yelp.com'


def create_url(name, city, state):
    '''
    Given the name of the restaurant, the city you live in, and the state,
    return the Yelp url that contains all the search results

    Input: strings (restaurant name, city and state you live in)
    Output: the url that contains the search results of Yelp (a string)            
    '''
    name_words = name.split()
    name_new = "+".join(name_words)
    city_words = city.split()
    city_new = "+".join(city_words)
    if name == "null":
        url = initial_url
    else:
        url = ("https://www.yelp.com/search?find_desc=" + name_new + 
            "&find_loc=" + city_new + "%2C+" + state)
    return url

def get_soup(url):
    '''
    Given a url, return the soup object of this url

    Input: url (a string)
    Output: the soup object
    '''
    request = util.get_request(url)
    if request != None:
        text = request.text
        soup = bs4.BeautifulSoup(text, 'html5lib')
    return soup

def next_page(url):
    '''
    Find the url of next page of search results

    Input: the initial url
    Output: the url of next page of results
    '''
    soup = get_soup(url)
    pages = soup.find_all('a', 
        class_="available-number pagination-links_anchor")
    if len(pages) != 0:
        next = pages[0].get('href')
        next_url = util.convert_if_relative_url(url, next)
    else:
        next_url = None
    return next_url

def get_restr(page_url, soup, last_id, restr_name):
    '''
    Given the url of the first page of search results of a restaurant, return the information
    of all the restaurants in the search results which have the same name of 
    the restaurant we search for 

    Input: the url of the first page of search result on Yelp, the soup object
            of this url, the number of restaurants already crawled, and 
            the restaurant name we are interested in
    Output: dictionaries that contain restaurant profiles, and ratings of each
            restaurant
    '''
    restr_on_page = {}
    ratings_dict = {}
    name_ls = []
    type_ls = []
    price_ls = []
    index_ls = []
    nbh_ls = []
    address_ls = []
    score_ls = []
    url_ls = []
    regular_results = soup.find_all('li', class_="regular-search-result")
    for result in regular_results:
        restr = {}
        last_id += 1
        url_find = result.find_all('a', 
            class_="biz-name js-analytics-click")[0]
        # if url_find.text.lower() == restr_name.lower():
        name = url_find.text
        url_temp = url_find.get('href')
        url = util.convert_if_relative_url(page_url, url_temp)
        url_ls.append(url)
        restr_ID = last_id
        index_ls.append(restr_ID)
        ratings_dict[restr_ID] = rating_database(url)
        
        rating_find = result.find_all('div', 
            class_="biz-rating biz-rating-large clearfix")[0]
        # num_temp = re.findall('[0-9]+', rating_find.text)
        # restr['num_rvw'] = int(num_temp[0])
        score_find = rating_find.find_all('div')[0]
        category_find = result.find_all('span', class_ = 'category-str-list')[0]
        price_find = result.find_all('span', class_ = 'business-attribute price-range')[0]
        score = score_find.get('title')[:3]
        cuisine = category_find.text.strip('\n').strip(' ').split()[0].strip(",")
        price = price_find.text

        address_find = result.find_all('div', 
            class_="secondary-attributes")[0]
        nbh = address_find.span.text.strip()
        address = address_find.address.text.strip()
        restr_on_page[last_id] = restr
        Question(restr_name = name,
                    restr_address = address,
                    restr_score = score,
                    restr_cuisine = cuisine,
                    restr_price = price,
                    restr_neighborhood = nbh)

    return Question, ratings_dict, last_id


def rating_database(url):
    '''
    Construct a database of ratings using the url that contains the ratings

    Input: the url that contains all the ratings
    Output: a dictionary that contains all the information about each rating
    '''
    soup = get_soup(url)
    reviews = soup.find_all('div', itemprop = "review")
    rating_dict = {}
    for review in reviews:
        rating = review.find_all("meta", itemprop = "ratingValue")[0].get("content")
        date = review.find_all("meta", itemprop = "datePublished")[0].get("content")
        author = review.find_all("meta", itemprop = "author")[0].get("content")
        content = review.find_all("p", itemprop = "description")[0]
        rating_id = author + date
        if content != None:
            content_text = content.text
            content_text = content_text.replace("\n", " ")
        dictionary = {}
        dictionary["rating"] = rating
        dictionary["date"] = date
        dictionary["content"] = content_text
        rating_dict[rating_id] = dictionary
    return rating_dict

def crawler(name, city, state, max_num):
    '''
    Start from the url that contains the first page of search results, 
    crawl all the pages of restaurants, return two nested dictionary, one contains 
    all the information about the restaurants with the given name, and another contains all the ratings

    Input: the name, city, and state of the restaurant
            and the maximum number of pages to crawl
    Output: one dictionary that contains information about restaurants, 
            and one dictionary that contains all the ratings
    '''
    starting_url = create_url(name, city, state)
    starting_soup = get_soup(starting_url)
    restr_dict_all, rating_dict_all, last_id = get_restr(starting_url, starting_soup, 0, name)
    next_url = next_page(starting_url)
    for i in range(max_num):
        if next_url != None:
            next_soup = get_soup(next_url)
            restr_on_page, ratings_on_page, last_id = get_restr(next_url, next_soup, last_id, name)
            restr_dict_all.update(restr_on_page)
            rating_dict_all.update(ratings_on_page)
            if len(restr_on_page) >= 20:
                next_url = next_page(next_url)
            else:
                break

    return restr_dict_all, rating_dict_all
