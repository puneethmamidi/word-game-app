import React,{useContext} from 'react';
import { ScoreContext } from './Practice';
import axios from 'axios';

function Sum() {
  
  const score = useContext(ScoreContext);

 


  
  return (
    <div>
      <div className='card-sum'>
        <p>{score}</p>
      </div>
    </div>
  )
}

export default Sum