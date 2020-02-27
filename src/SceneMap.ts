import Scene3DContainer from "./Scene3DContainer";

export default class SceneMap extends Laya.Sprite{

    private readonly numX:number = 10;
    private readonly numY:number = 10;

    public readonly W:number = this.numX * 256;
    public readonly H:number = this.numY * 256;

    private readonly _mapLayer:Laya.Sprite;
    private readonly _middle2dLayer:Laya.Sprite;
    private readonly _middle3dLayer:Scene3DContainer;

    private readonly scroll:Laya.Rectangle;
    private offx:number = 0;
    private offy:number = 0;
    constructor(){
        super();
        this._mapLayer = new Laya.Sprite();
        this.addChild(this._mapLayer);
        this.load();

        this.scroll = new Laya.Rectangle();
        this.scrollRect = this.scroll;

        this._middle2dLayer = new Laya.Sprite();
        this.addChild(this._middle2dLayer);

        this._middle3dLayer = new Scene3DContainer();
        //Laya.stage.addChild(this._middle3dLayer.scene);
        this.addChild(this._middle3dLayer.scene);
    }

    public onResize():void{

        let w:number = Laya.stage.width;
        let h:number = Laya.stage.height;

        let lx:number = Math.max(0, this.offx - (w >> 1));
        let ly:number = Math.max(0, this.offy - (h >> 1));
        // let rx:number = Math.min(this.W, this.offx + (w >> 1));
        // let ry:number = Math.min(this.H, this.offy + (h >> 1));
        this.scroll.setTo(lx, ly, Laya.stage.width, Laya.stage.height);
        this.scrollRect = this.scroll;
    }

    private load():void{
        for (let x:number = 0; x < this.numX; ++x)
        {
            for (let y:number = 0; y < this.numY; ++y)
            {
                let spr:Laya.Sprite = new Laya.Sprite();
                spr.loadImage("res/map/1001/chunks/ml_" + x + "_" + y + ".jpg");
                spr.pos(x*256, y*256);
                this._mapLayer.addChild(spr);
            }
        }
    }

    public add2dPlayer(p:Laya.Sprite):void{
        this._middle2dLayer.addChild(p);
    }
    public add3dPlayer(p:Laya.Sprite3D):void{
        this._middle3dLayer.addChild(p);
    }

    public to3DCoord(source:Laya.Vector3,out:Laya.Vector3):void
    {
        this._middle3dLayer.camera.convertScreenCoordToOrthographicCoord(source, out);
    }


    public lookTarget(tox:number, toy:number):void{
        this.offx = tox;
        this.offy = toy;
        this.onResize();
    }
}