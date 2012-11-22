//FFD using three.js
//Author: Jans Margevics 2012
//TODO 


$(function() {
	var plane;
	var camera, controls, scene, projector;
	var currentMesh;
	var clientWidth, clientHeight;
	var cpNum = 3;
	var controlPoints = [];
	var draggable = [];

	for (i = 0; i <= cpNum; ++i) {
		controlPoints[i] = new Array ();
		for (var j = 0; j <= cpNum; j++) {
			controlPoints[i][j] = new Array();
		}
	}
	var origin = new THREE.Vector3(0,0,0);
	var axis = new THREE.Vector3(0,0,0);
	var sAxis = new THREE.Vector3(0,0,0);
	var tAxis = new THREE.Vector3(0,0,0);
	var uAxis = new THREE.Vector3(0,0,0);

	var latticeMesh = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, fog: false } ) );
	//latticeMesh.matrixAutoUpdate = false;

	for(var i = 0; i <= cpNum; i++){
	    for(var j = 0; j <= cpNum; j++){
	      	for (var k = 0; k <= cpNum; k++){
				controlPoints[i][j][k] = new THREE.Vector3(0,0,0);
	      	}
	    }
	}

	var renderer = new THREE.WebGLRenderer({antialias: true});
	projector = new THREE.Projector();

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	
	var loader = new THREE.OBJLoader();

	clientWidth = $('#context').width();
	clientHeight = $('#context').height();

	var mouse = new THREE.Vector2(),
	offset = new THREE.Vector3(),
	INTERSECTED, SELECTED;

	init();
	animate();

	function setMesh() {

	}

	function init() {
		renderer.setSize(clientWidth, clientHeight );
		$('#context').append(renderer.domElement);
		
		camera = new THREE.PerspectiveCamera( 60, clientWidth / clientHeight, 1, 1000 );
		camera.position.z = 150;

		controls = new THREE.OrbitControls( camera, $('#context')[0] );
		controls.addEventListener( 'change', render );
		controls.enabled = false;

		scene = new THREE.Scene();

		plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
		plane.visible = false;
		scene.add( plane );

		var geometry = new THREE.CylinderGeometry( 0, 40, 130, 10, 10 );
		var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
		geometry.computeBoundingBox();
		// loader.addEventListener( 'load', function ( event ) {

		// 	var object = event.content;
		// 	for ( var i = 0, l = object.children.length; i < l; i ++ )
		// 		object.children[ i ].material = material;

		// 	object.position.y = 0;
		// 	object.position.z = 0;
		// 	currentMesh = object.children[0];
		// 	currentMesh.computeBoundingBox();
		// 	console.log(currentMesh);
		// 	scene.add( currentMesh );
		// 	initCPoints();
		// });
		//loader.load( 'obj/teapot3.obj' );
		currentMesh = new THREE.Mesh( geometry, material );
		currentMesh.position.y = 0;
		currentMesh.position.z = 0;
		scene.add( currentMesh  );
		initCPoints();
		renderLattice();

		renderLatticeWireframe();

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( -1, -1, -1 );
		scene.add( light );

		light = new THREE.AmbientLight( 0x222222 );
		scene.add( light );
	}

    function animate() {
		requestAnimationFrame( animate );
		controls.update();

	}

	function render() {
		renderer.render( scene, camera );
	}

	function factorial(n) {
		var fact = 1;
		for (var i = n; i > 0; i--)
			fact *= i;
		return fact;
	}

	function bernstein(u,v,stuPt) {
		var binomial, bern;

		binomial = factorial(v) / ( factorial(v - u) * factorial(u) );
		bern = binomial * Math.pow(stuPt, u) * pow((1 - stuPt), (v-u));
		return bern;
	}

	function renderLatticeWireframe() {
		
		var vertices = latticeMesh.geometry.vertices;

		vertices[ 0 ].x = currentMesh.geometry.boundingBox.max.x;
		vertices[ 0 ].y = currentMesh.geometry.boundingBox.max.y;
		vertices[ 0 ].z = currentMesh.geometry.boundingBox.max.z;

		vertices[ 1 ].x = currentMesh.geometry.boundingBox.max.x;
		vertices[ 1 ].y = currentMesh.geometry.boundingBox.max.y;
		vertices[ 1 ].z = currentMesh.geometry.boundingBox.min.z;

		vertices[ 2 ].x = currentMesh.geometry.boundingBox.max.x;
		vertices[ 2 ].y = currentMesh.geometry.boundingBox.min.y;
		vertices[ 2 ].z = currentMesh.geometry.boundingBox.max.z;

		vertices[ 3 ].x = currentMesh.geometry.boundingBox.max.x;
		vertices[ 3 ].y = currentMesh.geometry.boundingBox.min.y;
		vertices[ 3 ].z = currentMesh.geometry.boundingBox.min.z;

		vertices[ 4 ].x = currentMesh.geometry.boundingBox.min.x;
		vertices[ 4 ].y = currentMesh.geometry.boundingBox.max.y;
		vertices[ 4 ].z = currentMesh.geometry.boundingBox.min.z;

		vertices[ 5 ].x = currentMesh.geometry.boundingBox.min.x;
		vertices[ 5 ].y = currentMesh.geometry.boundingBox.max.y;
		vertices[ 5 ].z = currentMesh.geometry.boundingBox.max.z;

		vertices[ 6 ].x = currentMesh.geometry.boundingBox.min.x;
		vertices[ 6 ].y = currentMesh.geometry.boundingBox.min.y;
		vertices[ 6 ].z = currentMesh.geometry.boundingBox.min.z;

		vertices[ 7 ].x = currentMesh.geometry.boundingBox.min.x;
		vertices[ 7 ].y = currentMesh.geometry.boundingBox.min.y;
		vertices[ 7 ].z = currentMesh.geometry.boundingBox.max.z;

		latticeMesh.geometry.verticesNeedUpdate = true;
		scene.add(latticeMesh);
	}

	function initCPoints() {
		origin = currentMesh.geometry.boundingBox.min;
		axis.sub(currentMesh.geometry.boundingBox.max, currentMesh.geometry.boundingBox.min);

		sAxis.setX(axis.x);
		tAxis.setY(axis.y);
		uAxis.setZ(axis.z);		

		var cubeG = new THREE.CubeGeometry(1,1,1); 
		var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00}); 

		for(var i = 0; i <= cpNum; i++){
	    	for(var j = 0; j <= cpNum; j++){
	      		for (var k = 0; k <= cpNum; k++){
					controlPoints[i][j][k].setX( origin.x + ((i/cpNum) * axis.x) );
					controlPoints[i][j][k].setY( origin.y + ((j/cpNum) * axis.y) );
					controlPoints[i][j][k].setZ( origin.z + ((k/cpNum) * axis.z) );
					
					var cube = new THREE.Mesh(cubeG, material2);
					cube.position.x = controlPoints[i][j][k].x;
					cube.position.y = controlPoints[i][j][k].y;
					cube.position.z = controlPoints[i][j][k].z;
					cube.updateMatrix();
					
					cube.matrixAutoUpdate = false;
					draggable.push(cube);
					scene.add(cube);
					//console.log(controlPoints[i][j][k].x,controlPoints[i][j][k].y,controlPoints[i][j][k].z);
	      		}
	    	}
	  	}

	}

	function deformMesh() {

	}

	function convertToSTU() {

	}

	function renderLattice() {

	}

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		mouse.x = ( (event.clientX - $('#context')[0].offsetLeft) / $('#context')[0].offsetWidth  ) * 2 - 1;
		mouse.y = -( (event.clientY - $('#context')[0].offsetTop) / $('#context')[0].offsetHeight  ) * 2 + 1;
		
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );


		if ( SELECTED ) {
			var intersects = ray.intersectObject( plane );
			//SELECTED.position.copy( intersects[ 0 ].point.subSelf( offset ) );
			return;
		}
		var intersects = ray.intersectObjects( draggable );
		if ( intersects.length > 0 ) {

			if ( INTERSECTED != intersects[ 0 ].object ) {

				if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				plane.position.copy( INTERSECTED.position );
				plane.lookAt( camera.position );

			}
			$('#context').css('cursor','pointer');

		} else {

			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			INTERSECTED = null;
			$('#context').css('cursor','auto');
		}
	}

	function onDocumentMouseDown( event ) {

		event.preventDefault();

		mouse.x = ( (event.clientX - $('#context')[0].offsetLeft) / $('#context')[0].offsetWidth  ) * 2 - 1;
		mouse.y = -( (event.clientX - $('#context')[0].offsetTop) / $('#context')[0].offsetHeight  ) * 2 + 1;
		
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		console.log(vector);
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );


		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
		var intersects = ray.intersectObjects( draggable );
		if ( intersects.length > 0 ) {
			controls.userRotate = false;
			SELECTED = intersects[ 0 ].object;
			var intersects = ray.intersectObject( plane );
			offset.copy( intersects[ 0 ].point ).subSelf( plane.position );
			$('#context').css('cursor','move');
		}
	}

	function onDocumentMouseUp( event ) {
		event.preventDefault();
		controls.userRotate = true;
		if ( INTERSECTED ) {
			plane.position.copy( INTERSECTED.position );
			SELECTED = null;
		}
		$('#context').css('cursor','auto');
	}
});