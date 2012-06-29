Shader "tk2d/LitPremulVertexColor" 
{
	Properties 
	{
	    _MainTex ("Base (RGB)", 2D) = "white" {}
	}
	
	SubShader 
	{
		Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	    Pass 
	    {
			Tags {"LightMode" = "Vertex"}
			LOD 100
	    
			ZWrite Off
			Blend One OneMinusSrcAlpha
			Cull Off
			
			ColorMaterial AmbientAndDiffuse
	        Lighting On
	        
	        SetTexture [_MainTex] 
	        {
	            Combine texture * primary double, texture * primary
	        }
	    }
	}

	Fallback "tk2d/PremulVertexColor", 1
}
