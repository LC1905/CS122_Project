# CS122 Project: Ratings scraper

import re
import bs4
import sys
import csv
import util 
import crawler

def rating_database(url):
    '''
    Construct a database of ratings using the url thai contains the ratings

    Input: the url that contains all the ratings
    Output: a dictionary that contains all the information about each rating
    '''
    soup = crawler.get_soup(url)
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