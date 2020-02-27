import SceneManager from "./SceneManager";

export default class Scene2DPlayer3D {
		constructor() {
			Laya3D.init(1024, 768);
			Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
			Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
			Laya.Stat.show();
			SceneManager.Ins.init();

            Laya.Sprite3D.load("res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, function(sprite) {
                SceneManager.Ins.map.add3dPlayer(sprite);
            }));
		}
	}
