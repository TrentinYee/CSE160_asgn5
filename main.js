import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxDimensions = [1, 1, 1];
    const sphereDimensions = [1, 32, 16];
	const cube_geometry = new THREE.BoxGeometry( boxDimensions[0], boxDimensions[1], boxDimensions[2] );
    const ball_geometry = new THREE.SphereGeometry( sphereDimensions[0], sphereDimensions[1], sphereDimensions[2]);

	function makeInstance( geometry, color, x, y, z) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const shape = new THREE.Mesh( geometry, material );
		scene.add( shape );

		shape.position.x = x;
        shape.position.y = y;
        shape.position.z = z;

		return shape;

	}

	const shapes = [
		makeInstance( cube_geometry, 0x44aa88, 0, 0, 0),
		makeInstance( sphere_geometry, 0x730811, - 2, 0, 0),
		makeInstance( sphere_geometry, 0x184496, 2, 0, 0),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
