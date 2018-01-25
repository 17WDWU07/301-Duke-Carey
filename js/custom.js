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
					width: '100%',
					height: '100%',
					legend: 'none',
					hAxis: {
						title: 'Age'
					},
					vAxis: {
						title: 'Hours Listening to Music Daily'
					},
					backgroundColor: {
						fill: 'transparent'
					}
				},
				view: {
					columns: [3, 7]
				}
			});

			var ageRangeSlider = new google.visualization.ControlWrapper({
				controlType: 'NumberRangeFilter',
				containerId: 'controlOne',
				options: {
					filterColumnLabel: 'Age'
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
			dashboard.draw(data);

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
	
	var pop = 0, jazz = 0, alternative = 0, randb = 0, other = 0, hiphopandrap = 0, techno = 0, rock = 0;
	
	for (var i = 0; i < data.length; i++) {
		if(data[i].music == "pop"){ 
			pop++;
		} else if (data[i].music == "rock"){
			rock++;
		} else if (data[i].music == "jazz"){
			jazz++;
		} else if (data[i].music == "techno"){
			techno++;
		} else if (data[i].music == "alternative"){
			alternative++;
		} else if (data[i].music == "randb"){
			randb++;
		} else if (data[i].music == "hiphopandrap"){
			hiphopandrap++;
		} else if (data[i].music == "other"){
			other++;
		}
	}
	
	dataMusic.addRow(["Pop", pop]);
	dataMusic.addRow(["Rock", rock]);
	dataMusic.addRow(["Jazz", jazz]);
	dataMusic.addRow(["Techno", techno]);
	dataMusic.addRow(["Alternative", alternative]);
	dataMusic.addRow(["R&B", randb]);
	dataMusic.addRow(["Hip Hop/Rap", hiphopandrap]);
	dataMusic.addRow(["Other", other]);

	var options = {
		title: "Preferred Music Genre",
		backgroundColor: {
			fill: 'transparent'
		},
		pieHole: 0.4
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
		title: "Preferred Device",
		backgroundColor: {
			fill: 'transparent'
		}
	};

	var Bar = new google.visualization.BarChart(document.getElementById('chartTwo'));
	Bar.draw(dataDevice, options);	

}


