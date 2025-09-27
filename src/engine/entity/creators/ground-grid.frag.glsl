
precision highp float;

varying vec2 vUv;

// Матрицы — все прокидываешь сам из JS
uniform mat4 uProjectionInv;// camera.projectionMatrixInverse
uniform mat4 uViewInv;// camera.matrixWorld
uniform mat4 uProjection;// camera.projectionMatrix
uniform mat4 uView;// camera.matrixWorldInverse

// Параметры
uniform float cellSize;// 1.0
uniform float majorEvery;// 10.0
uniform float minorPx;// 1.0 (px)
uniform float majorPx;// 2.0 (px)
uniform float fadeStart;// 600.0
uniform float fadeEnd;// 1200.0

uniform vec3 lineColor;// цвет линий (напр. 0.62,0.68,0.78)
uniform vec3 axisColor;// цвет осей (0.95,0.35,0.35)

// Точечный «свет» (в мировых координатах)
uniform vec3 uLightPos;// позиция света (world)
uniform vec3 uLightColor;// цвет подсветки
uniform float uLightRadius;// радиус влияния (м)
uniform float uLightIntensity;// 0..1 (масштаб влияния)

// 💡 Подсветка КЛЕТКИ, в которой стоит свет
uniform vec3 uCellGlowColor;// цвет заливки клетки
uniform float uCellGlowAlpha;// 0..1 базовая прозрачность заливки
uniform float uCellGlowFeather;// ширина перышка к краям клетки (в долях клетки, напр. 0.08)

// AA-линия: возвращает альфу 0..1 для линий вдоль X/Y
float lineAA1D(float distToLine,float halfWidthUV){
    // рисуем только узкую полосу возле линий: dist=0 на линии
    return 1.-smoothstep(0.,max(1e-6,halfWidthUV),distToLine);
}
float gridAA(vec2 uv,vec2 fw,float thicknessPx){
    // расстояние до ближайшей линии по каждой оси (0 на линии, 0.5 в центре клетки)
    vec2 f=fract(uv);
    vec2 dist=min(f,1.-f);
    
    // половинная толщина линии в UV-единицах (по осям, чтобы держать «px»)
    vec2 halfW=thicknessPx*fw;
    
    float ax=lineAA1D(dist.x,halfW.x);
    float ay=lineAA1D(dist.y,halfW.y);
    return max(ax,ay);// крест из двух полос
}

void main(){
    // Луч из камеры
    vec2 ndc=vUv*2.-1.;
    vec4 clip=vec4(ndc,1.,1.);
    
    vec4 viewPos=uProjectionInv*clip;viewPos/=viewPos.w;
    vec3 rayDirView=normalize(viewPos.xyz);
    
    vec3 camWorld=(uViewInv*vec4(0.,0.,0.,1.)).xyz;
    vec3 rayWorld=normalize((uViewInv*vec4(rayDirView,0.)).xyz);
    
    // Пересечение с y=0
    if(rayWorld.y>=0.)discard;
    float t=-camWorld.y/rayWorld.y;
    if(t<=0.)discard;
    
    vec3 hit=camWorld+rayWorld*t;
    float dist=length(hit-camWorld);
    
    // UV сетки и «размер пикселя» в UV (для AA)
    vec2 uv=hit.xz/max(cellSize,1e-6);
    vec2 fw=fwidth(uv);// обязателен OES_standard_derivatives
    
    // Сетка: мелкая и крупная
    float minorA=gridAA(uv,fw,minorPx);
    float majorA=gridAA(uv/max(majorEvery,1.),fw/max(majorEvery,1.),majorPx);
    float gridA=max(minorA*.6,majorA);
    
    // Фейд по расстоянию (1 рядом → 0 далеко)
    float fade=1.-smoothstep(min(fadeStart,fadeEnd),max(fadeStart,fadeEnd),dist);
    
    // ---- Точечная подсветка линий ----
    // расстояние от точки сетки до источника
    float dLight=length(hit-uLightPos);
    
    // мягкое затухание в радиусе: 1 у источника → 0 на краю
    float lightFalloff=1.-smoothstep(0.,max(1e-6,uLightRadius),dLight);
    
    // итоговая сила подсветки (зажимаем, масштабируем)
    float lightA=clamp(lightFalloff*uLightIntensity,0.,1.);
    
    // базовый цвет линий + «перекраска» к цвету света ближе к источнику
    vec3 lineColLit=mix(lineColor,uLightColor,lightA);
    
    float alpha=gridA*fade;
    
    // Правильная глубина
    vec4 clipHit=uProjection*uView*vec4(hit,1.);
    float ndcZ=clipHit.z/clipHit.w;
    gl_FragDepth=ndcZ*.5+.5;
    
    gl_FragColor=vec4(lineColLit,alpha);
}