import * as THREE from 'three';

import SceneInit from "./scripts/sceneInit"

const test = new SceneInit('bg');

test.initScene();

test.animate();