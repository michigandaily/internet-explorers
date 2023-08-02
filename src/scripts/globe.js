import * as THREE from 'three';
import gsap from 'gsap';
import globeTexture from '../assets/2k_earth_daymap.jpg'
import globeSpecularMap from '../assets/2k_earth_specular_map.jpg'
import stars from '../assets/8k_stars.jpg'
import atmoVertexShader from '../scripts/shaders/atmoVertex.glsl?raw'
import atmoFragmentShader from '../scripts/shaders/atmoFragment.glsl?raw'

const canvas = document.getElementById('BGGlobe');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.TextureLoader().load(stars);
setBackground(scene, 8192, 4096);
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.querySelector('#bg')
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

//globe
const geometry = new THREE.SphereGeometry( 5, 50, 50);
const material = new THREE.MeshPhysicalMaterial({
	map:new THREE.TextureLoader().load(globeTexture),
	specularIntensityMap: new THREE.TextureLoader().load(globeSpecularMap),
	specularIntensity: 1,
	specularColor: 0x0B5394,
	sheen: 1,
	sheenColor: 0x0B5394,
	clearcoat: 0.5,
	clearcoatRoughness: 0.6
})
const mobilePlz = new THREE.MeshLambertMaterial ({
	map:new THREE.TextureLoader().load(globeTexture)
})
const globe = new THREE.Mesh(geometry, material);
const mobile = new THREE.Mesh(geometry, mobilePlz);


//atmosphere effect 
const atmoShader = new THREE.ShaderMaterial({
	vertexShader: atmoVertexShader, 
	fragmentShader: atmoFragmentShader, 
	blending: THREE.AdditiveBlending,
	side: THREE.BackSide
});

const atmosphere = new THREE.Mesh(geometry, atmoShader);
atmosphere.scale.set(1.1, 1.1, 1.1);
const group = new THREE.Group();
group.add(globe);
group.position.set(5, -2, -10);
mobile.position.set(5, -2, -10);
atmosphere.position.set(5, -2, -10);

//lighting
const key = new THREE.DirectionalLight(0xffffe0, 1);
const back = new THREE.PointLight(0xffffe0, 0.8);
const ambient = new THREE.AmbientLight(0x404040, 0.35);
key.position.set(-10, 10, 0);
back.position.set(6, 5, -20);
key.castShadow = true;
const keyHelper = new THREE.DirectionalLightHelper(key);
const backHelper = new THREE.PointLightHelper(back);

scene.add(atmosphere);
scene.add(mobile);
mobile.scale.set(0.99, 0.99, 0.99);
mobile.rotation.y = 1.2;
scene.add(key);
scene.add(back);
scene.add(group);
scene.add(ambient);

/*
scene.add(backHelper);
scene.add(keyHelper);
*/

const mouse = {
	x: undefined,
	y: undefined
}

camera.position.z = 2;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	globe.rotation.y += 0.001;
	globe.rotation.x += 0.0001;
	mobile.rotation.y += 0.001;
	gsap.to(group.rotation, {
		x: -0.4 + mouse.y * 0.2,
		y: mouse.x * 0.5,
		duration: 2
	})
}
animate();

addEventListener('mousemove', () => {
	mouse.x = (event.clientX / innerWidth) * 2 - 1;
	mouse.y = (event.clientY / innerHeight) * 2 + 1;
})

// from: https://www.prowaretech.com/articles/current/javascript/three-js/cover-scene-background-with-image#!
function setBackground(scene, backgroundImageWidth, backgroundImageHeight) {
	var windowSize = function(withScrollBar) {
		var wid = 0;
		var hei = 0;
		if (typeof window.innerWidth != "undefined") {
			wid = window.innerWidth;
			hei = window.innerHeight;
		}
		else {
			if (document.documentElement.clientWidth == 0) {
				wid = document.body.clientWidth;
				hei = document.body.clientHeight;
			}
			else {
				wid = document.documentElement.clientWidth;
				hei = document.documentElement.clientHeight;
			}
		}
		return { width: wid - (withScrollBar ? (wid - document.body.offsetWidth + 1) : 0), height: hei };
	};

	if (scene.background) {

		var size = windowSize(true);
		var factor = (backgroundImageWidth / backgroundImageHeight) / (size.width / size.height);

		scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
		scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;

		scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
		scene.background.repeat.y = factor > 1 ? 1 : factor;
	}
}
