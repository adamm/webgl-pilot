$(function(){
  var container;
  var camera, scene, renderer;
  var sphere1, sphere2;
  var mouseX = 0, mouseY = 0;

  // set the scene size
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // set some camera attributes
  var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 1,
      FAR = 10000;

  var layers = [
    { image: 'gfx/earth.jpg',
      geometry: [ 200, 50, 50 ],
      overdraw: true,
      sphere: {}
    },
    { image: 'gfx/clouds.png',
      geometry: [ 220, 50, 50 ],
      overdraw: false,
      sphere: {}
    }
  ];

  init();
  animate();

  function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                    ASPECT,
                                    NEAR,
                                    FAR  );
    // the camera starts at 0,0,0 so pull it back
    camera.position.z = 215;
    camera.rotation.z = 1.54;
    camera.rotation.y = 1.2;

    // Declare the 3D scene wtih camera
    scene = new THREE.Scene();
    scene.add(camera);

    for ( var i = 0; i < layers.length; i++ ) {
      var layer = layers[i];

      // load the sphere's texture
      var texture = THREE.ImageUtils.loadTexture(
        layer.image/*, undefined, function() {
          // This call ensures render() re-runs after the image is loaded.
          // This isn't necessary if the scene is animated.
          render();
      }*/);

      // create the sphere's material
      var material = new THREE.MeshBasicMaterial({
          map: texture,
          overdraw: layer.overdraw
      });

      // assign the sphere's geometry
      var geometry = new THREE.SphereGeometry(layer.geometry[0], layer.geometry[1], layer.geometry[2]);

      // create a new mesh with sphere geometry
      layer.sphere = new THREE.Mesh(geometry, material);
      layer.sphere.doubleSided = true;
      layer.sphere.rotation.x = -100;
      scene.add(layer.sphere);
    }

    // Create the WebGL Renderer, apply it to the DOM
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize(event) {
    WIDTH  = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    layers[0].sphere.rotation.y += 0.0025;
    layers[1].sphere.rotation.y += 0.0025;
    //camera.position.x += 10;
    //camera.lookAt(scene.position);

    renderer.clear();
    renderer.render(scene, camera);
  }
});
