var mouseX, mouseY;
var charge = -15; linkStrength = 3, padding = 50;;
var smallRad = 3;
var bilinks = [], realNodes = [], midsToRemove = [];
var transX, transY, scaleX, scaleY;
var selectedNode = -1;
var canvas, ctx;
var noKeywords;

function smartGraph() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth; canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 0.8;

	var force = d3.layout.force();

	var nodes = force.nodes(), links = force.links();
	var midNodeId = 0;
	this.addNode = function (oldNode, isReal) {
		newNode = $.extend(true, {}, oldNode)
		newNode.tagged = true;
		nodes.push(newNode);
		if(isReal) realNodes.push(newNode);
		return newNode;
	};
	this.removeNodeObj = function (n) {
		var i = 0;
		while (i < bilinks.length) {
			if((bilinks[i].s == n) || (bilinks[i].t == n)) {
				this.removeLink(bilinks[i].s.id, bilinks[i].m.id);
				this.removeLink(bilinks[i].t.id, bilinks[i].m.id);
				midsToRemove.push(bilinks[i].m.id);
				bilinks.splice(i, 1);
			}
			else i++;
		}
		nodes.splice(this.findNodeIndex(n.id), 1);
		realNodes.splice(this.findRealNodeIndex(n.id), 1);
	};
	this.removeLink = function (real, mid) {
		for (var i = 0; i < links.length; i++) {
			if ((links[i].source.id == real && links[i].target.id == mid) || (links[i].source.id == mid && links[i].target.id == real)) {
				links.splice(i, 1);
				break;
			}
		}
	};
	this.tagNodes = function() {
		for(i in nodes) nodes[i].tagged = false;
	};
	this.removeExtraNodes = function() {
		for(var i = nodes.length-1; i >= 0; i --) {
			n = nodes[i];
			if(!n.isMid && !n.tagged) this.removeNodeObj(n);
		}
	};
	this.removeExtraMids = function() {
		i = 0; while(i < nodes.length) {
			if($.inArray(nodes[i].id, midsToRemove)!=-1) nodes.splice(i, 1);
			else i ++;
		}
	};
	this.changeColor = function(newNode, oldNode) {
		newN = this.findNode(newNode);
		oldN = this.findNode(oldNode);
		newN.group = oldN.group;
	};
	this.addLink = function (source, target, value) {
		mid = this.addNode({'id': 'mid'+(midNodeId), 'isMid': true}, false); midNodeId ++;
		t = this.findNode(target); s = this.findNode(source);
		links.push({"source": s, "target": mid, "other": t, "value": value, "s": source, "t": target});
		links.push({"source": mid, "target": t, "other": s, "value": value});
		bilinks.push({'s': s, 'm': mid, 't': t});
	};

	this.findNode = function (id) {
		for (var i in nodes) {if (nodes[i]["id"] === id) return nodes[i];};
		return nodes[this.findNodeIndex(id)];
	};
	this.findNodes = function (idList) {
		returnList = [];
		for (var i in nodes) {if (idList.indexOf(nodes[i]["id"])!=-1) {returnList.push(nodes[i])}};
		return returnList;
	};
	this.findNodeIndex = function (id) {
		for (var i in nodes) {if (nodes[i]["id"] === id) return i;};
		return -1;
	};
	this.findRealNodeIndex = function(id) {
		for (var i in realNodes) {if (realNodes[i].id === id) return i;};
		return -1;
	};
	this.getMinMax = function() {
		minX = 20000, minY = 20000, maxX = 0, maxY = 0;
		for (var i = 0; i < nodes.length; i++) {
			minX = Math.min(nodes[i].x, minX); minY = Math.min(nodes[i].y, minY);
			maxX = Math.max(nodes[i].x, maxX); maxY = Math.max(nodes[i].y, maxY);
		}
		return {'minX': minX, 'maxX': maxX, 'minY': minY, 'maxY': maxY};
	}

	this.update = function (whenEnd) {
		var graph = this;
		noKeywords = true;
		force.on("tick", function () {
			// if(force.alpha() < 0.02 && noKeywords) {noKeywords = false; if(whenEnd != null) {whenEnd();}}
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			mm = graph.getMinMax();
			transX = -mm.minX+padding; transY = -mm.minY+padding;
			scaleX = ((window.innerWidth)/(mm.maxX+transX+padding)); scaleY = (window.innerHeight/(mm.maxY+transY+padding));
			for(bl in bilinks) drawCurved(bilinks[bl]);
			for(rn in realNodes) {
				d = realNodes[rn];
				d.sx = scaleX*(d.x+transX); d.sy = scaleY*(d.y+transY);
				if(onMouse(d.sx, d.sy)) c = darkCol(d.group);
				else c = col(d.group);
				drawCircle(d.sx,d.sy, smallRad, c)
			}
		});
		force.charge(charge).linkStrength(linkStrength).linkDistance(function(d) {return d.value;}).size([window.innerWidth, window.innerHeight]).start();
	};
	$(document).mousemove(function( event ) {
		mouseX = event.pageX; mouseY = event.pageY;
		oldSelectedNode = selectedNode;
		selectedNode = -1; minDist = 100;
		for(rn in realNodes) {
			d = realNodes[rn];
			if(onMouse(d.sx,d.sy)) {
				dist = (d.sx-mouseX)*(d.sx-mouseX) + (d.sy-mouseY)*(d.sy-mouseY);
				if(dist < minDist) selectedNode = d;
			}
		}
		if(selectedNode != -1) {
			$('body').css('cursor', 'pointer');
			drawCircle(selectedNode.sx,selectedNode.sy,smallRad, darkCol(selectedNode.group));
			openNotif(selectedNode);
		}
		if(selectedNode !=oldSelectedNode && oldSelectedNode != -1) {
			drawCircle(oldSelectedNode.sx,oldSelectedNode.sy,smallRad, col(oldSelectedNode.group));
			$('body').css('cursor', 'default'); deleteNotif();
		}
	}).dblclick(function() {
		if(selectedNode != -1) window.open(selectedNode.url, '_blank').focus();
	});
	this.mergeData = function(graphData, whenEnd) {
		this.tagNodes();
		newNodes = [];
		midsToRemove = [];
		for(nod in graphData.nodes) {
			myNode = graphData.nodes[nod];
			if((n = this.findNode(myNode.id))) {n.tagged = true;}
			else {this.addNode(myNode, true); newNodes.push(myNode.id);}
		}
		this.removeExtraNodes(); this.removeExtraMids();

		for(i in graphData.edges) {
			myEdge = graphData.edges[i];
			var f1 = $.inArray(myEdge.source, newNodes)!=-1;
			var f2 = $.inArray(myEdge.target, newNodes)!=-1;
			if(f1 || f2) {
				this.addLink(myEdge.source, myEdge.target, myEdge.value);
				if(!(f1 && f2)) {
					if(f1) {newNode = myEdge.source; oldNode = myEdge.target;}
					else   {newNode = myEdge.target; oldNode = myEdge.source;}
					this.changeColor(newNode, oldNode);
				}
			}
		}
		this.update(whenEnd);
	}
}
function drawCircle(x,y,rad,color) {
	ctx.beginPath();
	ctx.fillStyle = color; ctx.arc(x, y, smallRad, 0, 6.283)
	ctx.fill();
}
function drawCurved(d) {
	ctx.beginPath();
	ctx.strokeStyle = (d.s.group==d.t.group)?edgeCol(d.s.group):'rgba(0,0,0,0.02)';
	ctx.moveTo(scaleX*(transX+d.s.x), scaleY*(transY+d.s.y));
	ctx.quadraticCurveTo(scaleX*(transX+d.m.x), scaleY*(transY+d.m.y), scaleX*(transX+d.t.x), scaleY*(transY+d.t.y));
	ctx.stroke();
}
function onMouse(x, y) {
	return (x-mouseX > -2*smallRad && x-mouseX < 2*smallRad && y-mouseY > -2*smallRad && y-mouseY < 2*smallRad);
}