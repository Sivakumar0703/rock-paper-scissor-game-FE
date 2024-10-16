
import "./playArea.css";
import {useContext,useEffect, useRef} from 'react';
import {gamingContext} from '../GlobalState/GamingContext';
import { toast } from 'react-toastify';

const PlayArea = () => {

  const {showGameArea,socket,playerData,code,inputCodeRef,loading,playerId,setOpponentStatus,isDisabled,setIsDisabled,update} = useContext(gamingContext);
  const gamer = JSON.parse(sessionStorage.getItem("gamer"));
  const playerDataRef = useRef(playerData);
  const playerAction = useRef(null);
  playerDataRef.current = playerData;
 
  let payload = {
      id:playerId,
      my_choice:"",
      is_opponent_made_his_choice:""
  }

  // on choosing option save the choice made by player to DB
  function handleChange(e){
        let isP1 = playerData.hasOwnProperty('name') ? playerData.is_player1 : gamer.isPlayer1;
        setIsDisabled(true);
        let data = {
          choiceMade:e.target.value,
          player:isP1?"player1" : "player2",
          roomId:code ? code : inputCodeRef.current.value,
          name: playerData.hasOwnProperty("name") ?  playerData.name : gamer.name
        }
        socket.emit(isP1 ? "player1Choice" : "player2Choice" , data);
        update('update_choice',{...payload,my_choice:e.target.value});
  }

  useEffect(() => {
      let events = ["player1MadeHisChoice" , "player2MadeHisChoice"];
    
        socket.on("player1MadeHisChoice" , (choice) => {
          if(choice){
            setOpponentStatus(true);
            update('update_choice',{...payload,is_opponent_made_his_choice:true})
            setIsDisabled(true);
          }
        })
  
        socket.on("player2MadeHisChoice" , (choice) => {
          if(choice){
            setOpponentStatus(true);
            update('update_choice',{...payload,is_opponent_made_his_choice:true})
            setIsDisabled(true);
          }
        })

        // prevent player from multiple select on page refresh
        if(playerData.choice_made){
          setIsDisabled(true);
        }

        // turning off the event listeners
        return () => {
        events.forEach((ev) => {
        socket.off(ev);
        }) }

  },[loading])

  useEffect(() => {
      socket.on("result" , (winner,endResult) =>{
        result(winner,endResult);
        setOpponentStatus(true);
      })

      // turning off the event listner
      return () => {
        socket.off("result")
      }
  },[])

  // update every game result to DB and show the result of each game played
  function result(winner,endResult){
  let user = JSON.parse(sessionStorage.getItem("gamer"));
  let gameResult;
  let gameCount;
  let pData = playerDataRef.current;
  if(pData.score?.length){
    gameCount = pData.score.length;
  } else {
    gameCount = 0;
  }
 
  // current game result (won = 1 ; loose = 0)
  if(winner == "tie"){ 
    gameResult = undefined;
    toast.info("It is a tie");
  }else if(winner == "player1"){
      if(pData.is_player1){
        toast.success("YOU WON THE GAME");
        gameResult = 1;
      } else {
        toast.error("YOU LOSE THE GAME");
        gameResult = 0;
      }
  }else if(winner == "player2"){
      if(pData.is_player1){
        toast.error("YOU LOSE THE GAME");
        gameResult = 0;
      } else {
        toast.success("YOU WON THE GAME");
        gameResult = 1;
      }
  }
     
  sessionStorage.setItem("gamer" , JSON.stringify(user)); // maintain lc to create new user for one time only
  
  // check game count & announce final winner
  const newScore = [...pData.score , gameResult];
  let payload = {
    id:playerId,
    score:newScore,
    playerName:pData.name,
    opponent_name:pData.opponent_name,
    endResult:endResult,
    is_player1:pData.is_player1
    }
    update("update_score",payload,endResult)
    setIsDisabled(false);
    setOpponentStatus(false);

    if(newScore.length == 6){
      playerAction.current.style.visibility = "hidden";
    }

    // uncheck all radio buttons
    let radioBtn = document.getElementsByName("gameOption");
    for(let i=0; i<radioBtn.length; i++){
      radioBtn[i].checked = false;
    }
  }

  return (
    <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div className={showGameArea ? "show-game-area" : "hide-game-area"} id="game-area">
            
            <div id="game-options">
            <div>
            <input  type='radio' value="rock" name='gameOption' id='rock' onChange={(e)=>handleChange(e)} disabled={isDisabled} /> 
            <label className="select-option" htmlFor='rock'>Rock</label>
            </div>
            
            <div>
            <input  type='radio' value="paper" name='gameOption' id='paper' onChange={(e)=>handleChange(e)} disabled={isDisabled} /> 
            <label className="select-option" htmlFor='paper'>Paper</label>
            </div>
            
            <div>
            <input  type='radio' value="scissor" name='gameOption' id='scissor' onChange={(e)=>handleChange(e)} disabled={isDisabled} /> 
            <label className="select-option" htmlFor='scissor'>Scissor</label>
            </div>
            </div>

            <div id="gif-container">
              <img src="https://img.itch.zone/aW1nLzY3MjIwNzguZ2lm/original/3kwXny.gif" alt="options" />
            </div>

            </div>

           <div ref={playerAction} style={showGameArea ? {visibility:"visible"} : {visibility:"hidden"} }>
            {playerData.is_opponent_made_his_choice  ? <p>OPPONENT MADE HIS CHOICE</p>  : <p>OPPONENT IS STILL THINKING...</p> }   
        </div>
    </div>
  )
}

export default PlayArea