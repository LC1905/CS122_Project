from essential import analysis
from essential import training

def test_topics():
    '''
    This is the test for topic modeling. Print True if topic is correct;
      print False otherwise. Tests are all made manually.
    '''
    i = 1
    for sentence in tests:
        test = training.process_sentence(sentence)
        print(sentence)
        print('analysis =', analysis.find_category(test), 'correct = ', tests[sentence])
        if analysis.find_category(test) == tests[sentence]:
            print("This one is: ", True, i)
            i += 1
        print()


tests = {"The BEER STEAMED CLAMS was also a perfect marriage of two of my favorite things: beer and mollusks.":"food",
"Our feast concluded with the WHISKEY CAKE. Absolutely incredible.":"food",
"Reminiscent of its long lost brother--the rum cake-- the luscious, rich poundcake-like texture melds harmoniously with a mild sweetness and a smokey, whiskey aftertaste.":"food",
"Really fantastic and fresh seafood.":"food",
"Grilled Tuna w/ Wasabi Mashed Potatoes: Tasted healthy and very interesting.":"food",
"The mashed potatoes had like a nice kick to it after each bite that cleared up my nose lol":"food",
"Fettuccine w/ Clams: The best damn thing here.":"food",
"The bread with the goat cheese butter was incredible.":"food",
"We also loved the octopus dish.":"food",
"His hirame was topped with a seared piece of engawa while truffle oil adorned his smoked unagi.":"food",
"Upstate has a great selection of East and West coast oysters and clams that changes daily.":"food",
"They have some great burger that is not on the menu, and I especially like the apple tart dessert":"food",
"they have roasted oysters at the Tavern, amazing!":"food",
"We had the matcha cheesecake for dessert and it was definitely interesting.":"food",
"One word... Savory!":"food",
"The falafel were super yummy - warm, crispy, and cooked to perfection.":"food",
"Flavor is fresh!":"food",
"There was literally a mountain of sweet potato on my plate with goat's cheese, spiced roasted chickpeas, sunflower seeds and some arugula.":"food",
"The combination of flavors was sooooo good.":"food",
"The avocado toast had an amazing goat cheese on top (which there could have been more of, to be honest) and the sweet potato toast came with a seasoned chickpea topping that added the perfect flavoring to the dish.":"food",
"Food was outstanding - with the smashed avocado exceeding my expectations.":"food",
"The fried zucchini and eggplant chips are amazing, the shrimp is amazing, the grilled octopus is AMAZING the lamb chops are amazing and last but not least the LOBSTER PASTA!":"food",
"the roast chicken was a bit too dry, it paired well with the vinegary cauliflower & broccoli.":"food",
"Oysters were ok.":"food",
"And I ordered the teriyaki chicken, the chicken is tasteless and it is WHITE, i never had a white teriyaki chicken, which may be considered not marinated enough.":"food",
"The restaurant week menu was pretty extensive with both seafood and meat options":"food",
"The food was good, but the portions are not necessarily filling depending on what you order.":"food",
"besides mashed potatoes and bacon everything else was mediocre at best":"food",
"First time eating steak far far and it was insanely good.":"food",
"The sake flight was a great way to find some new favorites and all 3 were incredibly delicious.":"food",
"The oysters tasted very fresh and were juicy and slightly sweet.":"food",
"Went with the rabbit--extremely tender and full of flavor--I left both full and extremely satisfied.":"food",
"I tried the Japanese Eggs Benedict ($16), teriyaki bacon, and black sesame pudding ($9)":"food",
"Brunch is beyond mediocre":"food",
"I've had the Tomo, Spicy Mama, Viking, Mystic, Anissa, and Manhattan rolls.":"food",
"Overall, good place to go for a quick but classy lunch as long as you're not expecting authentic Japanese food.":"food",
"I definitely recommend this amazing taps bar, but I don't recommend if you look for sake bar with powerful flavored food (too salty, too spicy, too hot etc) like other places.":"food",
"The sesame pudding is very good for dessert.":"food",
"The rice is a little too dry for my taste and the spicy tuna roll tasted a little off to me.":"food",
"The fried tofu was delicious, crunchy on the outside and soft in the inside.":"food",
"The pork belly sandwich was perfect blend, sweet sauce, soft bread and crunchy lettuces.":"food",
"The fish unfortunately was dry and had a distinct 'fishy taste' due to much of the bloodline being left.":"food",
"Very poor pork buns":"food",
" The ingredients were fresh and tasty and the portions huge (I could only eat half of it).":"food",
"Wow, legit sushi joint in Astoria.":"food",
"Excellent and authentic central Mexican cuisine - no Tex Mex hamburger stuff here!":"food",
"I got the 6 piece set along w/ a miso.":"food",
"The food was very fresh and flavorful.":"food",
"Once seated, we ordered margaritas and the Mayan cocktail, which was tequila, fresh corn purée, lime juice, and lemon juice.":"food",
"My personal favorite was the Zukesake (soy marinated salmon with shaved truffles).":"food",
"I enjoyed the flavor and texture of the seaweed that was used but the last few pieces towards the end of the meal came off on the salty side.":"food",
"I'm also a pain in the ass vegetarian who decided to order scallops for the first time in ten years and it was the best decision I've ever made.":"food",
"I love this place--only enough seating for 10-12 people, but the cozy set up and ambiance is perfect for how everything is conducted in this amazing little Japanese establishment!":"ambience",
"The decor was beautiful,  nice live music being played while you dine.":"ambience",
"Overall, great vibes and service":"ambience",
"However, when I got closer I noticed it was actually pretty dirty and hadn't been cleaned in a while.":"ambience",
"The place is packed, and there's about 20 people waiting.":"ambience",
"The ambiance is quite nice inside and perfect for a date night":"ambience",
"Love the gorgeous colors in the design of the space, and - a great playlist":"ambience",
"This place has gone the extra mile in attention to detail to make you feel comfortable.":"ambience",
"Light and refreshing environment overflowing with atmosphere.":"ambience",
"Cute little place.":"ambience",
"New neighborhood spot.":"ambience",
"Great location.":"ambience",
"Very Clean and well organize restaurant.":"ambience",
"Bright and spacious  with high ceiling.":"ambience",
"Casual, a great place to bring your date to.":"ambience",
"Ambiance was quiet and nice for a fast casual place.":"ambience",
"This is a reliable place and a nice family business.":"ambience",
"The seating area is casual and laidback -  utensils and water are already put out but they will bring your order to the table.":"ambience",
"I relish coming here alone on quiet weekday afternoons, to relax, coax my palate, & read their historically ebullient Spanish cuisine books.":"ambience",
"So it's not exactly a restaurant, but a small store with food and limited seating in the back.":"ambience",
"The place is cool, has a nice small eating area that's kept really clean.":"ambience",
"This is a fun locale but not fancy or romantic in the classics sense.":"ambience",
"Ambiance is fast casual and service was super friendly and helpful.":"ambience",
"I got seated in the tavern and it was still really charming!":"ambience",
"the restaurant is very cozy and quaint.":"ambience",
"Interior: It is super cramped and small so your going to have to wait but its not too bad":"ambience",
"The place is small and cozy, has the perfect ambiance of casual yet upscale, and the service is excellent.":"ambience",
"It was cozy and more intimate, but we could still have fun people watching the after-work patrons at the bar.":"ambience",
"I think they were going for a trendy look but all the whiteness made it feel a little sterile.":"ambience",
"It's relatively dark with lit candles everywhere which makes it very romantic, but it was awkwardly very quiet in there as well. ":"ambience",
"We reserved the more intimate upstairs area for my previous birthday and the setting was so cozy and welcoming, not stodgy or pretentious like some other steakhouses.":"ambience",
"The spot is incredibly intimate and is reminiscent of the bar-packed alleys in Tokyo.":"ambience",
"The restaurant is relatively new, as the lovely chef told us, having only opened about 8 months ago.":"ambience",
"The restaurant is tiny and narrow to the point that you feel like you are dining in someone's home rather than at a restaurant.":"ambience",
"This place is incredibly cute -- it's tiny, intimate, and homey.":"ambience",
"The ambiance was very nice as well - definitely cozy since the place could literally only fit 12-14 people.":"ambience",
"The restaurant itself is very sleek and modern, it had a warm, clean and modern atmosphere":"sleek",
"best part was the music selection - old":"ambience",
"It's a small casual location, easy to get to and very tasty food.":"ambience",
"It's cute and tiny so don't bring 6 people.":"ambience",
"The place inside is exceptionally small.":"ambience",
"Very difficult to find seating or even a place with a counter to stand by.":"ambience",
"This place seems to get crowded so expect there to be a line.":"ambience",
"First off, Gordo's smells like a public restroom.":"ambience",
"There's some cramped counter space on both sides for a total of maybe 6 or 7 people to share uncomfortably, but other than that you're probably going to have to eat them standing up with plate in hand and people bumping into you from all directions as they walked by.":"ambience",
"It's such a cozy environment and I always have a blast!":"ambience",
"What I like is that even though the place is crowded, it never felt too loud or overbearing.":"ambience",
"We were seated by the door and with traffic coming in and out, it was uncomfortable at moments.":"ambience",
"Wonderful murals on the wall.":"ambience",
"Atmosphere and noise allowed for conversation, which we quite enjoyed.":"ambience",
"Chef Yoshiko Sakuma is such a friendly person, and is there to help you make some very well informed decisions based on your palate.":"service",
"40 minutes is a loooong time":"service",
"Excellent welcoming staff!":"service",
"Service was not good, not attentive.":"service",
"When i presented the voucher the server's attitude completely changed and turned cold.":"service",
"Then the cook did my orders quickly and gave me my food.":"service",
"Firstly, the staff was very polite and helpful.":"service",
"The chef was personable and attentive.":"service",
"Service was super attentive.":"service",
"Water is always filled and food came out in timely manner.":"service",
"There is always a long line but it moves quickly.":"service",
"The staff here were all friendly and efficient.":"service",
"Once again, the service was impeccable!":"service",
"He has really meticulously thought it out and I'm so appreciative of that.":"service",
"the service was also very knowledgeable and very friendly.":"service",
"Servers didn't know much about the food either which surprised me.":"service",
"Bad and slow service":"service",
"The wait staff forgot a lot of things for our table.":"service",
"Service is great and attentive.":"service",
"By the time we finished our plates we were only 3 mimosas in about 30 minute time.":"service",
"but one head in the clouds server ruined the whole experience for us.":"service",
"At first I was a little turned away because the server seemed to want us to order more.":"service",
"Our host came off not exactly rude but definitely not a part of her job description.":"service",
"They seemed so unprepared for service and honestly this was just a not good experience.":"service",
"Everyone was very courteous and checked in to see that we were attended to throughout the course of the meal.":"service",
"To say the service sucked would be, unfortunately an understatement.":"service",
"The manager came by our table and even gave us complimentary plate of desserts!":"service",
"Service: pretty much on point. Attentive, polite, clean.":"service",
"Waited over 20 mins to even get the check":"service",
"Our server checked on us frequently, offered to refill glasses, brought water and was helpful and friendly.":"service",
"quickly spilled olive oil and took my colleague's bread away before she even finished":"service",
"The bus/boy/man was in such a rush to turnover the table":"service",
"MIA waiter, never came back to refill our water - not even once":"service",
"The service was amazing and the staffs are knowledgeable about the dishes.":"service",
"Staff: Here where my problem was. I feel like I would have given this place a 4 star rating if the waiter wasn't rude.":"service",
"Very casual place with a friendly hostess greeting you at the door and attentive serving staff.":"service",
"The service was absolutely disgusting , disrespectful runner - the guy that Leo the waitress - arguing with me .. what.":"service",
"The Hostess kept my group updated with the waiting times and made sure to seat us as soon as possible.":"service",
"The serving staff was very informative and knowledgable about the oysters and the menu.":"service",
"I was getting a little chilly and they offered to bring me blankets and to see if they can turn up the heater.":"service",
"They staff was friendly and attentive - our water glasses were always full and we could always find someone when we needed another round of drinks.":"service",
"No tip accepted at the coat check - all service is included.":"service",
"Service was killer - founder stopped by to welcome us into the restaurant":"service",
"Impeccable service as to be expected from the Union Square Hospitality Group.":"service",
"Our server was cute, fun and high energy; she got really excited about summer when I ordered a Pimms Cup on a cold and rainy January night.":"service",
"The place was crowded as any other night and we were able to get a table with no reservations in 20 minutes.":"service",
"Overall the staff was knowledgeable, helpful, and attentive.":"service",
"The waiters were really nice.":"service",
"However, the wait between the appetizer and the main food was long, about 20 min.":"service",
"While ordering, they were very friendly!":"service",
"It's definitely a bit pricier than other poke places I've been to and they serve just as big of a bowl if not more.":"price",
"I will say that if you come outside of theatre-pricing hours, the food is definitely on the expensive side.":"price",
"~$(Pricy)":"price",
"Also, I think their tacos are slightly overpriced by a few dollars, not a deal breaker, but it means I'll end up going there less.":"price",
"Next, we had the Arrachera Burrita - two come in this order as well for $13.":"price",
"Each dish on the brunch menu is $12 with $7 drinks so there are a lot of options for everyone at a good price for NYC.":"price",
"Pluses are the $7 brunch drinks and $13 entrees (still shows $11 on their website).":"price",
"I think its worth the try if you have cash to burn, or just left the strip club next door.":"price",
"Accepts all major credit cards":"price",
"I ordered a pork burrito for $14, which didn't include any accoutrements like you find at other Mexican retaurants.":"price",
"It was very tasty but super expensive for the portion.":"price",
"With $60, we tried all the small dishes like the skirt steak skewers, karage, salmon sushi, and a temaki.":"price",
"Pricey but amazing food":"price",
"Wish they had options for $8-$10 and a guac option that was cheaper for 1 person.":"price",
"Super reasonable prices.":"price",
"There are too many other options in NYC for me to justify spending another $15 here.":"price",
"I paid about $12 for three chicken tacos, and went home hungry.":"price",
"a little pricey for a quick lunch with many items $10-$14.":"price",
"Blue Maiz is just like Chipotle, but 2 dollars cheaper and with significantly more variety.":"price",
"A good value for high end sushi but still pricey for Astoria.":"price",
"Omakase prices ($45, $65, and $125) - great value":"price",
"We went for the omakase and for $125 a head, they delivered.":"price",
"While one may say why so expensive for a Japanese restaurant in Astoria, I will say they used very fresh ingredients such as truffle shavings and there was a reasonable amount of uni involved in different pieces of sushi.":"price",
"For the value, this is probably the best sushi you can get in the midtown area.":"price",
"The quality and selection are great for the price.":"price",
"Happy hour prices":"price",
"Food too expensive w/ minute portions.":"price",
"The price is not bad given its location and quality of food.":"price",
"Good fresh sushi at a reasonable price.":"price",
"certainly not cheap":"price",
"It's worth the 42$ easily":"price",
"Their lunch specials range from $8.50 to $10.50 for their rice dishes, $11 to $14.50 for sushi handroll combinations, and $13 to $16.50 for their bento boxes.":"price",
"Prices are a little higher due to location and decor.":"price",
"The happy hour can't be beat, $5 glass of Louis Martini cab.":"price",
"Price point is a little on the high side": "price",
"The place is worth the $$$$.":"price",
"Oh, also, the bottled sparkling water is 10 dollars a bottle and they don't keep it at your table.":"price",
"The pricing is fair for what you're getting and comparable to the area.":"price",
"Fair prices.":"price",
"6 Piece Set Omakase is not $45, it is $50.":"price",
"It was ~$30, and we got a huge platter of 5 different cheeses, chorizo, ham, fig jam, bread, pickles.":"price",
"You can get a delicious meal with wine for under $40 per person!":"price",
"The $12 Beer flight for 4 beers is pretty decent.":"price",
"Skirtsteak lollipops also did not disappoint, though they're more like kebabs than lollipops and were a bit skimpy for a $12 appetizer.":"price",
"Some of the food is pricey (Average NYC prices) but you can get a reasonably priced burger and beer here.":"price",
"The trio only comes with half rolls for $20 bucks which I didn't think was pricey at all.":"price",
"Overall, this place had the best lobster roll we've had and I look forward to returning (even though they raised their prices)":"price",
"Of course, spending $50 just sounds silly.":"price",
"All very affordable, I think it was like forty something bucks for everything.":"price",
"Happy hour pitcher of beer $13 woo hoo!!":"price",
"Moral of the story: I felt robbed walking out from Sons Of Thunder, especially for the price I paid ($23).":"price",
}

       



