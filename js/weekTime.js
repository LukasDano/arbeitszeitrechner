$(document).ready(function () {

	function getDaysWorkHoursAsList(){
	
		var monday_time = $("#monday").val().split(":");
		var monday_hours = parseInt(monday_time[0], 10);
	   
		var tuesday_time = $("#tuesday").val().split(":");
		var tuesday_hours = parseInt(tuesday_time[0], 10);
	   
		var wednesday_time = $("#wednesday").val().split(":");
		var wednesday_hours = parseInt(wednesday_time[0], 10);
	   
		var thursday_time = $("#thursday").val().split(":");
		var thursday_hours = parseInt(thursday_time[0], 10);
	   
		var friday_time = $("#friday").val().split(":");
		var friday_hours = parseInt(friday_time[0], 10);
		
		let daysWorkHours = [monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours];
		
		return daysWorkHours;

	}
	
	function getDaysWorkMinsAsList(){
	
		var monday_time = $("#monday").val().split(":");
		var monday_mins = parseInt(monday_time[1], 10);
	   
		var tuesday_time = $("#tuesday").val().split(":");
		var tuesday_mins = parseInt(tuesday_time[1], 10);
	   
		var wednesday_time = $("#wednesday").val().split(":");
		var wednesday_mins = parseInt(wednesday_time[1], 10);
	   
		var thursday_time = $("#thursday").val().split(":");
		var thursday_mins = parseInt(thursday_time[1], 10);
	   
		var friday_time = $("#friday").val().split(":");
		var friday_mins = parseInt(friday_time[1], 10);
		
		let daysWorkMins = [monday_mins, tuesday_mins, wednesday_mins, thursday_mins, friday_mins];
		
		return daysWorkMins;

	}
	
	function getWeekWorkTime(){

		var daysWorkHours = getDaysWorkHoursAsList();
		var daysWorkMins = getDaysWorkMinsAsList();
	
		var week_hours = daysWorkHours[0] + daysWorkHours[1] + daysWorkHours[2] + daysWorkHours[3] + daysWorkHours[4];
		var week_mins = daysWorkMins[0] + daysWorkMins[1] + daysWorkMins[2] + daysWorkMins[3] + daysWorkMins[4];
		
		while (week_mins >= 60) {
		week_mins = week_mins - 60;
		week_hours++;
		}
	
		return week_time = [week_hours, week_mins];
	
	}
	
	function getWorkedDaysForWeek(){

		var daysWorkHours = getDaysWorkHoursAsList();
		var daysWorkMins = getDaysWorkMinsAsList();
		var countedDays = 5;
		
		for (let i = 0; i<5; i++){
		
			if(daysWorkHours[i] == 0 && daysWorkMins[i] == 0){
				countedDays --;
			}
			
		}
		return countedDays;
	}
	
    function calculateWeekOverTime(gleitagGenommen) {
		var countedDays = getWorkedDaysForWeek();
		var weekWorkTime = getWeekWorkTime();
		const gleittageThisWeek= parseInt(readFromLocalStorage("gleittage"))

		if (gleittageThisWeek && gleitagGenommen){
			countedDays = gleittageThisWeek + countedDays;
			deleteFromLocalStorage("gleittage");
		}else if (gleitagGenommen) {
			const gleittageThisWeek = parseInt(prompt("Anzahl Gleitage diese Woche:", ""), 10);
			countedDays = gleittageThisWeek + countedDays;
			writeToLocalStorage("gleittage", gleittageThisWeek);
		}

		var shouldHours = countedDays * 7;
		var shouldMins = countedDays * 6;
		var istHours = weekWorkTime[0];
		var istMins = weekWorkTime[1];
	
		var overTimeHours = istHours - shouldHours;
		var overTimeMins = istMins - shouldMins;
	
		//console.log("overTimeHours: " + overTimeHours);
		//console.log("overTimeMins: " + overTimeMins);

		if (overTimeMins < 0) {
			overTimeHours--;
			overTimeMins += 60;
		} else if (overTimeMins >= 60) {
			overTimeHours++;
			overTimeMins -= 60;
		}

		if (overTimeHours < 0) {
			overTimeHours++;
			overTimeMins -= 60;
		}

		return [overTimeHours, overTimeMins];
	}
	
	function setWeekTime(){
    
		var week_time = getWeekWorkTime();
		
		var weekHours = week_time[0];
		var weekMins = week_time[1];

		if (weekHours <= 9){
			weekHours = "0" + weekHours;
	  	}

	  	if (weekMins <= 9){
		    weekMins = "0" + weekMins;
		}
		
		var weekTimeAusgabe = weekHours + "." + weekMins + " h";
	
		//console.log(weekTimeAusgabe);
		$("#weekworktime").html(weekTimeAusgabe);
	}	

	function setWeekOverTime(gleittag) {

		var weekTime = calculateWeekOverTime(gleittag);
		
		var weekHours = weekTime[0];
		var weekMins = weekTime[1];
		
		if (weekHours < 0 || weekMins < 0){
			
			weekHours = Math.abs(weekHours);
			weekMins = Math.abs(weekMins);
	
			var weekOverTimeAusgabe = "-" + weekHours + "." + weekMins + " h";
			
		} else if (weekHours > 0 || weekMins > 0){
			var weekOverTimeAusgabe = "+" + weekHours + "." + weekMins + " h";
		} else {
			var weekOverTimeAusgabe = "0.0 h";
		}
	
		//console.log(weekOverTimeAusgabe);
		$("#weekovertime").html(weekOverTimeAusgabe);
	}

	function calculateWeekTime(gleittag){
		setWeekTime();
		setWeekOverTime(gleittag);
		uploadDaysTime();
		writeToLocalStorage("calculated", gleittag);
	}

	$("#weekTimeCalc").click(function () {
		calculateWeekTime(false);
	});

	$("#weekTimeCalcFloat").click(function () {
		calculateWeekTime(true);
	});

	$("#daytimefields").keypress(function (event) {
		if (event.which === 13) {
			setWeekTime();
			setWeekOverTime();
			uploadDaysTime();
			uploadDaysTime();
		}
	});
	
	$("#monday").change(function () {
		uploadDaysTime();
	})
	
	$("#tuesday").change(function () {
		uploadDaysTime();
	})
	
	$("#wednesday").change(function () {
		uploadDaysTime();
	})
	
	$("#thursday").change(function () {
		uploadDaysTime();
	})

	$("#friday").change(function () {
		uploadDaysTime();
	})
	
	function uploadDaysTime(){

		var monday_time = $("#monday").val();
		var tuesday_time = $("#tuesday").val();
		var wednesday_time = $("#wednesday").val();
		var thursday_time = $("#thursday").val();
		var friday_time = $("#friday").val();
		
		writeToLocalStorage("monday", monday_time);
		writeToLocalStorage("tuesday", tuesday_time);
		writeToLocalStorage("wednesday", wednesday_time);
		writeToLocalStorage("thursday", thursday_time);
		writeToLocalStorage("friday", friday_time);
    }

	function readFromLocalStorageAndSetInDayFields() {

        var mondayTime = readFromLocalStorage("monday");
		var tuesdayTime = readFromLocalStorage("tuesday");
		var wednesdayTime = readFromLocalStorage("wednesday");
		var thursdayTime = readFromLocalStorage("thursday");
		var fridayTime = readFromLocalStorage("friday");
		

        if (mondayTime != null ) { 
            $("#monday").val(mondayTime);
        }

		if (tuesdayTime !== null ) { 
			$("#tuesday").val(tuesdayTime);
		}
		
		if (wednesdayTime !== null ) { 
			$("#wednesday").val(wednesdayTime);
		}
		
		if (thursdayTime !== null ) { 
			$("#thursday").val(thursdayTime);
		}
		
		if (fridayTime !== null ) { 
			$("#friday").val(fridayTime);
		}		
        
    }

	if (readFromLocalStorage("weekWindowInitLoaded") && readFromLocalStorage("monday") != null){
		readFromLocalStorageAndSetInDayFields();

		var calculated = readBooleanFromLocalStorage("calculated");

		if(calculated){
			calculateWeekTime(true);
		}else if(!calculated){
			calculateWeekTime(false);
		} else {
			$("#monday").focus();
		}
    } 

});