$(document).ready(function () {
	
	function getWeekWorkTime(){	
	
	var monday_time = $("#monday").val().split(":");
	var monday_hours = parseInt(monday_time[0], 10);
	var monday_mins = parseInt(monday_time[1], 10);
   
    var tuesday_time = $("#tuesday").val().split(":");
    var tuesday_hours = parseInt(tuesday_time[0], 10);
    var tuesday_mins = parseInt(tuesday_time[1], 10);
   
    var wednesday_time = $("#wednesday").val().split(":");
    var wednesday_hours = parseInt(wednesday_time[0], 10);
    var wednesday_mins = parseInt(wednesday_time[1], 10);
   
    var thursday_time = $("#thursday").val().split(":");
    var thursday_hours = parseInt(thursday_time[0], 10);
    var thursday_mins = parseInt(thursday_time[1], 10);
   
    var friday_time = $("#friday").val().split(":");
    var friday_hours = parseInt(friday_time[0], 10);
    var friday_mins = parseInt(friday_time[1], 10);

	var week_hours = monday_hours + tuesday_hours + wednesday_hours + thursday_hours + friday_hours;
	var week_mins = monday_mins + tuesday_mins + wednesday_mins + thursday_mins + friday_mins;

	while (week_mins >= 60) {
	week_mins = week_mins - 60;
	week_hours++;
	}

	return week_time = [week_hours, week_mins];
	}
	
	function setWeekTime(){
		
		var week_time = getWeekWorkTime();
		
		var weekHours = week_time[0];
		var weekMins = week_time[1];
		
		var weekTimeAusgabe = weekHours + "." + weekMins + " h";

		alert(weekTimeAusgabe);
	}
	
	$("#weekTimeCalc").click(function () {
		setWeekTime();
	})

});