
var initiator : GUITexture;
var flashColor : Color;
var fireball : GameObject;
var bombCounter : GUIText;
var distanceToNextBomb : int = 200;
var explosionSound : AudioClip;

private var paused : boolean = false;
private var bombCount  : int = 0;
private var cumulativeBombCount : int = 0;

private var flash : GUITexture;
private var flashAlphaVelocity : float;
private var flashTime : float = 3.0;
private var speedRecoverVelocity : float;

private var Distance;
private var Bombable;

function Start () {

    var tex : Texture2D = new Texture2D ( 1 , 1 );
    tex.SetPixel( 0 , 0 , Color.white );
    tex.Apply();

    var storageGB = new GameObject("Flash");
    storageGB.transform.localScale = new Vector3(1 , 1, -2);

    flash = storageGB.AddComponent(GUITexture);
    flash.pixelInset = new Rect(0 , 0 , Screen.width , Screen.height );
    flash.color = flashColor;
    flash.texture = tex;
    flash.enabled = false;
    
    Distance = fireball.GetComponent("Distance");
    
    UpdateBombLabel();
}

function Update() {

	for (var touch : Touch in Input.touches) {
        if (touch.phase == TouchPhase.Began) {
        	if(initiator.HitTest(touch.position)) {
        		AttemptBomb();
        		return;
        	}
        }
    }
    
    if(Input.GetMouseButtonDown(0)) {
		if(initiator.HitTest(Input.mousePosition)) {
    		AttemptBomb();
    	}
    }
    
    if(flash.enabled) {
    	flash.color.a = Mathf.SmoothDamp(flash.color.a, 0, flashAlphaVelocity, flashTime);
    	Time.timeScale = Mathf.SmoothDamp(Time.timeScale, 1, speedRecoverVelocity, flashTime);
    }
    
    if(Mathf.Floor(Distance.distance / distanceToNextBomb) > cumulativeBombCount) {
    	cumulativeBombCount++;
    	bombCount++;
    	UpdateBombLabel();
    }
	
}	

function AttemptBomb() {

	if (bombCount < 1) {
		return;
	}
	
	audio.PlayOneShot(explosionSound);
	
	bombCount--;
	UpdateBombLabel();

	Flash(flashTime);
	
	Time.timeScale = 0.5;
	Camera.main.animation.Play();
	
	var temp : Temperature = fireball.GetComponent("Temperature");
	temp.TempChange(100, true);
	
	var amount : int;
	
	for(var obj : GameObject in FindObjectsOfType(GameObject)) {
		Bombable = obj.GetComponent("Bombable");
		if(Bombable) {
			amount = Bombable.bombTempChange;
			temp.TempChange(amount, false);
			Bombable.React();
		}
	}
}

function UpdateBombLabel() {
	bombCounter.text = "x" + bombCount;
}

function Flash (duration : float) {
     flash.enabled = true;
     flash.color.a = 1.0;
     Invoke("FadeFlash", 0.1);
     Invoke("RemoveFlash", duration);
}

function FadeFlash () {
	flash.color.a = 0.3;
}

function RemoveFlash () {
    flash.enabled = false;
    Time.timeScale = 1;
}