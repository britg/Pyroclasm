#pragma strict

private var streak : int;

private var bookshelf : int = 0;
private var bookshelvesNeeded : int = 20;
private var tapestry : int = 0;
private var tapestriesNeeded : int = 15;
private var gargoyle : int = 0;
private var gargoylesNeeded : int = 10;
private var icicle : int = 0;
private var iciclesNeeded : int = 5;

function Start () {
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.GAME_END);
	NotificationCenter.DefaultCenter().AddObserver(this, Notifications.INTERACTABLE_COLLISION);
}

function OnGameEnd (n : Notification) {

	var score : Hashtable = n.data;
	streak = score["streak"];
	
	UpdateLocal();
	
	if(!GameCenterBinding.isGameCenterAvailable()) return;
	
	UpdateAchievements();
}

function UpdateLocal() {
	var prevStreak : int = PlayerPrefs.GetInt("streak");
	if(streak > prevStreak) {
		PlayerPrefs.SetInt("streak", streak);
	}
}

function UpdateAchievements() {
	
	if(streak >= 1500) {
		Achievement.Report(Achievement.STREAK_TIER3);
	}
	
	if(streak >= 1000) {
		Achievement.Report(Achievement.STREAK_TIER2);
	}
	
	if(streak >= 500) {
		Achievement.Report(Achievement.STREAK_TIER1);
	}

}

function OnInteractableCollision(n : Notification) {
	
	var name : String = n.data;
	name = name.Replace("(Clone)", "");
	
	Debug.Log("Colliding with " + name);
	
	switch(name) {
		case "Icicle":
			icicle++;
		break;
		case "Bookshelf":
			bookshelf++;
		break;
		case "Tapestry":
			tapestry++;
		break;
		case "FountainCollision":
			gargoyle++;
		break;
	}
	
	if(bookshelf == bookshelvesNeeded) {
		Achievement.Report(Achievement.COLLISION_BOOKSHELVES);
	}
	
	if(tapestry == tapestriesNeeded) {
		Achievement.Report(Achievement.COLLISION_TAPESTRIES);
	}
	
	if(gargoyle == gargoylesNeeded) {
		Achievement.Report(Achievement.COLLISION_FOUNTAINS);
	}
	
	if(icicle == iciclesNeeded) {
		Achievement.Report(Achievement.COLLISION_ICICLES);
	}
	
}