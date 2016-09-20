var graph;

function start() {
	graph = new smartGraph();
	reloadGraph();
}
function reloadGraph() {
	$.getJSON("graph.json", function(data) {
		graph.mergeData(data, null);
	});
}