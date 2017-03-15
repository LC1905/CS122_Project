# CS122_Project
UChicago_CS122_Project: Zhifan Zhou, Shucen Liu, Xibai Wang, Can Liu

*** IMPORTANT ***
When testing our project, please run "python3 manage.py runserver" in the "CS122_Project/cs122" directory. Once the link appears, right click to open the link, and add "restr_ratings" to the end, OR ELSE IT WILL NOT WORK.

Once the webpage shows up, please enter the restaurant you want to compare with and rank the importance of neighborhood, category and price to you. The restaurant name is case insensitive and the ranking is REQUIRED. If a restaurant has multiple locations, you can also enter restrictions on location.

If the restaurant name entered is not valid, no similar restaurant will be recommended.


All relevant files are in CS122_Project/cs122/essential:

crawler.py: code for crawling yelp webpages
training.py: code for training topic models
calculate_score.py: code for getting sentimental analysis scores
analysis.py: code for sentimental analysis and topic modeling
output.py: code for plotting and recommending restaurants
testing.py: code for testing topic modelings

training.csv: training data for topic modeling
model.csv: topic models


Files in CS122_Project/the_road_not_taken marks some alternative attempts we made:

nltk_simplify.py: open source code for nltk simplify package. We tried to use this API to resolve the unmatching between the part of speech given by nltk.pos_tag and that used in SentiWordNet.

basic_sentiment_analysis.py: this is our attempt to evaluate sentiments of words using NaiveBayesClassifier. However, later on we realized that SentiWorkNet can finish the task more directly.

topic_modeling.py: this is an early version of topic modeling using PorterStemmer to find roots of words. In an earlier version, instead of hardcoding the topic models, we used LDA to find topic models. We decided to follow the former path because of the inability of LDA to find particular given topics. Unfortunately, I accidently deleted our code for LDA as well as some other small adjustments we made (deleting overlapping words, changing the size of the models, adjusting thresholds, etc.) and could not find it on GitHub. 

example.json: we initially planned to use data from Yelp Data Challenge because they are more structured. But since there is no data for Chicago's restaurants, we decided to crawl yelp webpages ourselves.