function getStart_time(){
    let time = new Array(7,29);
    return time;
  }
  function getEnd_time(){
    let time = new Array(14,55);
    return time;
  }
  function getSoll_time(){
    let time = new Array(7,6);
    return time;
  }
  function getPause_time(){
    let time = new Array(0,30);
    return time;
  }
  
  function getRoundStart() {
      
        var start_time = getStart_time();
  
        var start_hours = start_time[0];
        var start_mins = start_time[1];
        var tens = 0;
          
        while(start_mins > 9){
            start_mins = start_mins - 10;
            tens++;
        }
        
        if (start_mins >= 5){
            start_mins = 5;
        }
        
        if (start_mins <= 4){
            start_mins = 0;
        }
        
        start_mins = start_mins + (tens*10);
        
        var rounded_start_time = [start_hours, start_mins];
        return(rounded_start_time);
      
  }
  console.log("Gerundeter Start: " + getRoundStart());
  
  function getRoundEnd() {
      
        var end_time = getEnd_time();
  
        var end_hours = end_time[0];
        var end_mins = end_time[1];
        var tens = 0;
        
        
        if (end_mins >= 56){
            end_mins = 0;
            end_hours++;
        
            var rounded_end_time = [end_hours, end_mins];
            return(rounded_end_time);
        }
        
        while(end_mins > 9){
            end_mins = end_mins - 10;
            tens++;
        }
    
        if (end_mins >= 6){
            end_mins = 0;
            tens++;
        } else if(end_mins == 0){
          end_mins = 0;
        } else if (end_mins <= 4){
            end_mins = 5;
        }
    
        end_mins = end_mins + (tens*10);
  
        var rounded_end_time = [end_hours, end_mins];
        return(rounded_end_time);
      
  }
  console.log("Gerundetes Ende: " + getRoundEnd());
  
  function getIstTime(){
    
    var roundedStart = getRoundStart();
    var roundedEnd = getRoundEnd();
    var pauseTime = getPause_time();
  
    var startHours = roundedStart[0];
    var startMins = roundedStart[1];
    var endHours = roundedEnd[0];
    var endMins = roundedEnd[1];
    var pauseMins = pauseTime[1];
    
    var istHours = endHours - startHours;
    var istMins = endMins - startMins - pauseMins;
    
    while (istMins < 0){
      istHours--;
      istMins = istMins + 60;
    }

    return [istHours, istMins];

  }
  console.log("Soll Zeit: " + getSoll_time());
  console.log("Gewertete Zeit: " + getIstTime());
  
  function getGleitzeit(){
    
    var istTime = getIstTime();
    var sollTime = getSoll_time();
    var pauseTime = getPause_time();
    
    var istHours = istTime[0];
    var istMins = istTime[1];
    var sollHours = sollTime[0];
    var sollMins = sollTime[1];
    var pauseMins = pauseTime[1];
    
    var gleitHours = istHours - sollHours;
    var gleitMins = istMins - sollMins;
    
    
    if (istHours < sollHours){
      gleitHours++;
      gleitMins = gleitMins - 60;
    }
    if (gleitHours > 0 && gleitMins < 0){
      gleitHours--;
      gleitMins = gleitMins + 60;
    }
    if (gleitMins < -59){
      gleitHours--;
      gleitMins = gleitMins + 60;
    }
    
    
    return gleit = [gleitHours, gleitMins];
  }
  console.log("Gleitzeit: " + getGleitzeit());