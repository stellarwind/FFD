//FFD using three.js
//Author: Jans Margevics 2012
//TODO 


$(function() {
	var icons = {
		header: "ui-icon-circle-arrow-e",
		activeHeader: "ui-icon-circle-arrow-s"
    };

	$("#accordion").accordion({
		heightStyle: "content",
		icons: icons
	});

	$(".button").button();
});