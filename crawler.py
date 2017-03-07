# CS122 Project: Yelp Crawler

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

def next_page(url, page_num):
    '''
    Find the url of next page of search results

    Input: the initial url, initial page number
    Output: the url of next page of results
    '''
    soup = get_soup(url)
    pages = soup.find_all('a', 
        class_="available-number pagination-links_anchor")
    for page in pages:
        num = int(page.text.strip())
        if num == page_num + 1:
            next = page.get('href')
            next_url = util.convert_if_relative_url(url, next)
            break
        else:
            next_url = None
    return next_url, page_num + 1

def get_restr(page_url, soup):
    '''
    Given the url of the first page of search results of a restaurant, return the information
    of all the restaurants in the search results which have the same name of 
    the restaurant we search for 
    '''
    regular_results = soup.find_all('li', class_="regular-search-result")
    for result in regular_results:
        restr = {}
        url_find = result.find_all('a', 
            class_="biz-name js-analytics-click")[0]
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
        rating_database(url, 0, r, 19)
    # return Restaurant

def rating_database(url, i, restr, max_num):
    '''
    Construct a database of ratings using the url that contains the ratings

    Input: the url that contains all the ratings
    Output: a dictionary that contains all the information about each rating
    '''
    soup = get_soup(url)
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
        restr.rating_set.create(rating_text = content_text, rating_date = date, rating_score = rating)
    next_url, page_num = next_page(url, i + 1)
    i += 1
    if i <= max_num:
        if next_url != None:
            rating_database(next_url, i, restr, max_num)
    

def crawler(starting_url, max_num, page_num):
    '''
    Start from the url that contains the first page of search results, 
    crawl all the pages of restaurants, return two nested dictionary, one contains 
    all the information about the restaurants with the given name, and another contains all the ratings3
    '''
    starting_soup = get_soup(starting_url)
    get_restr(starting_url, starting_soup)
    next_url = next_page(starting_url, page_num)[0]
    for i in range(page_num, page_num + max_num):
        if next_url != None:
            next_soup = get_soup(next_url)
            get_restr(next_url, next_soup)
            next_page_url, next_page_num = next_page(next_url, i + 1)
            next_url = next_page_url

    return next_url, next_page_num
    
