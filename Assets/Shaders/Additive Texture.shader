Shader "Mobile/2D/Additive Texture" {

	Properties {
	    _MainTex ("Texture", 2D) = ""
	}
	
	SubShader {
	    Tags {Queue = Transparent}
	    Blend One One
	    ZWrite Off
	    Pass {
	        SetTexture[_MainTex]
	    } 
	}

}