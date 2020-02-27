import GameConfig from "./GameConfig";
import Scene2DPlayer3D from "./Scene2DPlayer3D";
class Main {
    private scene:Laya.Scene3D;
    constructor() {

        new Scene2DPlayer3D();
        return;
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();

        this.scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        this.scene.ambientColor = new Laya.Vector3(1, 1, 1);

        var camera:Laya.Camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);

        Laya.loader.create("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.onComplete));
    }

    public onComplete():void {

        var layaMonkey:Laya.Sprite3D = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
        //克隆sprite3d
        var layaMonkey_clone1:Laya.Sprite3D = Laya.Sprite3D.instantiate(layaMonkey, this.scene, false, new Laya.Vector3(0.6, 0, 0));
        //克隆sprite3d
        var layaMonkey_clone2:Laya.Sprite3D = this.scene.addChild(Laya.Sprite3D.instantiate(layaMonkey, null, false, new Laya.Vector3(-0.6, 0, 0))) as Laya.Sprite3D;
    }
}
//激活启动类
new Main();
