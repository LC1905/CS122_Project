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
        soup = bs4.BeautifulSoup(text)
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

def get_restr(page_url, soup, restr_name):
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
    regular_results = soup.find_all('li', class_="regular-search-result")
    for result in regular_results:
        restr = {}
        url_find = result.find_all('a', 
            class_="biz-name js-analytics-click")[0]
        # if url_find.text.lower() == restr_name.lower():
        name = url_find.text
        url_temp = url_find.get('href')
        url = util.convert_if_relative_url(page_url, url_temp)        
        rating_find = result.find_all('div', 
            class_="biz-rating biz-rating-large clearfix")[0]
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
        r = Restaurant(restr_name = name,
                    restr_address = address,
                    restr_score = score,
                    restr_cuisine = cuisine,
                    restr_price = price,
                    restr_neighborhood = nbh,
                    restr_url = url)
        r.save()
        # rating_database(url, r, 0)

    return Restaurant

# def get_restr(page_url, soup, restr_name):
#     '''
#     Given the url of the first page of search results of a restaurant, return the information
#     of all the restaurants in the search results which have the same name of 
#     the restaurant we search for 

#     Input: the url of the first page of search result on Yelp, the soup object
#             of this url, the number of restaurants already crawled, and 
#             the restaurant name we are interested in
#     Output: dictionaries that contain restaurant profiles, and ratings of each
#             restaurant
#     '''
#     regular_results = soup.find_all('li', class_="regular-search-result")
#     for result in regular_results:
#         restr = {}
#         url_find = result.find_all('a', 
#             class_="biz-name js-analytics-click")[0]
#         # if url_find.text.lower() == restr_name.lower():
#         name = url_find.text
#         url_temp = url_find.get('href')
#         url = util.convert_if_relative_url(page_url, url_temp)        
#         rating_find = result.find_all('div', 
#             class_="biz-rating biz-rating-large clearfix")[0]
#         score_find = rating_find.find_all('div')[0]
#         category_find = result.find_all('span', class_ = 'category-str-list')[0]
#         price_find = result.find_all('span', class_ = 'business-attribute price-range')[0]
#         score = score_find.get('title')[:3]
#         cuisine = category_find.text.strip('\n').strip(' ').split()[0].strip(",")
#         price = price_find.text
#         address_find = result.find_all('div', 
#             class_="secondary-attributes")[0]
#         nbh = address_find.span.text.strip()
#         address = address_find.address.text.strip()
#         r = Restaurant(restr_name = name,
#                     restr_address = address,
#                     restr_score = score,
#                     restr_cuisine = cuisine,
#                     restr_price = price,
#                     restr_neighborhood = nbh)
#         r.save()
#         # rating_database(url, r, 0)

#     return Restaurant


def rating_database(r, i, max_num):
    '''
    Construct a database of ratings using the url that contains the ratings

    Input: the url that contains all the ratings
    Output: a dictionary that contains all the information about each rating
    '''
    soup = get_soup(r.restr_url)
    reviews = soup.find_all('div', itemprop = "review")
    for review in reviews:
        rating = review.find_all("meta", itemprop = "ratingValue")[0].get("content")
        date = review.find_all("meta", itemprop = "datePublished")[0].get("content")
        author = review.find_all("meta", itemprop = "author")[0].get("content")
        content = review.find_all("p", itemprop = "description")[0]
        rating_id = author + date
        if content != None:
            content_text = content.text
            content_text = content_text.replace("\n", " ")
        r.rating_set.create(rating_text = content_text, rating_date = date, rating_score = rating)
    next_url = next_page(url)
    i += 1
    if i <= max_num:
        if next_url != None:
            rating_database(next_url, r, i)
    

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
    get_restr(starting_url, starting_soup, name)
    next_url = next_page(starting_url)
    for i in range(max_num):
        if next_url != None:
            next_soup = get_soup(next_url)
            get_restr(next_url, next_soup, name)
            next_url = next_page(next_url)

    pass
