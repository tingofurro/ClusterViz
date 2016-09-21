var graph;

function start() {
	graph = new smartGraph();
	changeModel();
}
function reloadGraph() { // k=2
	$('#loading').fadeIn(200);
	start = '2016-01-22%2000:00:00';
	end = '2016-01-22%2023:00:00';
	model = $('#model').val();
	url = "http://localhost:4005/graph_"+model+"/start/"+start+"/end/"+end;
	if(model == 'kw') {
		url += '?k='+$('#k').val();
	}
	else if(model == 'tfidf') {
		url += '?eps='+$('#eps').val();

	}
	$.getJSON(url, function(data) {
		graph.mergeData(data);
	});
}
function changeModel() {
	model = $('#model').val();
	$('.hyperparameters').hide();
	$('#hyperparameters_'+model).show();
	reloadGraph();
}
function changeHyper() {
	$('#kValue').html($('#k').val());
	$('#epsValue').html($('#eps').val());
	reloadGraph();
}
function hideGraphLoading() {
	$('#loading').fadeOut(300);
}