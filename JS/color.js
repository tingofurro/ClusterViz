// var cubes = [[0.8398, 0.8398, 0.7791],[0.6133, 0.8398, 0.1602],[0.8398, 0.3867, 0.3867],[0.1602, 0.8398, 0.6133],[0.6133, 0.1602, 0.8398],[0.1602, 0.6133, 0.8398],[0.1602, 0.1602, 0.3867],[0.8398, 0.8398, 0.4587],[0.8398, 0.6133, 0.1602],[0.1602, 0.1602, 0.8398],[0.6133, 0.3867, 0.6133],[0.3867, 0.6133, 0.6133],[0.3867, 0.6133, 0.1602],[0.8398, 0.1602, 0.1602],[0.6133, 0.3867, 0.1602],[0.1602, 0.8398, 0.1602],[0.3868, 0.8398, 0.8398],[0.6133, 0.1602, 0.3867],[0.3867, 0.3867, 0.3867],[0.6182, 0.6182, 0.3917],[0.3867, 0.3867, 0.8398],[0.8398, 0.3868, 0.8398],[0.3867, 0.1602, 0.1602],[0.6168, 0.6168, 0.8362],[0.1602, 0.6133, 0.3867],[0.8398, 0.1602, 0.6133],[0.3867, 0.1602, 0.6133],[0.1602, 0.3867, 0.6133],[0.3867, 0.8398, 0.3867],[0.1602, 0.3867, 0.1602]];
var colors = [];
var lastColorMapIndex = 0;
var colorMap = {}, edgeColorMap = {}, darkColorMap = {}, textColMap = {};
len = 16;
for(var i = 0; i < len; i ++) {
	colors[i] = tinycolor.fromRatio({ h: i/len, s: (0.40+0.15*((i+2)%3)), l: (0.4+0.1*(i%3)) }).toHexString();
}
function col(key) {
	if(!colorMap[key]) {
		colorMap[key] = colors[lastColorMapIndex];
		lastColorMapIndex = (lastColorMapIndex+1)%colors.length;
	}
	return colorMap[key];
}
function edgeCol(key) {
	if(!edgeColorMap[key]) {
		edgeColorMap[key] = tinycolor(col(key)).desaturate(20).setAlpha(0.2);
	}
	return edgeColorMap[key];
}
function darkCol(key) {
	if(!darkColorMap[key]) {
		darkColorMap[key] = tinycolor(col(key)).darken(20);
	}
	return darkColorMap[key];	
}
function textCol(key) {
	if(!textColMap[key]) {
		textColMap[key] = tinycolor(col(modeGroup)).desaturate(10).darken(10);
	}
	return textColMap[key];
}