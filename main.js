import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

// globals -----------------------------
let g_purple;
let g_urple = 0;
let cam1_look = [-10, 10, 0];
let cam1_pos = [-10, 10, 20];
let g_time_gotten = 0;

g_purple = document.getElementById('purple');

/*function cam1_move(cam, direction, movement) { 
    cam1_look[direction] += movement; 
    cam1_pos[direction] += movement;
}*/

// main ------------------------
function main() {

    // Register function (event handler) to be called on a mouse press
    document.getElementById('c').addEventListener('click', function(event) {
        if (event.shiftKey) {
            g_purple.play();
            g_urple = 1;
            g_time_gotten = 0;
            console.log('e');
        }
    });

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    RectAreaLightUniformsLib.init();

	const fov = 60;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 10000;
	
	
    // camera1
    

    const camera1 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera1.position.x = cam1_pos[0];
    camera1.position.y = cam1_pos[1];
    camera1.position.z = cam1_pos[2];
    camera1.lookAt(cam1_look[0], cam1_look[1], cam1_look[2]);

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
		var light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 10 );
		scene.add( light );

        // Point Light 1, red
        const p1color = 0xff0000;
		const p1intensity = 2000;
		var p1light = new THREE.PointLight( p1color, p1intensity );
        var p1pos = [-35, 10, -25];
		p1light.position.set( p1pos[0], p1pos[1], p1pos[2] );

        // Point Light 2, blue
        const p2color = 0x0000ff;
		const p2intensity = 2000;
		var p2light = new THREE.PointLight( p2color, p2intensity );
        var p2pos = [15, 10, -25];
		p2light.position.set( p2pos[0], p2pos[1], p2pos[2] );

        // Point Light 3, purple
        const p3color = 0xbb00ff;
		const p3intensity = 2000;
		var p3light = new THREE.PointLight( p3color, p3intensity );
        var p3pos = [-10, 20, 30];
		p3light.position.set( p3pos[0], p3pos[1], p3pos[2] );
        //scene.add(p3light);
		

        // Rectangular Light
        const reccolor = 0xFFFF00;
        const recintensity = 5;
        const recwidth = 225;
        const recheight = 75
        const reclight = new THREE.RectAreaLight(reccolor, recintensity, recwidth, recheight);
        reclight.position.set(0, 30, -110);
        scene.add(reclight);

        //const helper = new THREE.PointLightHelper(p1light);
        //scene.add(helper);

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
    const cylinderDimensions = [10, 10, 20];
	const boxGeometry = new THREE.BoxGeometry( boxDimensions[0], boxDimensions[1], boxDimensions[2] );
    const ballGeometry = new THREE.SphereGeometry( sphereDimensions[0], sphereDimensions[1], sphereDimensions[2]);
    const cylinderGeometry = new THREE.CylinderGeometry( cylinderDimensions[0], cylinderDimensions[1], cylinderDimensions[2]);
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
    foxbox.position.z = 150;

    // roadplate
    const road = new THREE.Mesh(boxGeometry, materials[1]);
    scene.add(road);
    road.position.x = 0;
    road.position.y = -5;
    road.position.z = -50;
    road.scale.set(roadsize, 0.5, roadsize);

    // drive in
    const drivein = new THREE.Mesh(boxGeometry, materials[1]);
    scene.add(drivein);
    drivein.position.x = -125;
    drivein.position.y = -5;
    drivein.position.z = 300;
    drivein.scale.set(roadsize/4, 0.5, roadsize/2);

    // high way
    const highway = new THREE.Mesh(boxGeometry, materials[1]);
    scene.add(highway);
    highway.position.x = 0;
    highway.position.y = -5;
    highway.position.z = 600;
    highway.scale.set(1000, 0.5, roadsize);

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

    makeInstance(boxGeometry, 0xAAAAAA, [0, 35, -260], [25, 7.5, 1]); // back wall
    makeInstance(boxGeometry, 0xAAAAAA, [120, 35, -180], [1, 7.5, 15]); // right wall
    makeInstance(boxGeometry, 0xAAAAAA, [-120, 35, -180], [1, 7.5, 15]); // left wall
    makeInstance(boxGeometry, 0x2b2218, [0, 87, -180], [30, 3,20]); // roof

    // signage
    makeInstance(boxGeometry, 0xff9500, [0, 95, -80], [22, 0.5,0.5]);
    makeInstance(boxGeometry, 0x3ab53e, [0, 85, -80], [22, 0.5,0.5]);
    makeInstance(boxGeometry, 0xb81d28, [0, 75, -80], [22, 0.5,0.5]);

    const sign = new THREE.Mesh(boxGeometry, materials[2]); // the sign itself
    scene.add(sign); //adds shape to scene to be rendered
    sign.position.set(0, 85, -78);
    sign.scale.set(3, 3, 0.5);

    //front wall
    const frontwall = new THREE.Mesh(boxGeometry, materials[3]); // the yellow wall
    scene.add(frontwall); //adds shape to scene to be rendered
    frontwall.position.set(0, 35, -130);
    frontwall.scale.set(24, 7.5, 1);

    makeInstance(boxGeometry, 0x222222, [80, 35, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [40, 35, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [-40, 35, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [-80, 35, -120], [0.5, 7.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [0, 55, -120], [24, 0.5,0.25]);
    makeInstance(boxGeometry, 0x222222, [0, 25, -120], [0.5, 6,0.25]);

    // curb
    makeInstance(boxGeometry, 0x555555, [0, -4, -160], [40, 1,25]);

    // billboard

    makeInstance(cylinderGeometry, 0x555555, [-250, 0, 125], [0.5, 15,0.5]); //base pole
    //makeInstance(boxGeometry, 0xAAAAAA, [-245, 175, 125], [1, 5, 10]); // sign itself
    
    const billboard = new THREE.Mesh(boxGeometry, materials[2]); // the sign itself
    scene.add(billboard); //adds shape to scene to be rendered
    billboard.position.set(-245, 175, 125);
    billboard.scale.set(1, 5, 10);


    // colored balls--------------------------------
    // blue 
    const basicblue = new THREE.MeshBasicMaterial({  color: 0x0037ff  });

	const blueball = new THREE.Mesh( ballGeometry, basicblue );

	blueball.position.set(p2pos[0], p2pos[1], p2pos[2]);

    // red
    
    const basicred = new THREE.MeshBasicMaterial({  color: 0xff1500  });

	const redball = new THREE.Mesh( ballGeometry, basicred );

	redball.position.set(p1pos[0], p1pos[1], p1pos[2]);

    // purple 

    const basicpurple = new THREE.MeshBasicMaterial({  color: 0x9900d1  });

	const purpleball = new THREE.Mesh( ballGeometry, basicpurple );

	purpleball.position.set(p3pos[0], p3pos[1], p3pos[2]);
    purpleball.scale.set(2, 2, 2);

    // explosion

	const explosion = new THREE.Mesh( ballGeometry, basicpurple );

	explosion.position.set(-10, 20, 4000);
    explosion.scale.set(20, 50, 50);
    var explosion_rad = 20;

    //scene.add(purpleball);

    // wall in the void -----------------------
    makeBasicInstance(boxGeometry, 0xffffff, [0, -500, 0], [20, 10, 1]);

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

		shape.position.set(position[0], position[1], position[2]);

        

		return shape;

	}

    // contains all the shapes to be animated
	const spinshapes = [
		foxbox,
		redball,
		blueball,
        purpleball,
	];

    let time_i;
    let accel = 0;

    // urple animations ----------------
    function urpletime(currenttime) {
        // animaitons
        if (currenttime > 2.75) { // blue spawn
            scene.add( p2light );
            scene.add( blueball );
        }

        if (currenttime > 5.5) { //red spawn
            scene.add( p1light );
            scene.add( redball );
        }

        if (currenttime > 7) { // sphere movement
            redball.position.x += (currenttime - 7) * 0.01;
            p1light.position.x += (currenttime - 7) * 0.01;
            blueball.position.x -= (currenttime - 7) * 0.01;
            p2light.position.x -= (currenttime - 7) * 0.01;
            

        }
        
        if (currenttime > 12.5) { // purple transition
            scene.remove(redball);
            scene.remove(p1light);
            scene.remove(blueball);
            scene.remove(p2light);
            
            scene.add(purpleball);
            scene.add(p3light);

            camera1.position.set(20, 10, -30);
            camera1.lookAt(-10, 10, 30);
        }

        if (currenttime > 16) { // purple move
            purpleball.position.z += (currenttime-16)*(2+accel);
            p3light.position.z += (currenttime-16)*(2+accel);
            accel += 1;
        }


        if (currenttime > 16.25) { // foxdie protocol
            scene.remove(foxbox);
        }

        if (currenttime > 19) { // explosion
            scene.add(explosion);
            explosion_rad += 2;
            explosion.scale.set(explosion_rad, explosion_rad, explosion_rad);
            light.color.set(0xff00ff);
        }

        if (currenttime > 20) { // fade to white
            camera1.position.set(0, -500, -50);
            camera1.lookAt(0, -500, 0);
        }

        if (currenttime > 25) { // reset
            redball.position.set(p1pos[0], p1pos[1], p1pos[2]);
            p1light.position.set(p1pos[0], p1pos[1], p1pos[2]);
            blueball.position.set(p2pos[0], p2pos[1], p2pos[2]);
            p2light.position.set(p2pos[0], p2pos[1], p2pos[2]);
            purpleball.position.set(p3pos[0], p3pos[1], p3pos[2]);
            p3light.position.set(p3pos[0], p3pos[1], p3pos[2]);
            scene.remove(purpleball);
            scene.remove(p3light);
            scene.remove(explosion);
            scene.add(foxbox);

            light.color.set(0xffffaa);
            explosion_rad = 20;

            camera1.position.set(cam1_pos[0], cam1_pos[1], cam1_pos[2]);
            camera1.lookAt(cam1_look[0], cam1_look[1], cam1_look[2]);
            accel = 0;
            g_time_gotten = 0;
            g_urple = 0;
        }
    }

    // render function -------------------------------------
	function render( time ) {
    
		time *= 0.001; // convert time to seconds
        
        if (g_urple == 0) {
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

        } else {

            if (g_time_gotten == 0) {
                time_i = time;
                g_time_gotten = 1;
            }
            //console.log(time_i);

            urpletime(time-time_i);
            

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera1.aspect = canvas.clientWidth / canvas.clientHeight;
                camera1.updateProjectionMatrix();
            }
    
            spinshapes.forEach( ( cube, ndx ) => {
    
                const speed = 1 + ndx * .1;
                const rot = time * speed;
                cube.rotation.x = rot;
                cube.rotation.y = rot;
    
            } );
    
            renderer.render( scene, camera1 );
    
            requestAnimationFrame( render );
        }
        

	}

	requestAnimationFrame( render );

}

main();
