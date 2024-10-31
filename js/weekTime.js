$(document).ready(function () {

    function getTimeForDay(day){
        const [hours, mins] = $(day).val().toString().split(":").map(time => parseInt(time, 10));
        return { hours, mins };
    }

    function getTimeForWeek() {
        return {
            monday: getTimeForDay("#monday"),
            tuesday: getTimeForDay("#tuesday"),
            wednesday: getTimeForDay("#wednesday"),
            thursday: getTimeForDay("#thursday"),
            friday: getTimeForDay("#friday"),
        };
    }

    function getWeekWorkTime() {
        const weekTime = getTimeForWeek();

        let totalHours = 0;
        let totalMins = 0;

        // Iterate through the week
        for (const day in weekTime) {
            if (weekTime.hasOwnProperty(day)) {
                totalHours += weekTime[day].hours;
                totalMins += weekTime[day].mins;
            }
        }

        totalHours += Math.floor(totalMins / 60);
        totalMins = totalMins % 60;

        return [totalHours, totalMins];
    }

    function getWorkedDaysForWeek() {

        const [daysWorkHours, daysWorkMins] = getWeekWorkTime();
        let countedDays = 5;

        for (let i = 0; i<5; i++){

            if(daysWorkHours[i] === 0 && daysWorkMins[i] === 0){
                countedDays --;
            }

        }

        return countedDays;
    }
	
    function calculateWeekOverTime(gleitagGenommen) {
		let countedDays = getWorkedDaysForWeek();
		const weekWorkTime = getWeekWorkTime();
		const gleittageThisWeek= parseInt(getCookie("gleittage"))

		if (gleittageThisWeek && gleitagGenommen){
			countedDays = gleittageThisWeek + countedDays;
			deleteCookie("gleittage");
		}else if (gleitagGenommen) {
			const gleittageThisWeek = parseInt(prompt("Anzahl Gleitage diese Woche:", ""), 10);
			countedDays = gleittageThisWeek + countedDays;
			setCookie("gleittage", gleittageThisWeek);
		}

		const shouldHours = countedDays * 7;
		const shouldMins = countedDays * 6;
		const istHours = weekWorkTime[0];
		const istMins = weekWorkTime[1];
	
		let overTimeHours = istHours - shouldHours;
		let overTimeMins = istMins - shouldMins;

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
    
		const week_time = getWeekWorkTime();
		
		let weekHours = week_time[0];
		let weekMins = week_time[1];

		if (weekHours <= 9){
			weekHours = "0" + weekHours;
	  	}

	  	if (weekMins <= 9){
		    weekMins = "0" + weekMins;
		}
		
		const weekTimeAusgabe = weekHours + "." + weekMins + " h";
		$("#weekworktime").html(weekTimeAusgabe);
	}	

	function setWeekOverTime(gleittag) {

		const weekTime = calculateWeekOverTime(gleittag);
		
		let weekHours = weekTime[0];
		let weekMins = weekTime[1];
		let weekOverTimeAusgabe;
		
		if (weekHours < 0 || weekMins < 0){
			
			weekHours = Math.abs(weekHours);
			weekMins = Math.abs(weekMins);
	
			weekOverTimeAusgabe = "-" + weekHours + "." + weekMins + " h";
			
		} else if (weekHours > 0 || weekMins > 0){
			weekOverTimeAusgabe = "+" + weekHours + "." + weekMins + " h";

		} else {
			weekOverTimeAusgabe = "0.0 h";
		}
	
		$("#weekovertime").html(weekOverTimeAusgabe);
	}

	function calculateWeekTime(gleittag){
		setWeekTime();
		setWeekOverTime(gleittag);
		uploadDaysTime();
		setCookie("calculated", gleittag);
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

		const monday_time = $("#monday").val();
		const tuesday_time = $("#tuesday").val();
		const wednesday_time = $("#wednesday").val();
		const thursday_time = $("#thursday").val();
		const friday_time = $("#friday").val();
		
		setCookie("monday", monday_time);
		setCookie("tuesday", tuesday_time);
		setCookie("wednesday", wednesday_time);
		setCookie("thursday", thursday_time);
		setCookie("friday", friday_time);
    }

	function getCookieAndSetInDayFields() {

        const mondayTime = getCookie("monday");
		const tuesdayTime = getCookie("tuesday");
		const wednesdayTime = getCookie("wednesday");
		const thursdayTime = getCookie("thursday");
		const fridayTime = getCookie("friday");
		

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

	if (getCookie("weekWindowInitLoaded") && getCookie("monday") != null){
		getCookieAndSetInDayFields();

		let calculated = getBooleanCookie("calculated");

		if (calculated){
			calculateWeekTime(true);

		} else if(!calculated){
			calculateWeekTime(false);

		} else {
			$("#monday").focus();
		}
    } 

});