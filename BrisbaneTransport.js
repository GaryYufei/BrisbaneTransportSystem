var BrisbaneTransport = ( function() {

    var Routes = {};

    var numberOfLines = 0;
    var finishedLines = 0;
    var ToDisplayLines = [];

    var svg,tip;
    var callbackfunction;

    var Pause = true;
    var total_people_num = 0;

    var route_shape_mapping = {
        "169":['169-407-0','169-407-1'],
        "120":['120-407-0','120-407-1']
    };

    var StudentMove = ( function() {

        function translateAlong(path,Person) {
            var l = path.getTotalLength();
            return function(d, i, a) {
                return function(t) {
                    if(t > 1){
                        t = 1;
                    }
                    Person.attr('T',t);
                    var p = path.getPointAtLength(t * l);
                    return "translate(" + p.x + "," + p.y + ")";
                };
            };
        }

        function translate(path,Person) {
            var l = path.getTotalLength();
            var T = new Number(Person.attr('T'));
            var filter = d3.scale.linear()
                    .domain([0,1])
                    .range([T,1]);
            return function(d, i, a) {
                return function(t) {
                    if(t > 1){
                        t = 1;
                    }
                    var TT = filter(t);
                    Person.attr('T',t);
                    var p = path.getPointAtLength(TT * l);
                    return "translate(" + p.x + "," + p.y + ")";
                };
            };
        }

        return {

            Move: function(start_stop,end_stop,p,time,line,id,scale){
                var start = start_stop;
                var end = end_stop;
                var current_index = start;
                var Person = svg.append("circle")
                            .attr('r',3.5)
                            .attr('fill','green');
                var path = p;
                var length = 0;
                for(var i = start ; i <= end; i++){
                    length += path[i].node().getTotalLength();
                }
                var speed = length / (time * scale / 60);
                length = null;
                total_people_num ++;

                function move() {
                    var p = path[current_index].node();
                    Person.attr('start',current_index);
                    if(Pause){
                        Person.attr('T',0.00001);
                        var l = p.getTotalLength();
                        var point = p.getPointAtLength(0.00001 * l);
                        Person.attr("transform","translate(" + point.x + "," + point.y + ")");
                        return;
                    }
                    if(current_index < end){
                        Person.transition()
                            .duration(p.getTotalLength() / speed * 1000)
                            .attrTween("transform", translateAlong(p,Person))
                            .each("end", move);
                    }else{
                        Person.transition().remove();
                    }
                    current_index ++;    
                    
                }

                Person.attr('end',end)
                      .attr('line',line)
                      .attr('rid',id)
                      .attr('speed',speed)
                      .attr('start',current_index);

                move(); 
            },

            Restart:function(Person,scale){
                var start = new Number(Person.attr('start'));
                var end = new Number(Person.attr('end'));
                var path = Routes[Person.attr('line')][Person.attr('rid')]['path'];
                var current_index = start;
                var speed = new Number(Person.attr('speed')) * scale;

                function Rmove() {
                    var p = path[current_index].node();
                    var T = new Number(Person.attr('T'));
                    if(T > 0.93){
                        T = 0.9;
                    }
                    Person.attr('start',current_index);
                    if(current_index < end){
                        Person.transition()
                            .duration(p.getTotalLength() / speed  * 1000 * (1-T))
                            .attrTween("transform", translate(p,Person))
                            .each("end", move);
                    }else{
                        Person.transition().remove();
                    }
                    current_index ++;       
                }

                function move() {
                    var p = path[current_index].node();
                    Person.attr('start',current_index);
                    if(current_index < end){
                        Person.transition()
                            .duration(p.getTotalLength() / speed * 1000)
                            .attrTween("transform", translateAlong(p,Person))
                            .each("end", move);
                    }else{
                        Person.transition().remove();
                    }
                    current_index ++;    
                    
                }

                Rmove();
            }
        }
    } () );



    function check_callback(){
        if(finishedLines == numberOfLines){
            callbackfunction();
        }
    }

    function BuildingSingleRoute(Rname,latFilter,lonFilter){

        var Route = {};

        function BuildingSingleRoad(id,latFilter,lonFilter){

            var stops_mapping = {};
            var path = [];

            d3.csv('data/' + id + '.csv',function(jsonData){
                var i = 0;
                var point_group = new Array();
                var point_count = 0;

                var lineFunction = d3.svg.line()
                                  .x(function(d) { return d[0]; })
                                  .y(function(d) { return d[1]; })
                                  .interpolate("linear");

                function DrawPath(d,index,array){
                    point_group[point_count] = [latFilter(d['lat']),lonFilter(d['lon'])];
                    point_count = point_count + 1;
                    if(d['type'] != '0'){
                        stops_mapping[d['type']] = i;

                        var Rect = svg.append("rect");

                            Rect
                            .attr('x',latFilter(d['lat']))
                            .attr('y',lonFilter(d['lon']))
                            .attr('height',1.3)
                            .attr('width',1.3)
                            .attr('fill','blue');

                        if(point_count != 0){
                            var lineGraph = svg.append("path")
                                        .attr("d", lineFunction(point_group))
                                        .attr("stroke", "blue")
                                        .attr("stroke-width", 1)
                                        .attr("fill", "none")
                                        .attr("class","Bus" + Rname)
                                        .on('mouseover',function(dl){
                                            d3.selectAll('.Bus' + Rname)
                                                .attr("stroke-width", 2)
                                                .attr("stroke", "red");
                                            tip.show(Rname);
                                        })
                                        .on("mouseout", function(){
                                            tip.hide();
                                            d3.selectAll('.Bus' + Rname)
                                                .attr("stroke-width", 1)
                                                .attr("stroke", "blue");
                                        });
                            path[i] = lineGraph;
                            i = i + 1;
                        }
                        point_group = new Array();
                        point_group[0] = [latFilter(d['lat']),lonFilter(d['lon'])];
                        point_count = 1;
                    }
                }
                jsonData.forEach(DrawPath);

                Routes[Rname][id] = { "stop":stops_mapping , "path":path };
                point_group = null;
                point_count = null;
                stops_mapping = null;
                path = null;

                finishedLines ++;
                check_callback();

            });

            
        }

        Routes[Rname] = Route;

        var data = route_shape_mapping[Rname];
        for(var i = 0 ; i < data.length;i++){
            BuildingSingleRoad(data[i],latFilter,lonFilter);
        }
        
    }

    return {

        get_total_people:function(){
            return total_people_num;
        },

        set_total_people:function(people){
            total_people_num = people;
        },

        set_callback_function: function(callback){
            callbackfunction = callback;
        },

        get_line: function (name,stopA,stopB) {
            var lines = Routes[name];
            for(var line in lines){
                var stops = lines[line]["stop"];
                var A = stops[stopA];
                var B = stops[stopB];
                if(A != null && B != null && A < B){
                    return {"status":true,"start":A,"end":B,"road":lines[line]["path"],"id":line};
                }
            }
            return {"status":false};
        },

        add_line: function ( new_line ) {
            ToDisplayLines[numberOfLines] = new_line;
            numberOfLines ++;
        },

        Load_Road: function(){

            var xMAX = -27.470208;
            var xMIN = -27.578719;
            var yMAX = 153.102015;
            var yMIN = 153.017533;

            var lat = d3.scale.linear()
                .domain([xMIN,xMAX])
                .range([0,620]);

            var lon = d3.scale.linear()
                .domain([yMIN,yMAX])
                .range([0,620]);

            for(var i in ToDisplayLines){
                BuildingSingleRoute(ToDisplayLines[i],lat,lon);
            }
            
        },

        Load_Map: function(id){

            svg = d3.select(id)
                .append('svg')
                .attr('width','100%')
                .attr('height','100%')
                .append('g');
            tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d){ 
                    return '<span>' + d + '</span>' 
                })
                .direction('n')
                .offset([-10, 0]);

            svg.call(tip);
        },

        single_student_move: function(data,scale){
            result = BrisbaneTransport.get_line(data['3'],data['0'],data['1']);

            if(result.status){
                StudentMove.Move(result.start,result.end,result.road,data['2'],data['3'],result.id,scale);
            }
        },

        restart: function(element,scale){
            StudentMove.Restart(element,scale);
        },

        Switch: function(){
            Pause = ! Pause;
        },

        clear: function(){
            d3.selectAll('circle').remove();
            Pause = true;
        }

    };
} () );