# Tic Tac Toe Game
#### Made By: Kyle Partyka
#### Github: https://github.com/kwp5
#### App Demo: https://cs490-project2-kwp5-milestone2.herokuapp.com/
### <ins>Technologies Used</ins>: Python, HTML5, CSS, Heroku (For app deployment) <br>
### <ins>Libraries Used</ins>: Flask, SocketIO, CORS, SQLAlchemy, React, dotenv <br>
### <ins>How To Run</ins>:
  1. Install all technologies or libraries
  2. Run createDB.py to create all tables in the database<br>
  3. Run app.py and in another terminal do npm run start<br>
    3.1. For heroku deployment have heroku installed and create a new app with: <br>
               ```     heroku login -i ``` <br>
               ```     heroku create {insert name or leave blank} ``` <br>
               ```     if coming from main branch: git push heroku main  ```<br>
               ```     if coming from another branch: git push heroku (branch name):main  ```<br>
    3.2. After creation you need to install the database to heroku: <br>
               ```     heroku addons:create heroku-postgresql:hobby-dev ```<br>
               ```     heroku config ```<br>
      3.2.1. Grab the database url given from the config and place that value into a .env file <br>
                 ```     export DATABASE_URL='{url from config}' ```<br>
---
### <ins>Tech Issues<ins>:
  1. Score adding or subtracting more than one <br>
  ~ Most of the time I was researching how to update values in the databse through the documentation or what was provided to us, but when I was able to make it change it would change multiple times. I spent a while looking at where the emit was coming from and how many times it would emit. It was emitting based on everyone who was on the page so I had to find a new place for it. The state value that I had sending through the emit would not grab any vlaue that I would give it but would still work when displaying the html using the variable. So I switched the spot that the emit was sending to after the board is verified and had the value be the function returning whichever player won. Now it has only adjusted the value by 1. <br> 
  2. Making the format of the leaderboard correct <br>
  ~ I spent a lot of time playing around with the map function to see how it would react with different kinds of variables being placed inside of it. After it not working with how I would have liked the format I went to stack overflow and the .map documentation to see if there was an easier way to retierve the info. After looking at the documentation I saw that it kept returning Object where the data should be. Looking thorugh other people's problems on stack overflow I found that you need to map through the set of objects returned and that gave me the data in the format I wanted. <br>

 ---
### <ins>Future Additions<ins>:
  1. Add a chat room in which people can talk about the game and whatever else <br>
    ~ Could be done by implementing another sql table that would hold messages and send them all out via socket based on a chat emit
  2. When people login they can pick a color that would be their username, chat message color, and color that flashes when they win the game <br>
    ~ Similar to the username it would also have another input based on given colors or hex that would be in a dictionary and access in the javascript, css, and socket to display the color they picked
  3. Add a queue so all spectators can play based on when they arive <br>
    ~ Could be done by running code on a disconnect or leave button that would remove the person from the ACTIVE table and remap the table so another person could play
