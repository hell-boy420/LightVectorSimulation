import * as THREE from 'three';

import SceneInit from "./scripts/sceneInit"

const test = new SceneInit('bg');

await test.initScene();

test.animate();