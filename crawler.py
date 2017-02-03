# CS122 Project: Yelp Crawler
#
# Last modified: Feb 2 by Xibai Wang
#

import re
import bs4
import sys
import csv
import util 

starting_url = 'https://www.yelp.com/search?cflt=restaurants&find_loc=Chicago%2C+IL'
limiting_domain = 'www.yelp.com'

def get_soup(url):
    request = util.get_request(url)
    if request != None:
        text = request.text
        soup = bs4.BeautifulSoup(text, 'html5lib')
    return soup

def next_page(url, soup):
    pages = soup.find_all('a', 
        class_="available-number pagination-links_anchor")
    next = pages[0].get('href')
    next_url = util.convert_if_relative_url(url, next)
    return next_url

def get_restr(page_url, soup, last_id):
    restr_on_page = {}
    regular_results = soup.find_all('li', class_="regular-search-result")
    for result in regular_results:
        restr = {}
        last_id += 1
        url_find = result.find_all('a', 
            class_="biz-name js-analytics-click")[0]
        restr['name'] = url_find.text
        url_temp = url_find.get('href')
        restr['url'] = util.convert_if_relative_url(page_url, url_temp)
        
        rating_find = result.find_all('div', 
            class_="biz-rating biz-rating-large clearfix")[0]
        num_temp = re.findall('[0-9]+', rating_find.text)
        restr['num_rvw'] = int(num_temp[0])
        score_find = rating_find.find_all('div')[0]
        restr['score'] = score_find.get('title')[:3]

        address_find = result.find_all('div', 
            class_="secondary-attributes")[0]
        restr['nbh'] = address_find.span.text.strip()
        restr['address'] = address_find.address.text.strip()
        restr_on_page[last_id] = restr
    return restr_on_page, last_id
