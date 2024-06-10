import React, { useEffect, useState, useRef,createContext } from 'react'
import '../pages/AI.css';
import axios from 'axios';
import Sum from './Sum';
import Swal from 'sweetalert2';
import { Icon } from 'react-icons-kit';
import {chevronRight} from 'react-icons-kit/typicons/chevronRight';
import Practice_validations from './Practice_validation';
import Home from '../Home';
export const ScoreContext = createContext();

function AI() {
  // state variables
  const [values,setValues] = useState({
    user_data:'',
  })
  
  const [score, setScore] = useState(null);
  const [aiScore, setAiScore] = useState(null);
  const [word,setWord] = useState(0);
  const [isStart, setIsStart] = useState(true)
  const [text, setText] = useState('');
  const [isScore, setIsScore] = useState(true);
  const [errors, setErrors] = useState({});
  const [responseData, setResponseData] = useState("");
  const [isScoreGenerated, setIsScoreGenerated] = useState(false);
  const [currentId, setCurrentId] = useState(32);
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

const message = objects.word; 
axios.post('http://localhost:8081/bot', { message })
      .then(function (response) {
        setResponseData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
// HandleScore
  const handleScore = (event) =>{
    const err = Practice_validations(values);
    setErrors(err);
    const word = objects.word;
    const word_id = currentId;
    const user_ans = values.user_data;
    const competitor = 'Gen Ai';
    const aiAns = responseData;
    axios.post('http://localhost:8081/aiCompetition-score', { values, responseData,word,word_id,player_id,player_username,score,user_ans,aiScore,competitor,aiAns})
   .then(response => {
      const { score, aiScore } = response.data;
      if(response.data === 'NaN'){
        setIsScoreGenerated(false);
      }
      else{
        setIsScoreGenerated(true);
        textareaRef.current.disabled = true;
        setIsScore(false);
      }
      setScore(score);
      setAiScore(aiScore);
    })
   .catch(error => {
      console.error(error);
    });
}

  
  // Timer
const Ref = useRef(null);

// The state for our timer
const [timer, setTimer] = useState("00:00:00");

const getTimeRemaining = (e) => {
  const total =
    Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor(
    (total / 1000 / 60) % 60
  );
  const hours = Math.floor(
    (total / 1000 / 60 / 60) % 24
  );
  return {
    total,
    hours,
    minutes,
    seconds,
  };
};

const startTimer = (e) => {
  let { total, hours, minutes, seconds } =
    getTimeRemaining(e);
  if (total >= 0) {
    // update the timer
    // check if less than 10 then we need to
    // add '0' at the beginning of the variable
    setTimer(
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9
        ? minutes
        : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds)
    );
  }
};

const clearTimer = (e) => {
  // If you adjust it you should also need to
  // adjust the Endtime formula we are about
  // to code next
  setTimer("00:02:00");

  // If you try to remove this line the
  // updating of timer Variable will be
  // after 1000ms or 1sec
  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => {
    startTimer(e);
  }, 1000);
  Ref.current = id;
};

const getDeadTime = () => {
  let deadline = new Date();

  // This is where you need to adjust if
  // you endtend to add more time
  deadline.setMinutes(deadline.getMinutes() + 2);
  return deadline;
};
// Disable the Textarea
useEffect(() => {
  if (timer === "00:00:00") {
    textareaRef.current.disabled = true;
      setIsScore(true);
    } else {
      textareaRef.current.disabled = false;
      setIsScore(false);
    }
}, [timer]);
  
// Start button
const handleStart = () =>{
  clearTimer(getDeadTime());
  let index = 0;
const timer = setInterval(() => {
    if (index < responseData.length) {
        setText(prevText => prevText + responseData.charAt(index));
        index++;
    } else {
        clearInterval(timer);
    }
}, 65); // Adjust the typing speed here (in milliseconds)


   
  setIsStart(false)
}
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:8081/object/${currentId}`);
      setObject(result.data);
      
    };

    fetchData();
  }, [currentId]);

// Handle Next 
const handleNext = () => {
  
  if (currentId < 51 ){
    
    textareaRef.current.value = '';
    
    
      setScore(null);
      setAiScore(null);
      setText('')
      setCurrentId(currentId + 1);
      setIsStart(true)
      setIsScore(true);
      setCount(count + 1);
      
  }else if(currentId===10){
    
    textareaRef.current.value = '';
    setScore(null);
    setAiScore(null);
    setCurrentId(1)
    setCount(1)
  }
}

  
  return (

    <div className='container-p'>
      <Home /> 
      <div className = 'Ai-card1'>
        <div className='ai-word'>
          <p id='word-p'>{objects.word}</p>
        </div>
        <div className = 'ai-explain'>
          <p>Explain the value of this word to someone in simple terms in English. You will be assessed based on how easily understandable your answer is</p>
        </div>
        <div >
          <textarea className='text-textarea'onCopy={handleCopy} onPaste={handlePaste} onCut={handleCut} placeholder='Write the answer here (The word limit is 120 words)'minLength='1'  name='user_data' ref={textareaRef}  onChange={(e) => handleChange(e)}>
          </textarea>
          {errors.user_data && <span className='error-p'>{errors.user_data}</span>}
        </div>
        <div className='ai-gbt-cont'>
          <button onClick={handleScore} disabled={!isScore} className={`ai-gbt ${!isScore ? 'disabled' : ''}`}>Generate score</button>
        </div>
        <div >
          <p className='ai-word-count'>{word}/120</p>
        </div>
        
        <div className='ai-score'> 
            <span id="ai-score1">Score: {score}</span>
          </div>
        <div className='ai-nb'>
          <button onClick={handleNext} disabled={!isScoreGenerated} className={`nbd ${!isScoreGenerated ? 'disabled' : ''}`}>Next<Icon className='chevron' icon={chevronRight} size={22} /></button>
        </div>
        <div>
          <span className='ai-page'>{count}/20</span>
        </div>
      </div>
      <div>
      <hr className='ai-ruler'></hr>
      <div className = 'Ai-card2'>
        <div className='ai-word'>
          <p id='word-p'>{objects.word}</p>
        </div>
        <div className = 'ai-explain'>
          <p>Explain the value of this word to someone in simple terms in English. You will be assessed based on how easily understandable your answer is</p>
        </div>
        <div >
          <textarea className='text-textarea1' value={text} readOnly  onCopy={handleCopy} onPaste={handlePaste} onCut={handleCut} placeholder='Write the answer here (The word limit is 120 words)'minLength='1'  name='Ai_data' >
          </textarea>
         
          {errors.user_data && <span className='error-p'>{errors.user_data}</span>}
        </div>
        
        <div className='ai-score-cont'> 
            <span className="ai-score1">Score: {aiScore}</span>
          </div>
        <div>
        <p className='ai-time'>{timer}</p>
      </div>
      <div>
        <button onClick={handleStart} disabled={!isStart} className={`ai-start ${!isStart ? 'disabled' : ''}`}>Start</button>
      </div>  
      <div className='ai-comp-cont'>
        <p className='ai-comp'>Competing with:<img className='bot-img' width="55" height="50" src="https://img.icons8.com/?size=100&id=GBu1KXnCZZ8j&format=png&color=000000" alt="robot-1"/> Gen AI</p>
      </div>
      <div>
          <span className='ai-page1'>{count}/20</span>
        </div>
     
     </div>
      </div>
      <ScoreContext.Provider value={score}>
        <Sum score_data = {score} />
      </ScoreContext.Provider>
    </div>
    
  )
}

export default AI
