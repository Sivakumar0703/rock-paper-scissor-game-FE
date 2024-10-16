import {useContext} from 'react';
import { gamingContext } from '../GlobalState/GamingContext';

const ResultConatiner = () => {
    const{playerData} = useContext(gamingContext);

  return (
    <div>
       {playerData ?
       <>
       <div style={playerData.score?.length ? {visibility:"visible",margin:"10px"} : {visibility:"hidden"}}>
        <h3>Game History</h3>
        <div>

        {
            playerData.score ?.map((res,idx) => {
                let badgeColor;
                let text;
                if(res == undefined){
                    badgeColor =  "badge rounded-pill text-bg-warning m-2 p-2";
                    text = "TIE";
                } else {
                    badgeColor = res ? "badge rounded-pill text-bg-success m-2 p-2" : "badge rounded-pill text-bg-danger m-2 p-2";
                    text = res ? "WIN" : "LOSS";
                }
                
                return  <span key={idx} className={badgeColor}>{text}</span>
            })
        }

        </div>
        </div> </> : ""}
    </div>
  )
}

export default ResultConatiner


