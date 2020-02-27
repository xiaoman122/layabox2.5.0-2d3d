(function () {
    'use strict';

    class Scene3DContainer {
        constructor() {
            this._scene = new Laya.Scene3D();
            this._camera = new Laya.Camera(0, 0.1, 1000);
            this._scene.addChild(this._camera);
            this._camera.transform.translate(new Laya.Vector3(0, 0, 100));
            this._camera.orthographic = true;
            this._camera.orthographicVerticalSize = 10;
            this._camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = new Laya.DirectionLight();
            this._scene.addChild(directionLight);
        }
        addChild(node) {
            this._scene.addChild(node);
        }
        get scene() {
            return this._scene;
        }
        get camera() {
            return this._camera;
        }
    }

    class SceneMap extends Laya.Sprite {
        constructor() {
            super();
            this.numX = 10;
            this.numY = 10;
            this.W = this.numX * 256;
            this.H = this.numY * 256;
            this.offx = 0;
            this.offy = 0;
            this._mapLayer = new Laya.Sprite();
            this.addChild(this._mapLayer);
            this.load();
            this.scroll = new Laya.Rectangle();
            this.scrollRect = this.scroll;
            this._middle2dLayer = new Laya.Sprite();
            this.addChild(this._middle2dLayer);
            this._middle3dLayer = new Scene3DContainer();
            this.addChild(this._middle3dLayer.scene);
        }
        onResize() {
            let w = Laya.stage.width;
            let h = Laya.stage.height;
            let lx = Math.max(0, this.offx - (w >> 1));
            let ly = Math.max(0, this.offy - (h >> 1));
            this.scroll.setTo(lx, ly, Laya.stage.width, Laya.stage.height);
            this.scrollRect = this.scroll;
        }
        load() {
            for (let x = 0; x < this.numX; ++x) {
                for (let y = 0; y < this.numY; ++y) {
                    let spr = new Laya.Sprite();
                    spr.loadImage("res/map/1001/chunks/ml_" + x + "_" + y + ".jpg");
                    spr.pos(x * 256, y * 256);
                    this._mapLayer.addChild(spr);
                }
            }
        }
        add2dPlayer(p) {
            this._middle2dLayer.addChild(p);
        }
        add3dPlayer(p) {
            this._middle3dLayer.addChild(p);
        }
        to3DCoord(source, out) {
            this._middle3dLayer.camera.convertScreenCoordToOrthographicCoord(source, out);
        }
        lookTarget(tox, toy) {
            this.offx = tox;
            this.offy = toy;
            this.onResize();
        }
    }

    class ScenePlayer extends Laya.Sprite {
        init() {
            let s2 = new Laya.Image("res/threeDimen/monkey.png");
            s2.pos(-110 >> 1, -145);
            this.addChild(s2);
            Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                SceneManager.Ins.map.add3dPlayer(layaMonkey);
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                this._d3 = layaMonkey;
                this.fix3d();
            }));
        }
        fix3d() {
            if (this._d3) {
                let pt = this.localToGlobal(new Laya.Point());
                let inn = new Laya.Vector3(pt.x, pt.y, 0);
                let out = new Laya.Vector3();
                SceneManager.Ins.map.to3DCoord(inn, out);
                this._d3.transform.position = out;
            }
        }
        setPosition(tox, toy) {
            this.pos(tox, toy);
            this.fix3d();
        }
    }

    class SceneManager {
        constructor() {
            this._players = new Array();
            this.mousePt = new Laya.Point();
            this._map = new SceneMap();
            Laya.stage.addChild(this._map);
        }
        static get Ins() {
            if (!this._ins)
                this._ins = new SceneManager();
            return this._ins;
        }
        init() {
            this.addMain();
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
        }
        addMain() {
            this._mainPlayer = new ScenePlayer();
            this._mainPlayer.init();
            this._players.push(this._mainPlayer);
            this._map.add2dPlayer(this._mainPlayer);
        }
        onResize() {
            this._map.onResize();
            this._players.forEach(function (p) {
                p.fix3d();
            });
        }
        onDown() {
            Laya.stage.once(Laya.Event.MOUSE_UP, this, this.onUp);
            Laya.stage.once(Laya.Event.MOUSE_OUT, this, this.onUp);
            Laya.timer.loop(1, this, this.frameMove);
        }
        onUp() {
            Laya.timer.clear(this, this.frameMove);
        }
        frameMove() {
            let pt = this._mainPlayer.localToGlobal(Laya.Point.TEMP.setTo(0, 0));
            this.mousePt.setTo(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);
            let speed = 8;
            let rad = this.GetRadian(pt, this.mousePt);
            pt.x = Math.cos(rad) * speed;
            pt.y = Math.sin(rad) * speed;
            pt.x = this._mainPlayer.x + pt.x;
            pt.x = Math.max(0, Math.min(pt.x, this._map.W));
            pt.y = this._mainPlayer.y + pt.y;
            pt.y = Math.max(0, Math.min(pt.y, this._map.H));
            this._mainPlayer.setPosition(pt.x, pt.y);
            this._map.lookTarget(pt.x, pt.y);
        }
        GetAngle(src, tar) {
            return Math.atan2(tar.y - src.y, tar.x - src.x) * (180 / Math.PI);
        }
        GetRadian(src, tar) {
            return Math.PI / 180 * this.GetAngle(src, tar);
        }
        get mainPlayer() {
            return this._mainPlayer;
        }
        get map() {
            return this._map;
        }
    }

    class Scene2DPlayer3D {
        constructor() {
            Laya3D.init(1024, 768);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            SceneManager.Ins.init();
            Laya.Sprite3D.load("res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, function (sprite) {
                SceneManager.Ins.map.add3dPlayer(sprite);
            }));
        }
    }

    class Main {
        constructor() {
            new Scene2DPlayer3D();
            return;
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            this.scene = Laya.stage.addChild(new Laya.Scene3D());
            this.scene.ambientColor = new Laya.Vector3(1, 1, 1);
            var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            Laya.loader.create("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            var layaMonkey = this.scene.addChild(Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            var layaMonkey_clone1 = Laya.Sprite3D.instantiate(layaMonkey, this.scene, false, new Laya.Vector3(0.6, 0, 0));
            var layaMonkey_clone2 = this.scene.addChild(Laya.Sprite3D.instantiate(layaMonkey, null, false, new Laya.Vector3(-0.6, 0, 0)));
        }
    }
    new Main();

}());
