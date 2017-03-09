import analysis
import training

tests = {"The BEER STEAMED CLAMS was also a perfect marriage of two of my favorite things: beer and mollusks.":"food",
"Our feast concluded with the WHISKEY CAKE. Absolutely incredible.":"food",
"Reminiscent of its long lost brother--the rum cake-- the luscious, rich poundcake-like texture melds harmoniously with a mild sweetness and a smokey, whiskey aftertaste.":"food",
"Really fantastic and fresh seafood.":"food",
"Grilled Tuna w/ Wasabi Mashed Potatoes: Tasted healthy and very interesting.":"food",
"The mashed potatoes had like a nice kick to it after each bite that cleared up my nose lol":"food",
"Fettuccine w/ Clams: The best damn thing here.":"food",
"The bread with the goat cheese butter was incredible.":"food",
"We also loved the octopus dish.":"food",
"Upstate has a great selection of East and West coast oysters and clams that changes daily.":"food",
"They have some great burger that is not on the menu, and I especially like the apple tart dessert":"food",
"they have roasted oysters at the Tavern, amazing!":"food",
"We had the matcha cheesecake for dessert and it was definitely interesting.":"food",
"One word... Savory!":"food",
"The falafel were super yummy - warm, crispy, and cooked to perfection.":"food",
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
"Interior: It is super cramped and small so your going to have to wait but its not too bad":"ambience",
"The place is small and cozy, has the perfect ambiance of casual yet upscale, and the service is excellent.":"ambience",
"It was cozy and more intimate, but we could still have fun people watching the after-work patrons at the bar.":"ambience",
"The service was amazing and the staffs are knowledgeable about the dishes.":"service",
"Staff: Here where my problem was. I feel like I would have given this place a 4 star rating if the waiter wasn't rude.":"service",
"Very casual place with a friendly hostess greeting you at the door and attentive serving staff.":"service",
"The service was absolutely disgusting , disrespectful runner - the guy that Leo the waitress - arguing with me .. what.":"service",
"The Hostess kept my group updated with the waiting times and made sure to seat us as soon as possible.":"service",
"The serving staff was very informative and knowledgable about the oysters and the menu.":"service",
"I was getting a little chilly and they offered to bring me blankets and to see if they can turn up the heater.":"service",
"They staff was friendly and attentive - our water glasses were always full and we could always find someone when we needed another round of drinks.":"service",
"No tip accepted at the coat check - all service is included.":"service",
"Impeccable service as to be expected from the Union Square Hospitality Group.":"service",
"Our server was cute, fun and high energy; she got really excited about summer when I ordered a Pimms Cup on a cold and rainy January night.":"service",
"The place was crowded as any other night and we were able to get a table with no reservations in 20 minutes.":"service",
"The place is worth the $$$$.":"price",
"Oh, also, the bottled sparkling water is 10 dollars a bottle and they don't keep it at your table.":"price",
"The pricing is fair for what you're getting and comparable to the area.":"price",
"Fair prices.":"price",
"It was ~$30, and we got a huge platter of 5 different cheeses, chorizo, ham, fig jam, bread, pickles.":"price",
"You can get a delicious meal with wine for under $40 per person!":"price",
"The $12 Beer flight for 4 beers is pretty decent.":"price",
"Skirtsteak lollipops also did not disappoint, though they're more like kebabs than lollipops and were a bit skimpy for a $12 appetizer.":"price",
"Some of the food is pricey (Average NYC prices) but you can get a reasonably priced burger and beer here.":"price",
"The trio only comes with half rolls for $20 bucks which I didn't think was pricey at all.":"price",
"Overall, this place had the best lobster roll we've had and I look forward to returning (even though they raised their prices)":"price",
"Of course, spending $50 just sounds silly.":"price"}

def test_topics():
    i = 1
    for sentence in tests:
        test = training.process_sentence(sentence)
        print(sentence)
        print('analysis =', analysis.find_category(test), 'correct = ', tests[sentence])
        if analysis.find_category(test) == tests[sentence]:
            print("This one is: ", True, i)
            i += 1
        print()
       



