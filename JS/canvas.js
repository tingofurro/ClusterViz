function canvasMgr(graph) {
	var mouseX, mouseY;
	var selectedNode = -1;
	canvasMgr = this;
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth-$('#options').width(); canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 0.8;

	this.drawCircle = function(x,y,rad,color) {
		ctx.beginPath();
		ctx.fillStyle = color; ctx.arc(x, y, rad, 0, 6.283)
		ctx.fill();
	};
	this.drawCurved = function(d, scaleX, scaleY, transX, transY) {
		ctx.beginPath();
		ctx.strokeStyle = (d.s.group==d.t.group)?edgeCol(d.s.group):'rgba(0,0,0,0.2)'; // 
		ctx.moveTo(scaleX*(transX+d.s.x), scaleY*(transY+d.s.y));
		ctx.quadraticCurveTo(scaleX*(transX+d.m.x), scaleY*(transY+d.m.y), scaleX*(transX+d.t.x), scaleY*(transY+d.t.y));
		ctx.stroke();
	};
	this.onMouse = function(x, y) {
		return (x-mouseX > -2*nodeRadius && x-mouseX < 2*nodeRadius && y-mouseY > -2*nodeRadius && y-mouseY < 2*nodeRadius);
	};
	$(document).mousemove(function( event ) {
		mouseX = event.pageX; mouseY = event.pageY;
		oldSelectedNode = selectedNode;
		selectedNode = -1; minDist = 100;
		nodes = graph.getNodes();
		for(rn in nodes) {
			d = nodes[rn];
			if(canvasMgr.onMouse(d.sx,d.sy)) {
				dist = (d.sx-mouseX)*(d.sx-mouseX) + (d.sy-mouseY)*(d.sy-mouseY);
				if(dist < minDist) selectedNode = d;
			}
		}
		if(selectedNode != -1) {
			$('body').css('cursor', 'pointer');
			canvasMgr.drawCircle(selectedNode.sx,selectedNode.sy,nodeRadius, darkCol(selectedNode.group));
		}
		if(selectedNode !=oldSelectedNode && oldSelectedNode != -1) {
			canvasMgr.drawCircle(oldSelectedNode.sx,oldSelectedNode.sy,nodeRadius, col(oldSelectedNode.group));
			$('body').css('cursor', 'default');
		}
	}).dblclick(function() {
		if(selectedNode != -1) window.open(selectedNode.url, '_blank').focus();
	});
}