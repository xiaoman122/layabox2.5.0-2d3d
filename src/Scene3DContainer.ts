export default class Scene3DContainer {
    private readonly _scene:Laya.Scene3D;
    private readonly _camera:Laya.Camera;
    constructor() {
        this._scene = new Laya.Scene3D();
        this._camera = new Laya.Camera(0, 0.1, 1000);
        this._scene.addChild(this._camera);
        this._camera.transform.translate(new Laya.Vector3(0, 0, 100));
        this._camera.orthographic = true;
        //正交投影垂直矩阵尺寸
        this._camera.orthographicVerticalSize = 10;
        this._camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;

        var directionLight = new Laya.DirectionLight();
        this._scene.addChild(directionLight);
    }

    public addChild(node:Laya.Node):void{
        this._scene.addChild(node);
    }

    public get scene():Laya.Scene3D{
        return this._scene;
    }

    public get camera():Laya.Camera{
        return this._camera;
    }

}