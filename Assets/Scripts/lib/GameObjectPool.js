#pragma strict

// A general pool object for reusable game objects.
//
// It supports spawning and unspawning game objects that are
// instantiated from a common prefab. Can be used preallocate
// objects to avoid calls to Instantiate during gameplay. Can
// also create objects on demand (which it does if no objects
// are available in the pool).
class GameObjectPool {
	// The prefab that the game objects will be instantiated from.
	private var prefab : GameObject;
	// The list of available game objects (initially empty by default).
	private var available : Array;
	// The list of all game objects created thus far (used for efficiently 
	// unspawning all of them at once, see UnspawnAll).
	private var all : ArrayList;
	
	// An optional function that will be called whenever a new object is instantiated.
	// The newly instantiated object is passed to it, which allows users of the pool
	// to do custom initialization.
	private var initializationFunction : Function;
	// Indicates whether the pool's game objects should be activated/deactivated
	// recursively (i.e. the game object and all its children) or non-recursively (just the
	// game object).
	private var setActiveRecursively : boolean;
	
	// Creates a pool.
	// The initialCapacity is used to initialize the .NET collections, and determines 
	// how much space they pre-allocate behind the scenes. It does not pre-populate the 
	// collection with game objects. For that, see the PrePopulate function.
	// If an initialCapacity that is <= to zero is provided, the pool uses the default
	// initial capacities of its internal .NET collections.
	function GameObjectPool(prefab : GameObject, initialCapacity : int, setActiveRecursively : boolean){
		this.prefab = prefab;
		if(initialCapacity > 0){
			this.available = [];
			this.all = ArrayList(initialCapacity);
		} else {
			// Use the .NET defaults
			this.available = [];
			this.all = ArrayList();
		}
		
		this.initializationFunction = function (target : GameObject) {
			target.SendMessage("SetPool", this); 
		};
		
		this.setActiveRecursively = setActiveRecursively;
	}
	
	// Spawn a game object with the specified position/rotation.
	function Spawn(position : Vector3, rotation : Quaternion) : GameObject {
		var result : GameObject;
		
		if(available.Count == 0){
			// Create an object and initialize it.
			result = GameObject.Instantiate(prefab, position, rotation) as GameObject;
			if(initializationFunction != null){
				initializationFunction(result);
			}
			// Keep track of it.
			all.Add(result);
		} else {
			//result = available.Pop() as GameObject;
			var i : int = Mathf.Floor(Random.value * available.length);
			result = available[i];
			available.RemoveAt(i);
			// Get the result's transform and reuse for efficiency.
			// Calling gameObject.transform is expensive.
			var resultTrans = result.transform;
			resultTrans.position = position;
			resultTrans.rotation = rotation;
			
			this.SetActive(result, true);
		}
		return result;
	}
	
	// Unspawn the provided game object.
	// The function is idempotent. Calling it more than once for the same game object is 
	// safe, since it first checks to see if the provided object is already unspawned.
	// Returns true if the unspawn succeeded, false if the object was already unspawned.
	function Unspawn(obj : GameObject) : boolean {
		available.Push(obj);
		this.SetActive(obj, false);
		return true; // Object inserted back in stack.
	}
	
	// Pre-populates the pool with the provided number of game objects.
	function PrePopulate(count : int){
		//return;
		var array : GameObject[] = new GameObject[count];
		for(var i = 0; i < count; i++){
			array[i] = Spawn(Vector3.zero, Quaternion.identity);
			this.SetActive(array[i], false);
		}
		for(var j = 0; j < count; j++){
			Unspawn(array[j]);
		}
	}
	
	// Unspawns all the game objects created by the pool.
	function UnspawnAll(){
		for(var i = 0; i < all.Count; i++){
			var obj : GameObject = all[i] as GameObject;
			if(obj.active)
				Unspawn(obj);
		}
	}
	
	// Unspawns all the game objects and clears the pool.
	function Clear(){
		UnspawnAll();
		available.Clear();
		all.Clear();
	}
	
	// Returns the number of active objects.
	function GetActiveCount() : int {
		return all.Count - available.Count;
	}
	
	// Returns the number of available objects.
	function GetAvailableCount() : int {
		return available.Count;
	}
	
	// Returns the prefab being used by this pool.
	function GetPrefab() : GameObject {
		return prefab;
	}
	
	// Applies the provided function to some or all of the pool's game objects.
	function ForEach(func : Function, activeOnly : boolean){
		for(var i = 0; i < all.Count; i++){
			var obj : GameObject = all[i] as GameObject;
			if(!activeOnly || obj.active){
				func(obj);
			}
		}
	}
	
	// Activates or deactivates the provided game object using the method
	// specified by the setActiveRecursively flag.
	private function SetActive(obj : GameObject, val : boolean){
		if(setActiveRecursively)
			obj.SetActiveRecursively(val);
		else
			obj.active = val;
	}
	
	// Generates a generic callback function that sets the pool on the child object
	
}