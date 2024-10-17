
import "./createOrJoin.css";
import axios from "axios";
import {useState , useEffect , useContext} from "react";
import {gamingContext} from "../GlobalState/GamingContext";
import { toast } from 'react-toastify';

const CreateOrJoinGame = () => {
 
    const [isDisabled , setIsDisabled] = useState(false);
    const {socket,code,setCode,playerName,url,playerId,isPlayer1,setIsPlayer1,setShowGameArea,playerData,joinButton,setJoinButton,createButton,setCreateButton,inputCodeRef,loading,setTrigger} = useContext(gamingContext);
    const gamer = JSON.parse(sessionStorage.getItem("gamer"));

    // Create a new game to generate access code
    function createGame(){
        setIsDisabled(true);
        setCreateButton("CREATED");
        setIsPlayer1(true); 
        gamer.isPlayer1 = true;
        sessionStorage.setItem("gamer",JSON.stringify(gamer))
        socket.emit("start-game",playerName,playerData.id);       
        socket.on("newGame" , (payload) => {
            setCode(payload.code)
            gamer.code = payload.code
            sessionStorage.setItem("gamer" , JSON.stringify(gamer))
        })

        // receives an alert when opponent joins the game
        socket.on("playersReady" , (msg,name,room) => {
            updateGamerData(name,room,true);
            // setCode(room); // there two are set back to initial state
            // setIsPlayer1(true); // there two are set back to initial state 
            toast.info(msg.toUpperCase())
        })
    }

    // Joining the existing game by using access code
    function joinGame(){
        setJoinButton("JOINED");
        setIsDisabled(true);
        let joinCode = inputCodeRef.current.value;
        let data = {joinCode,playerName,id:playerData.id}
        if(!joinCode){
            return alert("No Code is provided")
        }
        socket.emit("joinGame" , data);
        socket.on("getOpponentName" , (opponentName,room) => {
            // setCode(room); // there one is set back to initial state
            // setIsPlayer1(() => false); // there one is set back to initial state
            updateGamerData(opponentName,room,false); // code & p1 status are hard coded
        } );
        socket.on("room-full" , () => {
            toast.warn("YOU ARE NOT ALLOWED TO JOIN");
            setJoinButton("JOIN");
            setIsDisabled(false);
            inputCodeRef.current.value="";
            return
        })
        gamer.isPlayer1 = false;
        gamer.code = joinCode;
        sessionStorage.setItem("gamer",JSON.stringify(gamer))
    }

    // save these data to DB => player-id , access-code , opponent-name , is-player1
    async function updateGamerData(opponentName,room,isP1){
        try {
            console.log("line-1")
            let data = {
                id:playerId ,
                is_player1 : isP1,
                code:room,
                opponent_name:opponentName,
            }
            console.log("line-2")
            await axios.put(`${url}/update_gamer` , data);
            console.log("line-3")
            setShowGameArea(true);
            setTrigger((prev) => !prev);
        } catch (error) {
            toast.error("internal server error".toUpperCase());
            console.log("error in updating gamer data",error);
        }
    }

    useEffect(() => {
       
        // on page refresh restore the data
        if(gamer.isPlayer1){
            setIsDisabled(true);
            setCreateButton("JOINED");
            setIsPlayer1(true);
            setCode(gamer.code);
        }
        if(gamer.isPlayer1 !== null && !gamer.isPlayer1){
            setIsDisabled(true);
            setJoinButton("JOINED");
        }

        // push all the event-listner inside the event array to turn-off
        const event = [ "playersReady" , "start-game" , "newGame" , "getOpponentName"]; 

        // stop listening events on component unmount
        return () => {
           socket && event.forEach((e) => {
                socket.off(e)
            })
        }

    },[])

  return (
    <div>
        {
            loading ? <></> : <>
         <div className="marquee-container">
            <div style={{width:"100%"}}>
                {
                !isDisabled ? 
                <marquee className="headline-scroll" loop="infinite" > PLEASE CREATE A NEW GAME OR JOIN THE GAME WITH THE CODE TO START YOUR GAME  🪨 ROCK   📄 PAPER  ✂️ SCISSOR   </marquee> :
                <marquee className="headline-scroll" loop="infinite" > {`${playerData.score.length} GAMES ARE OVER - ONLY ${6 - Number(playerData.score.length)} GAMES LEFT   🪨 ROCK   📄 PAPER  ✂️ SCISSOR`}   </marquee>
                }
            </div>
         </div>

         <div>
            <p className="welcome-note">{`Hi, ${playerData.name.toUpperCase()} Welcome To Rock-Paper-Scissor Game`}</p>
         </div>

            <div style={{padding:"5px",marginLeft:"5px"}}>
            {
                isPlayer1 && isDisabled ?   
                <p style={{fontSize:"25px"}}> Share this code with your friend to begin your game : <b>{code}</b> </p>
                : ""
            }
        </div>

        <div className="createOrJoinCointainer">
            <div>
            <button className="btn btn-success" disabled={isDisabled} onClick={createGame}> {createButton} </button>
            </div>   

            <div>
                <span className="choice">OR</span>
            </div>

            <div className="join-container">
                <div className="m-2">
                    <input placeholder="Enter Your Joining Code" disabled={isDisabled} ref={inputCodeRef} />
                </div>
            <div>
            <button className="btn btn-primary" disabled={isDisabled} onClick={joinGame} > {joinButton} </button>
            </div>
            </div>          

        </div>

        <div className="play-container">
        </div>
        </> }
    </div>
  )
}

export default CreateOrJoinGame