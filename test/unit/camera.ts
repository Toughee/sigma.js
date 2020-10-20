/**
 * Sigma.js Camera Unit Tests
 * ===========================
 *
 * Testing the camera class.
 */
import assert from "assert";
import Camera from "../../src/camera";
import { Coordinates, Dimensions } from "../../src/types";

describe("Camera", function () {
  it("should be possible to read the camera's state.", function () {
    const camera = new Camera();

    assert.deepStrictEqual(camera.getState(), {
      x: 0.5,
      y: 0.5,
      angle: 0,
      ratio: 1,
    });
  });

  it("should be possible to read the camera's previous state.", function () {
    const camera = new Camera();

    camera.setState({ x: 34, y: 56, ratio: 4, angle: 10 });
    camera.setState({ x: 5, y: -3, ratio: 5, angle: 0 });

    assert.deepStrictEqual(camera.getPreviousState(), {
      x: 34,
      y: 56,
      ratio: 4,
      angle: 10,
    });
  });

  it("should be possible to set the camera's state.", function () {
    const camera = new Camera();

    camera.setState({
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });

    assert.deepStrictEqual(camera.getState(), {
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    });
  });

  it("should not be possible to set the camera's state when it's disabled.", function () {
    const camera = new Camera();
    const state1 = {
      x: 10,
      y: -45,
      angle: 0,
      ratio: 3,
    };
    const state2 = {
      x: 123,
      y: 456,
      angle: 0,
      ratio: 1,
    };

    camera.setState(state1);
    camera.disable();
    camera.setState(state2);

    assert.notDeepStrictEqual(state1, state2);
    assert.deepStrictEqual(camera.getState(), state1);
  });

  it("should properly translate coordinates from and to viewport.", function () {
    const camera = new Camera();
    const graphCenter: Coordinates = { x: 0.5, y: 0.5 };
    const graphTopRight: Coordinates = { x: 0.75, y: 0.75 };
    const dimensions: Dimensions = { width: 200, height: 100 };

    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphCenter), { x: 100, y: 50 });
    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphTopRight), { x: 125, y: 25 });
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );

    // Move camera to right and zoom:
    camera.setState({ x: 1, y: 0.5, ratio: 0.5 });
    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphCenter), { x: 0, y: 50 });
    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphTopRight), { x: 50, y: 0 });
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );

    // Move camera to right, zoom and rotate:
    camera.setState({ x: 1, y: 0.5, ratio: 0.5, angle: Math.PI / 2 });
    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphCenter), { x: 100, y: -50 });
    assert.deepStrictEqual(camera.graphToViewport(dimensions, graphTopRight), { x: 150, y: 0 });
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphCenter)),
      graphCenter,
    );
    assert.deepStrictEqual(
      camera.viewportToGraph(dimensions, camera.graphToViewport(dimensions, graphTopRight)),
      graphTopRight,
    );
  });
});
