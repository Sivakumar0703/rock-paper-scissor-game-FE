
# ROCK-PAPER-SCISSOR

I have created a simple real-time rock-paper-scissors game using Socket.IO and ReactJS and Bootstrap. 


## Demo Video

[![Watch the video](https://drive.google.com/file/d/1MynH20kw_SZxsVWzxzeOvoQ9PZiWU8pK/view?usp=drive_link)](https://drive.google.com/file/d/1KditwEL-8sd9AfikZROTmxci37Itro_O/view?usp=drive_link)



## Run Locally

Clone the project

```git
  git clone https://github.com/Sivakumar0703/rock-paper-scissor-game-FE
```

Go to the project directory

```git
  cd my-project
```

Install dependencies

```git
  npm install
```

Start the server

```git
  npm run start
```


## Documentation

Enter your name in the input box and click on 'ENTER GAME' to get into the game page. It will take you to the endpoint '/game-page' Where actually you can play this game.

To play the game you have to either 'CREATE' a new game or 'JOIN' the existing game with the access code. Player Who opts for creating a game will generate the access code Which is displayed above the create game area.

Once the other player joined the game the creator will get the notification. The one Who creates the game becomes the player-1 by default.

As soon as the other player join the game , the game gets started automatically player can choose any of these options['rock' , 'paper' , 'scissor'] from the game area.Below that you can also see that your opponent made his choice or still thinking.

Once both the players made their choice the result of the game is displayed through the toast message and the game history is recorder below the page.

After completing the six games the final result will be showed.

Player can also check the scoreboard by clicking on the scoreboard menu at the top right corner of the game page.

