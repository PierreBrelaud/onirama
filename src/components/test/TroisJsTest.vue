<template>
	<div id="trois-test-container">
		<Renderer ref="renderer" antialias resize="true">
			<Camera ref="camera" :position="{ z: 5 }" />
			<Scene ref="scene" background="#f0f0f0">
				<Box ref="box1" :position="{x:-3, y:0, z:0}">
					<LambertMaterial color="#ff0000" />
				</Box>
				<Box ref="box2">
					<LambertMaterial color="#00ff00" />
				</Box>
				<Box ref="box3" :position="{x:3, y:0, z:0}">
					<LambertMaterial color="#0000ff" />
				</Box>
			</Scene>
		</Renderer>
	</div>
</template>

<script>
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import swipeDetect from "swipe-detect";

export default {
	mounted() {
		CameraControls.install({THREE: THREE});

		const clock = new THREE.Clock();

		const renderer = this.$refs.renderer;
		const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		this.$refs.scene.add( light );

		const cameraControls = new CameraControls(this.$refs.camera.camera, renderer.renderer.domElement);
		cameraControls.touches.one = CameraControls.ACTION.NONE;
		cameraControls.touches.two = CameraControls.ACTION.NONE;
		cameraControls.touches.three = CameraControls.ACTION.NONE;
		
		swipeDetect(
			renderer.renderer.domElement,
			(dir) => {
				if (dir === "left") {
					cameraControls.truck(1, 0, true);
				} else if (dir === "right") {
					cameraControls.truck(-1, 0, true);
				}
			},
			10
		);

		renderer.onBeforeRender(() => {
			const delta = clock.getDelta();
			cameraControls.update( delta );
		});
	},
};
</script>

<style scoped>
#trois-test-container {
    width: 100%;
    height: 100vh;
}
</style>
