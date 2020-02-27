import SceneMap from "./SceneMap";
import ScenePlayer from "./ScenePlayer";

export default class SceneManager
{
    private static _ins:SceneManager;
    public static get Ins():SceneManager{
        if (!this._ins)
            this._ins = new SceneManager();
        return this._ins;
    }

    private readonly _map:SceneMap;

    private _mainPlayer:ScenePlayer;
    private readonly _players:Array<ScenePlayer> = new Array<ScenePlayer>();

    constructor() {
        this._map = new SceneMap();
        Laya.stage.addChild(this._map);
    }

    public init():void{
        this.addMain();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
    }

    private addMain():void{
        this._mainPlayer = new ScenePlayer();
        this._mainPlayer.init();
        this._players.push(this._mainPlayer);
        this._map.add2dPlayer(this._mainPlayer);
    }

    private onResize():void{
        this._map.onResize();
        this._players.forEach(function (p:ScenePlayer):void {
            p.fix3d();
        });
    }

    // ==============================
    // 点击移动

    private onDown():void{
        Laya.stage.once(Laya.Event.MOUSE_UP, this, this.onUp);
        Laya.stage.once(Laya.Event.MOUSE_OUT, this, this.onUp);
        Laya.timer.loop(1, this, this.frameMove);
    }
    private onUp():void{
        Laya.timer.clear(this, this.frameMove);
    }

    private mousePt:Laya.Point = new Laya.Point();
    private frameMove():void{
        let pt:Laya.Point = this._mainPlayer.localToGlobal(Laya.Point.TEMP.setTo(0, 0));
        this.mousePt.setTo(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);

        let speed:number = 8;
        let rad:number = this.GetRadian( pt, this.mousePt );
        pt.x = Math.cos(rad) * speed;
        pt.y = Math.sin(rad) * speed;

        pt.x = this._mainPlayer.x + pt.x;
        pt.x = Math.max(0, Math.min(pt.x, this._map.W));

        pt.y = this._mainPlayer.y + pt.y;
        pt.y = Math.max(0, Math.min(pt.y, this._map.H));

        this._mainPlayer.setPosition(pt.x, pt.y);
        this._map.lookTarget(pt.x, pt.y);
    }

    private GetAngle( src :Laya.Point, tar :Laya.Point ):number
    {
        return Math.atan2( tar.y-src.y, tar.x-src.x ) * ( 180/Math.PI );
    }

    private GetRadian( src :Laya.Point, tar :Laya.Point ):number
    {
        return Math.PI / 180 * this.GetAngle( src, tar );
    }

    public get mainPlayer():ScenePlayer{
        return this._mainPlayer;
    }

    public get map():SceneMap{
        return this._map;
    }
}