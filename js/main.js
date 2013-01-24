//FFD using three.js
//Author: Jans Margevics 2012
//TODO 
$(function() {
	var plane;
	var camera, controls, scene, projector;
	var currentMesh;
	var clientWidth, clientHeight;
	var cpNum = 2;
	var controlPoints = [];
	var selectedCp;
	var draggable = [];
	var verts0;

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

	var lattice;

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

		controls = new THREE.TrackballControls( camera, $('#context')[0] );
		
		scene = new THREE.Scene();

		plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
		plane.visible = true;
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
		
		generateLattice();
		verts0 = currentMesh.geometry.vertices;
		//renderLattice();

		//renderLatticeWireframe();

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
		render();

	}

	function render() {
		controls.update();
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
		bern = binomial * Math.pow(stuPt, u) * Math.pow((1 - stuPt), (v-u));
		return bern;
	}

	function generateLattice(){
		var L = cpNum;
		var M = cpNum;
		var N = cpNum;

		var geometry = new THREE.Geometry();
		for ( var cp = 0; cp < draggable.length; cp++ ){
			geometry.vertices.push( draggable[cp].position );
		}
		for ( var i = 0; i <= L; i++ ){				
			for ( var j = 0; j <= M; j++ ){
				for ( var k = 0; k <= N; k++ ){
					if ( (j < M) && (k < N) )
						geometry.faces.push( new THREE.Face4( k + (j*(N+1)) + (i*(M+1)*(N+1)), k + ((j+1)*(N+1)) + (i*(M+1)*(N+1)), (k+1) + ((j+1)*(N+1)) + (i*(M+1)*(N+1)),  (k+1) + (j*(N+1)) + (i*(M+1)*(N+1)) ) );
					if ( (i < L) && (k < N) )
						geometry.faces.push( new THREE.Face4( k + (j*(N+1)) + (i*(M+1)*(N+1)), k + (j*(N+1)) + ((i+1)*(M+1)*(N+1)), (k+1) + (j*(N+1)) + ((i+1)*(M+1)*(N+1)), (k+1) + (j*(N+1)) + (i*(M+1)*(N+1)) ) );	
					if ( (i < L) && (j < M) )
						geometry.faces.push( new THREE.Face4(k + (j*(N+1)) + (i*(M+1)*(N+1)), k + ((j+1)*(N+1)) + (i*(M+1)*(N+1)), k + ((j+1)*(N+1)) + ((i+1)*(M+1)*(N+1)), k + (j*(N+1)) + ((i+1)*(M+1)*(N+1)) ) );
				}
			}
		}
		geometry.computeBoundingSphere();
		lattice = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } ) );
		lattice.geometry.verticesNeedUpdate = true;
		scene.add( lattice );
	}

	function initCPoints() {
		origin = currentMesh.geometry.boundingBox.min;
		axis.sub(currentMesh.geometry.boundingBox.max, currentMesh.geometry.boundingBox.min);

		sAxis.setX(axis.x);
		tAxis.setY(axis.y);
		uAxis.setZ(axis.z);		

		var cubeG = new THREE.CubeGeometry(1,1,1); 
		var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00}); 

		for(var i = 0; i <= cpNum; ++i){
	    	for(var j = 0; j <= cpNum; ++j){
	      		for (var k = 0; k <= cpNum; ++k){
					controlPoints[i][j][k].setX( origin.x + ((i/cpNum) * axis.x) );
					controlPoints[i][j][k].setY( origin.y + ((j/cpNum) * axis.y) );
					controlPoints[i][j][k].setZ( origin.z + ((k/cpNum) * axis.z) );
					
					var cube = new THREE.Mesh(cubeG, material2);
					cube.position.x = controlPoints[i][j][k].x;
					cube.position.y = controlPoints[i][j][k].y;
					cube.position.z = controlPoints[i][j][k].z;
					cube.updateMatrix();
					draggable.push(cube);
					scene.add(cube);
					//console.log(controlPoints[i][j][k].x,controlPoints[i][j][k].y,controlPoints[i][j][k].z);
	      		}
	    	}
	  	}
	}

	function deform(vec) {
		STUp = convertToSTU(vec);
		ffd1 = new THREE.Vector3(0,0,0);
		ffd2 = new THREE.Vector3(0,0,0);
		ffd3 = new THREE.Vector3(0,0,0);
		var bpS = 0;
		var bpT = 0;
		var bpU = 0;

		var currentCp = 0;

		for(var i = 0; i <= cpNum; i++) {
		    ffd2.setX(0); ffd2.setY(0); ffd2.setZ(0); 
		    for(var j = 0; j <= cpNum; j++) {
		      ffd3.setX(0); ffd3.setY(0); ffd3.setZ(0);
		      for(var k = 0; k <= cpNum; k++) {
		      	bpU = bernstein(k, cpNum, STUp.x);
		      	ffd3.x += (bpU * lattice.geometry.vertices[currentCp].x);
		      	ffd3.y += (bpU * lattice.geometry.vertices[currentCp].y);
		      	ffd3.z += (bpU * lattice.geometry.vertices[currentCp].z);
		      	currentCp++;
		      }
		      bpT = bernstein(j, cpNum, STUp.y); 
		      ffd2.x += (bpT * ffd3.x);
		      ffd2.y += (bpT * ffd3.y);
		      ffd2.z += (bpT * ffd3.z);
		    }
		    bpS = bernstein(i, cpNum, STUp.z);
		    ffd1.x += (bpS * ffd2.x);
		    ffd1.y += (bpS * ffd2.y);
		    ffd1.z += (bpS * ffd2.z);    
		}
		return ffd1;
	}

	function deformMesh(){
		verts = currentMesh.geometry.vertices;
		for (var i = 0; i < verts.length; i++){
			currentMesh.geometry.vertices[i] = deform(verts0[i]);
		}

		currentMesh.geometry.computeBoundingSphere();
		currentMesh.geometry.computeBoundingBox();
		currentMesh.geometry.verticesNeedUpdate = true;
		currentMesh.geometry.elementsNeedUpdate = true;
	}

	function convertToSTU(vec) {
		//calculate S T U values of reparametrized position
		var stuVec = new THREE.Vector3(0,0,0);
		var cpS = new THREE.Vector3(0,0,0);
		var cpT = new THREE.Vector3(0,0,0);
		var cpU = new THREE.Vector3(0,0,0);
		var vs = new THREE.Vector3(0,0,0);

		cpS.cross(tAxis, uAxis);
		cpT.cross(sAxis, uAxis);
		cpU.cross(sAxis, tAxis);
		vs.sub(vec, origin);
		
		dot1 = new THREE.Vector3();
		dot2 = new THREE.Vector3();

		stuVec.setX( cpS.dot(vs) / cpS.dot(sAxis) );   
		stuVec.setY( cpT.dot(vs) / cpT.dot(tAxis) );
		stuVec.setZ( cpU.dot(vs) / cpU.dot(uAxis) );
  		return stuVec;  
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
			SELECTED.position.copy( intersects[ 0 ].point.subSelf( offset ) );
			return;
		}
		
		var intersects = ray.intersectObjects( draggable );

		if ( intersects.length > 0 ) {
			

			if ( INTERSECTED != intersects[ 0 ].object ) {

				for (var cc = 0; cc < draggable.length; cc++)
				{
					if (draggable[cc] == intersects[ 0 ].object) {
						selectedCp = cc;
					}

				}

				if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				INTERSECTED = intersects[ 0 ].object;

				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				plane.position.copy( INTERSECTED.position );
				plane.lookAt( camera.position );
				lattice.geometry.vertices[selectedCp].copy( draggable[selectedCp].position );
				lattice.updateMatrix();
				lattice.geometry.verticesNeedUpdate = true;

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
		mouse.y = -( (event.clientY - $('#context')[0].offsetTop) / $('#context')[0].offsetHeight  ) * 2 + 1;
		
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
		
		var intersects = ray.intersectObjects( draggable );
		if ( intersects.length > 0 ) {
			controls.enabled = false;
			SELECTED = intersects[ 0 ].object;
			var intersects = ray.intersectObject( plane );
			offset.copy( intersects[ 0 ].point ).subSelf( plane.position );
			$('#context').css('cursor','move');
		}
	}

	function onDocumentMouseUp( event ) {
		event.preventDefault();
		controls.enabled = true;
		lattice.geometry.vertices[selectedCp].copy( draggable[selectedCp].position );
		lattice.geometry.verticesNeedUpdate = true;
		deformMesh();
		if ( INTERSECTED ) {
			plane.position.copy( INTERSECTED.position );
			SELECTED = null;
		}
		$('#context').css('cursor','auto');
	}
});