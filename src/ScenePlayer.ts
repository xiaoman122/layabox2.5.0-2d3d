import SceneManager from "./SceneManager";

export default class ScenePlayer extends Laya.Sprite
{
    private _d3:Laya.Sprite3D;
    public init():void
    {
        let s2:Laya.Image = new Laya.Image("res/threeDimen/monkey.png");
        s2.pos(-110>>1, -145);
        this.addChild(s2);

        Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function(layaMonkey) {
            SceneManager.Ins.map.add3dPlayer(layaMonkey);
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            this._d3 = layaMonkey;
            this.fix3d();
        }));
    }

    public fix3d():void{
        if (this._d3){
            let pt:Laya.Point = this.localToGlobal(new Laya.Point());
            let inn:Laya.Vector3 = new Laya.Vector3(pt.x, pt.y, 0);
            let out:Laya.Vector3 = new Laya.Vector3();
            SceneManager.Ins.map.to3DCoord(inn, out);
            this._d3.transform.position = out;
        }
    }

    public setPosition(tox:number, toy:number):void{
        this.pos(tox, toy);
        this.fix3d();
    }
}