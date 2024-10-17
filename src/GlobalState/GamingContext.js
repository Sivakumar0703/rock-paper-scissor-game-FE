import axios from "axios";
import { io } from "socket.io-client";
import { createContext, useState, useEffect , useRef } from "react";
import { toast } from "react-toastify";


export const gamingContext = createContext(null);
let socket;
let isMounted;

const GamingContext = ({ children }) => {
  const baseUrl = "http://localhost:8000";
  // const baseUrl = "https://rock-paper-scissor-game-be.onrender.com";
  const url = "http://localhost:8000/api/rps";
  // const url = "https://rock-paper-scissor-game-be.onrender.com/api/rps";
  const [createButton , setCreateButton] = useState("CREATE");
  const [joinButton , setJoinButton] = useState("JOIN");
  const [showGameArea, setShowGameArea] = useState(false);
  const [code, setCode] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [isPlayer1,setIsPlayer1] = useState(false);
  const [loading , setLoading] = useState(true);
  const [isDisabled , setIsDisabled] = useState(false); // disable the options when player made his choice
  const [opponentStatus , setOpponentStatus] = useState(false); // to check whether the opponent made his choice or not
  const [trigger , setTrigger] = useState(false);
  const [blastPop , setBlastPop] = useState(false);
  const inputCodeRef = useRef(null);
  const countRef = useRef(0);
  let playerIdFromLocal = JSON.parse(sessionStorage.getItem("playerId"))?.id;
 
  // reload all the data on page refresh 
  async function getPlayerDataById(id){
    try {
    const gamerData = await axios.get(`${url}/search/${id}`);
    setPlayerData(gamerData.data.data);
    setPlayerName(gamerData.data.data.name);
    setPlayerId(gamerData.data.data.id);
    setIsPlayer1(gamerData.data.data.is_player1);
    setLoading(false);
    setOpponentStatus(gamerData.data.data.is_opponent_made_his_choice);
    if(gamerData.data.data.score.length == 6){
      setIsDisabled(true);
      if(gamerData.data.data.name == gamerData.data.data.winner){
        setBlastPop(true);
        setShowGameArea(false);
      } else { 
        if(countRef.current == 0) {
          countRef.current = countRef.current + 1;
          setTimeout(()=>alert("YOU LOSE THE GAME.NICE TRY"),3000);         
        }
      }
    } else {
      setIsDisabled(gamerData.data.data.choice_made);
    }
    if(gamerData.data.data.score.length){
      gamerData.data.data.is_player1 ? setCreateButton("CREATED") : setJoinButton("JOINED")
    } else if(gamerData.data.data.score == null && gamerData.data.data.code){
      gamerData.data.data.is_player1 ? setCreateButton("CREATED") : setJoinButton("JOINED")
    }
    gamerData.data.data.opponent_name ? setShowGameArea(true) : setShowGameArea(false);
    } catch (error) {
      toast.error("internal server error".toUpperCase());
      console.log("error in fetching gamer data by id",error);
    }
  }

  // update choice and final result
  async function update(endpoint,data){ 
    try {
      if(data.endResult){
        if(data.endResult == "tie"){
          data.endResult = "tie";
        } else if (data.endResult == "p1" && data.is_player1){
          data.endResult = "won";
        } else if(data.endResult == "p2" && data.is_player1){
          data.endResult = "loss";
        } else if (data.endResult == "p2" && !(data.is_player1)){
          data.endResult = "won";
        } else {
          data.endResult = "loss";
        }
      }
      await axios.put(`${url}/${endpoint}`,data);
      setTrigger((prev) => !prev);
    } catch (error) {
      toast.error("error in updating choice".toUpperCase());
      console.log("error in updating choice",error);
    }

  }

  useEffect(() => {
    if (isMounted) {
      return;
    }

    isMounted = true;
    socket = io(`${baseUrl}`);

  }, []);

  // triggering function to restore all data on page reload
  useEffect(() => {

    if(playerIdFromLocal){
      getPlayerDataById(playerIdFromLocal);
    }

  },[trigger])



  return (
    <div>
      <gamingContext.Provider
        value={{
          socket,
          isMounted,
          showGameArea,
          setShowGameArea,
          code,
          setCode,
          url,
          playerId,
          setPlayerId,
          playerName,
          setPlayerName,
          playerData,
          setPlayerData,
          isPlayer1,setIsPlayer1,
          createButton , 
          setCreateButton,
          joinButton , 
          setJoinButton,
          inputCodeRef , loading,
          isDisabled , setIsDisabled,
          opponentStatus , setOpponentStatus,
          setTrigger , update,
          blastPop , setBlastPop,
        }}>
        {children}
      </gamingContext.Provider>
    </div>
  );
};



export default GamingContext;
