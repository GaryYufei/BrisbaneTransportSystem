;(function() {

	var end = d3.select("#end");
	var start = d3.select("#start");
	var speedUP = d3.select('#SpeedUp');
	var slowDown = d3.select('#SlowDown');
	var currentSpeed = d3.select('#speedContainer');

	start.attr('class','btn btn-primary disabled');

	end.on('click',function(d){
		timeController.pause();
		d3.selectAll('circle')
		  .transition()
	      .duration( 0 );
	    start.attr('class','btn btn-primary');
	    end.attr('class','btn btn-primary disabled');
	    speedUP.attr('class','btn btn-primary disabled');
		slowDown.attr('class','btn btn-primary disabled');
	});

	start.on('click',function(d){
		d3.selectAll('circle').each(function(d,i){
			BrisbaneTransport.restart(d3.select(this),1);
		});
		timeController.start();
		start.attr('class','btn btn-primary disabled');
		end.attr('class','btn btn-primary');
		speedUP.attr('class','btn btn-primary');
		slowDown.attr('class','btn btn-primary');
	});

	speedUP.on('click',function(el){
		var scale = timeController.get_time_scale();
		timeController.set_time_scale(scale / 2);
		d3.selectAll('circle')
			.transition()
        	.duration( 0 );
		d3.selectAll('circle').each(function(d,i){
			BrisbaneTransport.restart(d3.select(this),2);
		});
		currentSpeed.text(timeController.get_time_scale());
	});

	slowDown.on('click',function(el){
		var scale = timeController.get_time_scale();
		timeController.set_time_scale(scale * 2);
		d3.selectAll('circle')
			.transition()
        	.duration( 0 );
		d3.selectAll('circle').each(function(d,i){
			BrisbaneTransport.restart(d3.select(this),0.5);
		});
		currentSpeed.text(timeController.get_time_scale());
	});

	var Bus = ['120','169'];

	
	for(var i in Bus){
		BrisbaneTransport.add_line(Bus[i]);
	}

	BrisbaneTransport.set_callback_function(function(){
		
	});

	BrisbaneTransport.Load_Map("#map");
	BrisbaneTransport.Load_Road();
	timeController.set_date("#date");

	timeController.set_progress_bar_id("#Progress_Bar");
	timeController.set_count_bar_id("#TotalPeople","#CurPeople");

	timeController.load_student_data();
	
})();

