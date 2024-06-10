import React, { useEffect, useState, useRef,createContext } from 'react'
import '../pages/Practice.css';
import Home from '../Home';
import axios from 'axios';
//import Sum from './Sum';
import Swal from 'sweetalert2';
import { Icon } from 'react-icons-kit';
import {chevronRight} from 'react-icons-kit/typicons/chevronRight';
import Practice_validations from './Practice_validation';
export const ScoreContext = createContext();

function Practice() {
  // state variables
  const [values,setValues] = useState({
    user_data:''
  })
  const [score, setScore] = useState(null);
  const [avgScore, setAvgScore] = useState(null);
  const [word,setWord] = useState(0);
  const [isScore, setIsScore] = useState(true);
  const [errors, setErrors] = useState({});
  const [isScoreGenerated, setIsScoreGenerated] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [objects, setObject] = useState({});
  const [auth,setAuth] = useState(false)
  const [player_id, setUserId] = useState('');
  const [player_username, setUsername] = useState('');
  const textareaRef = useRef();
  const [count, setCount] = useState(1);
  const handlePaste = (event) => {
        event.preventDefault();
      };
  const handleCopy = (event) => {
        event.preventDefault();
  }; 
  const handleCut = (event) => {
    event.preventDefault();
};
const handleChange = (e) =>{
  setValues({...values,user_data:e.target.value})
  const data = e.target.value.split(' ')
  console.log(data)

  if(data.length<=120){
    setWord(data.length)
  }else{
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "warning",
      title: "You reached the word limit"
    });
  }
}

useEffect(() => {
  axios.get('http://localhost:8081')
    .then(res => {
      if (res.data.Status === "Success") {
        setAuth(true)
        setUsername(res.data.username)
        setUserId(res.data.id)
      } else {
        console.log(res.data.Error)
      }
    });
}, []);

useEffect(() => {
  const fetchData = async () => {
    const result = await axios(`http://localhost:8081/object/${currentId}`);
    setObject(result.data);
    
  };

  fetchData();
}, [currentId]);
 // HandleScore
  const handleScore = (event) =>{
    const err = Practice_validations(values);
    setErrors(err);
    const word = objects.word;
    const word_id = currentId;
    const user_ans = values.user_data;
    axios.post('http://localhost:8081/practiceSession-score', { values,word,word_id,player_id,player_username,score,user_ans})
   .then(response => {
      const {score,average_score} = response.data;
      if(response.data === 'NaN'){
        setIsScoreGenerated(false);
      }
      else{
        setIsScoreGenerated(true);
        textareaRef.current.disabled = true;
        setIsScore(false);
      }
      setScore(score);
      setAvgScore(average_score)
     
      
    })
   .catch(error => {
      console.error(error);
    });
  }
// Handle Next 
const handleNext = () => {
  
  if (currentId < 10 ){  
    textareaRef.current.value = '';
    
    
      setScore(null);
      setCurrentId(currentId + 1);
      setIsScoreGenerated(false);
      textareaRef.current.disabled = false;
      setIsScore(true);
      setCount(count + 1);
      
  }else if(currentId===10){
      Swal.fire({
        title: `Total Score: ${avgScore.toFixed(2)}`,
        width:"40rem",
        padding: "3em",
        color: "#716add",
        backdrop: `
          rgba(0,0,0,0.65)
          `
        });
      }
      textareaRef.current.value = '';
      
}

  
  return (
    <div className='container-p'>
      <Home />
      <div className = 'practice-card'>
        <div className='word'>
          <p className ='word-p'>{objects.word}</p>
        </div>
        <div className = 'explain'>
          <p>Explain the value of this word to someone in simple terms in English. You will be assessed based on how easily understandable your answer is</p>
        </div>
        <div >
          <textarea className='text-area'onCopy={handleCopy} onPaste={handlePaste} onCut={handleCut} placeholder='Write the answer here (The word limit is 120 words)'minLength='1'  name='user_data'ref={textareaRef}  onChange={(e) => handleChange(e)}>
          </textarea>
         
        </div>
        <div >
          <button disabled={!isScore} className={`gbt ${!isScore ? 'disabled' : ''}`} onClick={handleScore}>Generate score</button>
        </div>
        <div className='word-count'>
          <p >{word}/120</p>
        </div>
        <div className='score'> 
            <span id="score-d">Score: {score}</span>
          </div>
        <div className='nb'>
          <button onClick={handleNext} disabled={!isScoreGenerated} className={`nbd ${!isScoreGenerated ? 'disabled' : ''}`}>Next<Icon className='chevron' icon={chevronRight} size={22} /></button>
        </div>
        <div>
          <span className='page'>{count}/10</span>
        </div>
        {errors.user_data && <span className='error-p'>{errors.user_data}</span>}
      </div>
      
      
    </div>
    
  )
}

export default Practice
