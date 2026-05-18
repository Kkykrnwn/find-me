import * as THREE from "https://esm.sh/three@0.156.1";

document.addEventListener("DOMContentLoaded", () => new App());

class App {
  constructor() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.setUpScene();
  }

  setUpScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.bgrColor = 0x332e2e;
    this.fog = new THREE.Fog(this.bgrColor, 13, 20);
    this.scene.fog = this.fog;
    this.camera = new THREE.PerspectiveCamera(
    60,
    this.winWidth / this.winHeight,
    1,
    100);

    this.camera.position.set(0, 7, 8);
    this.camera.lookAt(new THREE.Vector3());
    this.scene.add(this.camera);

    // Hero params
    this.heroAngularSpeed = 0;
    this.heroOldRot = 0;
    this.heroDistance = 0;
    this.heroOldUVPos = new THREE.Vector2(0.5, 0.5);
    this.heroNewUVPos = new THREE.Vector2(0.5, 0.5);
    this.heroSpeed = new THREE.Vector2(0, 0);
    this.heroAcc = new THREE.Vector2(0, 0);
    this.targetHeroUVPos = new THREE.Vector2(0.5, 0.5);
    this.targetHeroAbsMousePos = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Clock
    this.clock = new THREE.Clock();
    this.time = 0;
    this.deltaTime = 0;

    // Core
    this.createRenderer();
    this.createMaterials();
    this.createListeners();

    // Environment
    this.floorSize = 30;
    this.createHero();
    this.createFloor();
    this.createLine();
    this.createLight();

    // Render loop
    this.draw();
  }

  createMaterials() {
    this.primMat = new THREE.MeshToonMaterial({ color: 0x7beeff });
    this.secMat = new THREE.MeshToonMaterial({ color: this.bgrColor });
    this.bonusMat = new THREE.MeshToonMaterial({ color: 0xff3434 });
  }

  createHero() {
    const geom = new THREE.BoxGeometry(1, 1);
    const mat = this.primMat;
    this.hero = new THREE.Mesh(geom, mat);
    this.hero.castShadow = true;
    this.hero.position.y = .5;
    this.scene.add(this.hero);
  }

  createFloor() {
    const geom = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
    const mat = this.secMat;
    this.floor = new THREE.Mesh(geom, mat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  createLine() {
    const material = new THREE.LineDashedMaterial({
      color: 0x7beeff,
      linewidth: 1,
      scale: 1,
      dashSize: 0.2,
      gapSize: 0.1 });


    const points = [];
    points.push(new THREE.Vector3(0, 0.2, 0));
    points.push(new THREE.Vector3(3, 0.2, 3));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }

  createLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(2, 5, 1);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 12;
    this.light.shadow.camera.left = -12;
    this.light.shadow.camera.right = 12;
    this.light.shadow.camera.bottom = -12;
    this.light.shadow.camera.top = 12;
    this.light.shadow.radius = 3;
    this.light.shadow.blurSamples = 4;
    this.scene.add(this.light);

    const helper = new THREE.CameraHelper(this.light.shadow.camera);
    //this.scene.add(helper);
  }

  createRenderer() {
    const canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true });

    this.renderer.setClearColor(new THREE.Color(this.bgrColor));

    this.renderer.setPixelRatio(this.pixelRatio = window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
  }

  createListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
  }

  draw() {
    this.updateGame();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.draw.bind(this));
  }

  updateGame() {
    this.dt = this.clock.getDelta();
    this.time += this.dt;

    if (this.hero && this.line) {
      // Elastic string simulation
      this.targetHeroAbsMousePos.x = (this.targetHeroUVPos.x - 0.5) * this.floorSize;
      this.targetHeroAbsMousePos.y = -(this.targetHeroUVPos.y - 0.5) * this.floorSize;

      let dx = this.targetHeroAbsMousePos.x - this.hero.position.x;
      let dy = this.targetHeroAbsMousePos.y - this.hero.position.z;

      let angle = Math.atan2(dy, dx);
      this.heroDistance = Math.sqrt(dx * dx + dy * dy);
      let ax = dx * this.dt * 0.5;
      let ay = dy * this.dt * 0.5;

      this.heroSpeed.x += ax;
      this.heroSpeed.y += ay;

      this.heroSpeed.x *= Math.pow(this.dt, 0.005);
      this.heroSpeed.y *= Math.pow(this.dt, 0.005);

      this.hero.position.x += this.heroSpeed.x;
      this.hero.position.z += this.heroSpeed.y;
      let targetRot = -angle + Math.PI / 2;

      if (this.heroDistance > 0.3) {
        this.hero.rotation.y += this.getShortestAngle(targetRot - this.hero.rotation.y) * 3 * this.dt;
      }
      this.heroAngularSpeed = this.getShortestAngle(this.hero.rotation.y - this.heroOldRot);

      this.heroOldRot = this.hero.rotation.y;

      let p = this.line.geometry.attributes.position.array;
      p[0] = this.targetHeroAbsMousePos.x;
      p[2] = this.targetHeroAbsMousePos.y;
      p[3] = this.hero.position.x;
      p[4] = this.hero.position.y;
      p[5] = this.hero.position.z;

      this.line.geometry.attributes.position.needsUpdate = true;
      this.line.computeLineDistances();
    }
  }

  onWindowResize() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.camera.aspect = this.winWidth / this.winHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.winWidth, this.winHeight);
  }

  onMouseMove(event) {
    const x = event.clientX / this.winWidth * 2 - 1;
    const y = -(event.clientY / this.winHeight * 2 - 1);
    this.updateMouse(x, y);
  }

  onTouchMove(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      const x = event.touches[0].pageX / this.winWidth * 2 - 1;
      const y = -(event.touches[0].pageY / this.winHeight * 2 - 1);
      this.updateMouse(x, y);
    }
  }

  updateMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
    if (this.floor) this.raycast();
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects([this.floor]);

    if (intersects.length > 0) {
      this.targetHeroUVPos.x = intersects[0].uv.x;
      this.targetHeroUVPos.y = intersects[0].uv.y;
    }
  }

  getShortestAngle(v) {
    let a = v % (Math.PI * 2);
    if (a < -Math.PI) a += Math.PI * 2;else
    if (a > Math.PI) a -= Math.PI * 2;
    return a;
  }

  constrain(v, vMin, vMax) {
    return Math.min(vMax, Math.max(vMin, v));
  }}