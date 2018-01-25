google.charts.load('current', {'packages':['corechart', 'controls']});
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard(){

	$.ajax({
		url: 'js/groupData.json',
		dataType: 'json',
		success: function(dataFromJSON){

			var data = new google.visualization.DataTable();

			data.addColumn('number', 'People');
			data.addColumn('string', 'Name');
			data.addColumn('string', 'Gender');
			data.addColumn('number', 'Age');
			data.addColumn('string', 'Music');
			data.addColumn('string', 'Device');
			data.addColumn('string', 'Concert');
			data.addColumn('number', 'Time');

			for (var i = 0; i < dataFromJSON.length; i++) {
				data.addRow([
					dataFromJSON[i].id,
					dataFromJSON[i].first_name + " " + dataFromJSON[i].last_name,
					dataFromJSON[i].gender,
					dataFromJSON[i].age,
					dataFromJSON[i].music, 
					dataFromJSON[i].device, 
					dataFromJSON[i].concert,
					dataFromJSON[i].time
				]);
			};

			var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

			var scatterChart = new google.visualization.ChartWrapper({
				chartType: 'ScatterChart',
				containerId: 'chartOne',
				options: {
					title: 'Listening to Music Daily',
					titleTextStyle: {
		               color: 'white',
		               fontName: 'Bungee Hairline',
		               fontSize: 20
			        },
					colors: ['#00405D'],
					width: '100%',
					height: '100%',
					legend: 'none',
					hAxis: {
						title: 'Age',
						ticks: [18, 22, 26, 30, 34],
						textStyle: {
							color: 'white'
						},
						titleTextStyle: {
               				color: 'white',
               				fontName: 'Bungee Hairline',
               				fontSize: 15
             			}
					},
					vAxis: {
						title: 'Hours',
						ticks: [0, 3, 6, 9, 12, 15],
						textStyle: {
								color: 'white'
						},
						titleTextStyle: {
	               			color: 'white',
	               			fontName: 'Bungee Hairline',
	               			fontSize: 15
	            		}
					},
					backgroundColor: {
						fill: 'transparent'
					}
				},
				titleTextStyle: {
               	color: 'white',
               	fontName: 'Bungee Hairline'
           		},
				view: {
					columns: [3, 7]
				},
				chartArea: {
        			backgroundColor: {
        				stroke: "white"
        			}
        		}
			});

			var ageRangeSlider = new google.visualization.ControlWrapper({
				controlType: 'NumberRangeFilter',
				containerId: 'controlOne',
				options: {
					filterColumnLabel: 'Age',
				} 
			});

			var genderSelector = new google.visualization.ControlWrapper({
				controlType: 'CategoryFilter',
				containerId: 'controlTwo',
				options: {
					filterColumnLabel: 'Gender',
					ui: {
						allowMultiple: false,
						allowTyping: false,
						labelStacking: 'verticle'
					}
				}
			});

			dashboard.bind([ageRangeSlider, genderSelector], [scatterChart]);

			google.visualization.events.addListener(scatterChart, 'select', clickEvent);

			dashboard.draw(data);

			function clickEvent(){
				console.log('a');
				var tableRow = scatterChart.getSelection()[0].row;
				scatterChart.setSelection();
				var infoData = dataFromJSON[tableRow];

				if(infoData){
					document.getElementById('avatar').src = infoData.avatar;
					document.getElementById('fullName').innerText = infoData.first_name + ' ' + infoData.last_name;
					document.getElementById('age').innerText = infoData.age;
					document.getElementById('gender').innerText = infoData.gender;
					document.getElementById('genre').innerText = infoData.music;
				}
			};

			drawBar(dataFromJSON);

			google.visualization.events.addListener(ageRangeSlider, 'statechange', function(){
				
				var range = ageRangeSlider.getState();

				var view = new google.visualization.DataView(data);

				view.setRows(data.getFilteredRows([
					{
						column: 3,
						minValue: range.lowValue,
						maxValue: range.highValue
					}
				]));

				var filteredRows = view.ol;
				var newData = [];

				for (i = 0; i < filteredRows.length; i++){
					newData.push(dataFromJSON[filteredRows[i]]);
				};

				drawBar(newData);
			});
			
			drawPie(dataFromJSON);

			google.visualization.events.addListener(ageRangeSlider, 'statechange', function(){
				
				var range = ageRangeSlider.getState();

				var view = new google.visualization.DataView(data);

				view.setRows(data.getFilteredRows([
					{
						column: 3,
						minValue: range.lowValue,
						maxValue: range.highValue
					}
				]));

				var filteredRows = view.ol;
				var newData = [];

				for (i = 0; i < filteredRows.length; i++){
					newData.push(dataFromJSON[filteredRows[i]]);
				};

				drawPie(newData);
			});

			drawDonut(dataFromJSON);

			google.visualization.events.addListener(ageRangeSlider, 'statechange', function(){
				
				var range = ageRangeSlider.getState();

				var view = new google.visualization.DataView(data);

				view.setRows(data.getFilteredRows([
					{
						column: 3,
						minValue: range.lowValue,
						maxValue: range.highValue
					}
				]));

				var filteredRows = view.ol;
				var newData = [];

				for (i = 0; i < filteredRows.length; i++){
					newData.push(dataFromJSON[filteredRows[i]]);
				};

				drawDonut(newData);
			});
		},
		error: function(errorFromJson){
			console.log(errorFromJson);
			alert("error");
		}
	});
};

//this is the data for pie graph
function drawPie(data){
	
	var dataConcert = new google.visualization.DataTable();
	
	dataConcert.addColumn('string', 'Concert');
	dataConcert.addColumn('number', 'Count');
	
	var yes = 0, no = 0;
	
	for (var i = 0; i < data.length; i++) {
		if(data[i].concert == "no"){
			no++;
		} else if (data[i].concert == "yes"){
			yes++;
		}
	}
	
	dataConcert.addRow(["No", no]);
	dataConcert.addRow(["Yes", yes]);

	var options = {
		title: "Concert Goers",
		backgroundColor: {
			fill: 'transparent'
		},
		titleTextStyle: {
               color: 'white',
               fontName: 'Bungee Hairline',
               fontSize: 20
        },
        pieSliceTextStyle: {
            color: 'white'
        },
        slices: {  
        	0: {color: '#2EB8F6'},
            1: {color: '#06638C'}
        },
        legend: {
        	textStyle: {
        		color: 'white',
        		fontName: 'Bungee Hairline',
        		fontSize: 15
        	}
        }
	};

	var Pie = new google.visualization.PieChart(document.getElementById('chartThree'));
	Pie.draw(dataConcert, options);
}

//this is data for donut graph
function drawDonut(data){
	
	var dataMusic = new google.visualization.DataTable();

	dataMusic.addColumn('string', 'Music');
	dataMusic.addColumn('number', 'Count');
	
	var Pop = 0, Jazz = 0, Alternative = 0, RnB = 0, Other = 0, Rap = 0, Techno = 0, Rock = 0;
	
	for (var i = 0; i < data.length; i++) {
		if(data[i].music == "Pop"){ 
			Pop++;
		} else if (data[i].music == "Rock"){
			Rock++;
		} else if (data[i].music == "Jazz"){
			Jazz++;
		} else if (data[i].music == "Techno"){
			Techno++;
		} else if (data[i].music == "Alternative"){
			Alternative++;
		} else if (data[i].music == "RnB"){
			RnB++;
		} else if (data[i].music == "Rap"){
			Rap++;
		} else if (data[i].music == "Other"){
			Other++;
		}
	}
	
	dataMusic.addRow(["Pop", Pop]);
	dataMusic.addRow(["Rock", Rock]);
	dataMusic.addRow(["Jazz", Jazz]);
	dataMusic.addRow(["Techno", Techno]);
	dataMusic.addRow(["Alternative", Alternative]);
	dataMusic.addRow(["R&B", RnB]);
	dataMusic.addRow(["Hip Hop/Rap", Rap]);
	dataMusic.addRow(["Other", Other]);

	var options = {
		title: "Preferred Music Genre",
		backgroundColor: {
			fill: 'transparent'
		},
		titleTextStyle: {
               color: 'white',
               fontName: 'Bungee Hairline',
               fontSize: 20
        },
		pieHole: 0.4,
		legend: {
        	textStyle: {
        		color: 'white',
        		fontName: 'Bungee Hairline',
        		fontSize: 12
        	}
        },
        slices: {  
        	0: {color: '#56CBFF'},
            1: {color: '#7DD7FF'},
            2: {color: '#4AADD9'},
            3: {color: '#2286B2'},
            4: {color: '#06638C'},
            5: {color: '#A3E3FF'},
            6: {color: '#00405D'},
            7: {color: '#2EB8F6'}
        }
	};

	var PieHole = new google.visualization.PieChart(document.getElementById('chartFour'));
	PieHole.draw(dataMusic, options);

}

function drawBar(data){
	
	var dataDevice = new google.visualization.DataTable();
	
	dataDevice.addColumn('string', 'Device');
	dataDevice.addColumn('number', 'Users');
			
	var mobile_phone = 0, other = 0, mp3 = 0;
	for (var i = 0; i < data.length; i++) {
		if(data[i].device == "mobile_phone"){
			mobile_phone++;
		} else if (data[i].device == "mp3"){
			mp3++;
		} else if(data[i].device == "other"){
			other++;
		}
	}
	
	dataDevice.addRow(["Mobile", mobile_phone]);
	dataDevice.addRow(["MP3", mp3]);
	dataDevice.addRow(["Other", other]);

	var options = {
		title: 'Preferred Device',
		colors: ['#06638C'],
		backgroundColor: {
			fill: 'transparent'
		},
		titleTextStyle: {
               color: 'white',
               fontName: 'Bungee Hairline',
               fontSize: 20
        },
        chartArea: {
        	backgroundColor: {
        		stroke: 'white'
        	}
        },
        legend: 'none',
	    hAxis: {
	    	title: 'Number Of User',
	    	ticks: [0, 2, 4, 6, 8, 10],
			textStyle: {
				color: 'white'
			},
			titleTextStyle: {
       			color: 'white',
       			fontName: 'Bungee Hairline',
       			fontSize: 15
    		}
	    },
	    vAxis: {
	     	title: 'Device',
        	textStyle: {
        		color: 'white'
        	},
        	titleTextStyle: {
       			color: 'white',
       			fontName: 'Bungee Hairline',
       			fontSize: 15
    		}
      	}	  
	};

	var Bar = new google.visualization.BarChart(document.getElementById('chartTwo'));
	Bar.draw(dataDevice, options);	

}


