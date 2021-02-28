# Tic Tac Toe Game
#### Made By: Kyle Partyka
#### Github: https://github.com/kwp5
#### App Demo: https://cs490-project2-kwp5.herokuapp.com/
### <ins>Technologies Used</ins>: Python, HTML5, CSS, Heroku (For app deployment) <br>
### <ins>Libraries Used</ins>: Flask, SocketIO, CORS, SQLAlchemy, React <br>
### <ins>How To Run</ins>:
  1. Install all technologies or libraries
  2. Run spotifyPull.py <br>
    2.1. For heroku deployment have heroku installed and create a new app with: <br>
               ```     heroku login -i ``` <br>
               ```     heroku create {insert name or leave blank} ``` <br>
               ```     if coming from main branch: git push heroku main  ```<br>
               ```     if coming from another branch: git push heroku (branch name):main  ```<br>
---
### <ins>Tech Issues<ins>:
  1. Adjusting turns and keeping the players from clicking during other player's turn <br>
  ~ At first I had my onclick function to become false when the code finished and the next player was supposed to play, but then I realized that it was not going to change for the other player without some socket changes. So, I researched the usestate more using the documentation given and how I could use it to my advantage. Tried to make it work but the value would always be off so I tried placing the change turn in different spots to see its reaction. Seeing as that did not work I changed my code to have each player be a function that would run when their playername was equal to what the game had stored. This paired with the turn switching made it work flawlessly. <br> 
  2. Deploying to Heroku <br>
  ~ During the deployment I was getting an error that did not give me much to go off of when looking at the trace. So I looked up the error and tried to interpret how it was happening but that did not lead me anywhere. Looking at the slides provided and different homeworks I was able to see what my problem was which involved pushing from the milestone_1 branch to heroku's main. I found out from heroku's documentation that heroku only operates through main and I researched to find a command that would push my current branch as heroku's main. The command is listed earlier in the documentation. <br>
  3. Making Login page open on start <br>
  ~ I started by making the entire login page within the index.js because that was the file running the start of the app. I eventually hit a wall where I was not able to get the information to the board and socket to use while also seeing that moving from the login page to the board would not work. I then moved all of the login code to another js file in which it would run and just mimic the original index.js file to ensure that it will do what I need. Moving from the login page to the app took some time to realize because I wanted to return back to index.js when I could just render another page from the login file. After doing that it has worked no problem. <br>

 ---
### <ins>Future Additions<ins>:
  1. Add achat room in which people can talk about the game and whatever else <br>
    ~ Could be done by implementing a sql table that would hold messages and send them all out via socket based on a chat emit
  2. When people login they can pick a color that would be their username, chat message color, and color that flashes when they win the game <br>
    ~ Similar to the username it would also have another input based on given colors or hex that would be in a dictionary and access in the javascript, css, and socket to display the color they picked
  3. Add a queue so all spectators can play based on when they arive <br>
    ~ Could be done by labeling the players "player" and spectators "spec" which is already somewhat implemented, but then would swap the values between the player who lost and the top spectator
