var timeController = ( function() {

    var date;
    var timeID;
    var studentData;
    var studentIndex;
    var m;
    var timeScale;
    var ProgressBar;
    var CurrentPeople,TotalPeople;
    var SelectedDate; 

    function time_increase(){
		m.add('minutes', 1);
		date.text(m.format('MMMM Do YYYY, h:mm a'));
        var size = d3.selectAll('circle').size();
        CurrentPeople.text(size);
        TotalPeople.text(BrisbaneTransport.get_total_people());
		if(studentIndex < studentData.length){
            var time = moment(SelectedDate + " " + studentData[studentIndex]['4']);
    		while(time.isBefore(m)){
    			var duration = m.diff(time);
    			timeRun(studentData[studentIndex],duration / (60 / timeScale) );
                ProgressBar.attr('style',"width:" + (studentIndex / studentData.length * 100) + "%;");
    			studentIndex ++;
                if(studentIndex < studentData.length){
        			time = moment(SelectedDate + " " + studentData[studentIndex]['4']);
                }else{
                    break;
                }
    		}
        }
        if(moment(SelectedDate + " 14:00:00").isBefore(m) && size == 0){
            clearInterval(timeID);
            date.html("<h4>Finished...Waiting</h4>");
        }
	}

	function timeRun(d,duration){
		function run(){
			BrisbaneTransport.single_student_move(d,timeScale);
		}

		setTimeout(run,duration);
	}

    return {

        set_count_bar_id:function(tid,cid){
            CurrentPeople = d3.select(cid);
            TotalPeople = d3.select(tid);
        },
        set_progress_bar_id: function(id){
            ProgressBar = d3.select(id);
        },

        set_date: function (id) {
            date = d3.select(id);
        },

        set_time_scale:function(scale){
            timeScale = scale;
            clearInterval(timeID);
            timeID = setInterval(time_increase,1000 * timeScale);
        },

        get_time_scale:function(){
            return timeScale;
        },

        load_student_data:function(){
            d3.csv('data/student.csv',function(data){
                studentData = data;
                timeController.start();
            });
        },

        pause:function(){
            BrisbaneTransport.Switch();
        	clearInterval(timeID);
        },
        start: function(){
            timeScale = 1;
            SelectedDate = "2013-03-06";
            m = moment(SelectedDate + " 07:05:00");
            studentIndex = 0;
            BrisbaneTransport.Switch();
        	timeID = setInterval(time_increase,1000 * timeScale);
        }
    };
} () );