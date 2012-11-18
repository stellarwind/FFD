//FFD using three.js
//UI part
//Author: Jans Margevics 2012
//TODO 


$(function() {
	var icons = {
		header: "ui-icon-circle-arrow-e",
		activeHeader: "ui-icon-circle-arrow-s"
    };

	$("#accordion").accordion({
		heightStyle: "content",
		icons: icons,
		collapsible: true
	});

	$(".button").button();

	$( "#cpSlider" ).slider({
            value:3,
            min: 2,
            max: 9,
            step: 1,
            slide: function( event, ui ) {
                $("#amount").val( ui.value );
            }
        });
    $("#amount").val($("#cpSlider").slider("value"));
});