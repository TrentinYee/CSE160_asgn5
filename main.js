import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 90;
	const aspect = 4; // the canvas default
	const near = 0.1;
	const far = 500;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	
    // camera
    camera.position.x = 5;
    camera.position.y = 10;
    camera.position.z = 30;
    camera.lookAt(0, 2, 0);

	const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 0, 10 );
		scene.add( light );

	}

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // primary shape dimensions and geometry
	const boxDimensions = [10, 10, 10];
    const sphereDimensions = [10, 32, 32];
	const boxGeometry = new THREE.BoxGeometry( boxDimensions[0], boxDimensions[1], boxDimensions[2] );
    const ballGeometry = new THREE.SphereGeometry( sphereDimensions[0], sphereDimensions[1], sphereDimensions[2]);

    // texture stuff
    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'fox.png' );
    texture.colorSpace = THREE.SRGBColorSpace;

    // foxbox
    const FoxMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    });

    const foxbox = new THREE.Mesh(boxGeometry, FoxMaterial);
    scene.add(foxbox);
    foxbox.position.x = -10;
    foxbox.position.y = 0;
    foxbox.position.z = 25;

    // chimkin
    const mtlLoader = new MTLLoader();
    mtlLoader.load( 'Bird_v1_L2/Bird_v1/12259_Bird_v1_L2.mtl', ( mtl ) => {

        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials( mtl );
        objLoader.load( 'Bird_v1_L2/Bird_v1/12259_Bird_v1_L2.obj', ( root ) => {

            scene.add( root );
            root.scale.set(0.5, 0.5, 0.5);

            root.rotation.x = 3* Math.PI / 2;

            root.position.x = 0; // put on level with foxbox when camera controls are added, this is just for the shot
            root.position.y = 0;
            root.position.z = 0;


        } );

    } );
    
    // chimkin mtrl file
    



    // makes an untextured shape given all the parameters
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
		foxbox,
		makeInstance( ballGeometry, 0x730811, - 20, 10, -25),
		makeInstance( ballGeometry, 0x184496, 20, 10, -25),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

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
