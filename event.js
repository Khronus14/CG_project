'use strict';

function gotKey (event) {
    const key = event.key;

    // toggle view
    if (key === 'v') {
        viewMode = (viewMode === false);
        setUpCamera();
    }

    // toggle shading
    if (key === 'l') useShading === 0 ? useShading = 1 : useShading = 0;

    // toggle party mode
    if (key === 'p') partyMode = (partyMode === false);

    //  incremental rotation
    if (key === 'x') angles[0] += angleInc;
    if (key === 'y') angles[1] += angleInc;
    if (key === 'z') angles[2] += angleInc;
    if (key === 'X') angles[0] -= angleInc;
    if (key === 'Y') angles[1] -= angleInc;
    if (key === 'Z') angles[2] -= angleInc;

    // modify light position
    // I wanted to rotate the light position on an arc, but it was not exact so
    // multiplying back and forth put the light out of position. Settled for a
    // step method: starts at [-10, 0, 10] then goes to [-9, 1, 9] up to the
    // peak at [0, 10, 0] at which point it goes down to [10, 0, -10].
    if (key === 'a') {
        if (lightPOS[2] < 10.0) {
            if (lightPOS[2] < 0.0) {
                lightPOS[1] += 1.0;
            } else {
                lightPOS[1] -= 1.0;
            }
            lightPOS[0] -= 1.0;
            lightPOS[2] += 1.0;

            // glMatrix.vec3.rotateX(lightPOS, lightPOS, [0, 0, 0], radians(9));
            // glMatrix.vec3.rotateY(lightPOS, lightPOS, [0, 0, 0], radians(-9));
            // glMatrix.vec3.rotateZ(lightPOS, lightPOS, [0, 0, 0], radians(9));
        }
    }

    if (key === 'd') {
        if (lightPOS[2] > -10.0) {
            if (lightPOS[2] > 0.0) {
                lightPOS[1] += 1.0;
            } else {
                lightPOS[1] -= 1.0;
            }
            lightPOS[0] += 1.0;
            lightPOS[2] -= 1.0;

            // glMatrix.vec3.rotateX(lightPOS, lightPOS, [0, 0, 0], radians(-9));
            // glMatrix.vec3.rotateY(lightPOS, lightPOS, [0, 0, 0], radians(9));
            // glMatrix.vec3.rotateZ(lightPOS, lightPOS, [0, 0, 0], radians(-9));
        }
    }

    // reset camera view
    if (key === 'r') {
        angles = [0.0, 0.0, 0.0];
        lightPOS = [-10.0, 0.0, 10.0];
    }

    draw();
}
