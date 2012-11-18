//FFD using three.js
//Author: Jans Margevics 2012
//TODO 


$(function() {
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize($('#context').width(), $('#context').height());
	$('#context').append(renderer.domElement);
	
    renderer.clear();
});