var loaderButton : GUITexture;
var achievementButton : GUITexture;
var leaderBoardButton : GUITexture;

private var loaded : boolean = false;

// -9.25
private var shouldAnimate : boolean = false;
private var achievementTargetX : float = -9.07;
private var leaderBoardTargetX : float = -9.43;
private var achievementAnimateVelocity : float;
private var leaderBoardAnimateVelocity : float;
private var animateTime : float = 0.3;

function Start () {
	
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_START);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_ACHIEVEMENTS);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.TOUCH_LEADERBOARD);
	
	if(GameCenterBinding.isGameCenterAvailable()) {
		GameCenterBinding.authenticateLocalPlayer();
	}
}

function Update() {
	
	AnimateButtons();

	if (!loaded) {
		CheckLoaded();
	}
	
	if (shouldAnimate) {
		AnimateButtons();
	}
	
}

function OnTouchAchievements () {
	if(!loaded)
		return;
	GameCenterBinding.showAchievements();
}

function OnTouchLeaderboard () {
	if(!loaded)
		return;
	GameCenterBinding.showLeaderboardWithTimeScope(GameCenterLeaderboardTimeScope.AllTime);
}

function CheckLoaded() {
	loaded = GameCenterBinding.isPlayerAuthenticated();
	
	if (loaded) {
		loaderButton.enabled = false;
		shouldAnimate = true;
	}
}

function AnimateButtons() {

	var achievementCurrentX : float = achievementButton.transform.localPosition.x;
	//Debug.Log("Achievement current x is " + achievementCurrentX);
	//return;
	achievementButton.transform.localPosition.x = Mathf.SmoothDamp(achievementCurrentX, achievementTargetX, achievementAnimateVelocity, animateTime);
	
	var leaderBoardCurrentX : float = leaderBoardButton.transform.localPosition.x;
	leaderBoardButton.transform.localPosition.x = Mathf.SmoothDamp(leaderBoardCurrentX, leaderBoardTargetX, leaderBoardAnimateVelocity, animateTime);
}

function OnGameStart() {
	shouldAnimate = false;
	achievementButton.enabled = false;
	leaderBoardButton.enabled = false;
	loaderButton.enabled = false;
}