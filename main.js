import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    RectAreaLightUniformsLib.init();

	const fov = 60;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 10000;
	
	
    // camera1
    const camera1 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera1.position.x = 5;
    camera1.position.y = 10;
    camera1.position.z = 42;
    camera1.lookAt(0, 2, 0);

    // camera2
    const camera2 = new THREE.PerspectiveCamera( fov, aspect, near, far);
      camera2.position.set(40, 10, 30);
      camera2.lookAt(0, 5, 0);
    
      // orbit controls
      const oControls = new OrbitControls(camera2, canvas);
      oControls.target.set(0, 5, 0);
      oControls.update();


    // scene setup

	const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
	{
        // Ambient Light
        const ambColor = 0xffaaff;
        const ambIntensity = 0.25;
        const ambLight = new THREE.AmbientLight(ambColor, ambIntensity);
        scene.add(ambLight);
        
        // Directional Light
		const color = 0xFFFFaa;
		const intensity = 0.7;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 10 );
		scene.add( light );

        // Point Light 1
        const p1color = 0xff0000;
		const p1intensity = 2000;
		const p1light = new THREE.PointLight( p1color, p1intensity );
		p1light.position.set( -30, 10, -25 );
		scene.add( p1light );

        // Point Light 2
        const p2color = 0x0000ff;
		const p2intensity = 2000;
		const p2light = new THREE.PointLight( p2color, p2intensity );
        p2light.d
		p2light.position.set( 10, 10, -25 );
		scene.add( p2light );

        // Rectangular Light
        const reccolor = 0xFFFF00;
        const recintensity = 5;
        const recwidth = 225;
        const recheight = 75
        const reclight = new THREE.RectAreaLight(reccolor, recintensity, recwidth, recheight);
        reclight.position.set(0, 30, -110);
        scene.add(reclight);

        const helper = new THREE.PointLightHelper(p1light);
        scene.add(helper);

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

    // taken straight from three.js manual, loads textures given path
    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    // primary shape dimensions and geometry
	const boxDimensions = [10, 10, 10];
    const sphereDimensions = [10, 32, 32];
	const boxGeometry = new THREE.BoxGeometry( boxDimensions[0], boxDimensions[1], boxDimensions[2] );
    const ballGeometry = new THREE.SphereGeometry( sphereDimensions[0], sphereDimensions[1], sphereDimensions[2]);
    const roadsize = 50;
    
    // texture defining
    const loader = new THREE.TextureLoader();
    const foxtexture = loadColorTexture( 'textures/fox.png' );
    const roadtexture = loadColorTexture( 'textures/road-texture.jpg' );
    const signtexture = loadColorTexture( 'textures/eleven-seven.jpg' );
    roadtexture.wrapS = THREE.RepeatWrapping;
    roadtexture.wrapT = THREE.RepeatWrapping;
    roadtexture.magFilter = THREE.NearestFilter;
    const repeats = roadsize/2;
    roadtexture.repeat.set(repeats, repeats);

    // skybox texture
    const skyloader = new THREE.TextureLoader();
    const skytexture = skyloader.load(
        'textures/aristea_wreck_puresky.jpg',
        () => {
        skytexture.mapping = THREE.EquirectangularReflectionMapping;
        skytexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = skytexture;
    });

    // materials
    const materials = [
        new THREE.MeshPhongMaterial({map: foxtexture}),
        new THREE.MeshPhongMaterial({map: roadtexture}),
        new THREE.MeshPhongMaterial({map: signtexture}),
        new THREE.MeshStandardMaterial({color: 0xFFFF00}),
    ];

    // foxbox
    const foxbox = new THREE.Mesh(boxGeometry, materials[0]);
    scene.add(foxbox); //adds shape to scene to be rendered
    foxbox.position.x = -10;
    foxbox.position.y = 7.5;
    foxbox.position.z = 55;

    // roadplate
    const road = new THREE.Mesh(boxGeometry, materials[1]);
    scene.add(road);
    road.position.x = 0;
    road.position.y = -5;
    road.position.z = -50;
    road.scale.set(roadsize, 0.5, roadsize);

    // other shapes ---------------------------------
    
    // floor
    makeInstance( boxGeometry, 0x175e1e, [0, -6, 0], [1000, 0, 1000]);

    // chimkin
    const mtlLoader = new MTLLoader();
    mtlLoader.load( 'Models/Bird_v1_L2/Bird_v1/12259_Bird_v1_L2.mtl', ( mtl ) => {

        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials( mtl );
        objLoader.load( 'Models/Bird_v1_L2/Bird_v1/12259_Bird_v1_L2.obj', ( root ) => {

            scene.add( root );
            root.scale.set(0.5, 0.5, 0.5);

            root.position.x = -10; // put on level with foxbox when camera controls are added, this is just for the shot
            root.position.y = -2.5;
            root.position.z = -10;

            root.rotation.x = 3* Math.PI / 2;

    

        } );

    } );

    // Eleven Seven --------------------------------

    makeInstance(boxGeometry, 0xAAAAAA, [0, 30, -260], [25, 7.5, 1]); // back wall
    makeInstance(boxGeometry, 0xAAAAAA, [120, 30, -180], [1, 7.5, 15]); // right wall
    makeInstance(boxGeometry, 0xAAAAAA, [-120, 30, -180], [1, 7.5, 15]); // left wall
    makeInstance(boxGeometry, 0x2b2218, [0, 82, -180], [30, 3,20]); // roof

    // signage
    makeInstance(boxGeometry, 0xff9500, [0, 90, -80], [22, 0.5,0.5]);
    makeInstance(boxGeometry, 0x3ab53e, [0, 80, -80], [22, 0.5,0.5]);
    makeInstance(boxGeometry, 0xb81d28, [0, 70, -80], [22, 0.5,0.5]);

    const sign = new THREE.Mesh(boxGeometry, materials[2]); // the sign itself
    scene.add(sign); //adds shape to scene to be rendered
    sign.position.set(0, 80, -78);
    sign.scale.set(3, 3, 0.5);

    //front wall
    const frontwall = new THREE.Mesh(boxGeometry, materials[3]); // the yellow wall
    scene.add(frontwall); //adds shape to scene to be rendered
    frontwall.position.set(0, 30, -130);
    frontwall.scale.set(24, 7.5, 1);

    makeInstance(boxGeometry, 0x222222, [80, 30, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [40, 30, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [-40, 30, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [-80, 30, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [0, 50, -120], [24, 0.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [0, 20, -120], [0.5, 6,0.25]);

    // makes an untextured shape given all the parameters
	function makeInstance( geometry, color, position, scale) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const shape = new THREE.Mesh( geometry, material );
		scene.add( shape );

        shape.scale.set(scale[0], scale[1], scale[2]);

		shape.position.x = position[0];
        shape.position.y = position[1];
        shape.position.z = position[2];

        

		return shape;

	}

    function makeBasicInstance( geometry, color, position, scale) {

		const material = new THREE.MeshBasicMaterial( { color } );

		const shape = new THREE.Mesh( geometry, material );
		scene.add( shape );

        shape.scale.set(scale[0], scale[1], scale[2]);

		shape.position.x = position[0];
        shape.position.y = position[1];
        shape.position.z = position[2];

        

		return shape;

	}

    // contains all the shapes to be animated
	const spinshapes = [
		foxbox,
		makeBasicInstance( ballGeometry, 0xff1500, [-30, 10, -25], [1, 1, 1]),
		makeBasicInstance( ballGeometry, 0x0037ff, [10, 10, -25], [1, 1, 1]),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera2.aspect = canvas.clientWidth / canvas.clientHeight;
            camera2.updateProjectionMatrix();
        }

		spinshapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera2 );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
