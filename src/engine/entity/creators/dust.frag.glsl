precision highp float;

varying vec3 vWorldPos;
varying vec3 vObjPos;

// матрицы
uniform mat4 uModel;
uniform mat4 uModelInv;
uniform mat4 uView;// camera.matrixWorldInverse
uniform mat4 uViewInv;// camera.matrixWorld

// объёмный бокс в object space
uniform vec3 uBoxMin;// например vec3(-10.0)
uniform vec3 uBoxMax;// например vec3(+10.0)

// пыль / свет
uniform float uTime;
uniform vec3 uLightDir;// нормализованный (world)
uniform vec3 uLightColor;// цвет света (напр. vec3(1.0))
uniform vec3 uDustAlbedo;// цвет пыли (напр. vec3(0.9))
uniform float uDensity;// базовая плотность (0..~0.5)
uniform float uNoiseAmp;// амплитуда шума (0..1)
uniform float uNoiseScale;// масштаб шума (напр. 0.5..2.0)
uniform vec3 uWind;// скорость смещения шума (world, напр. vec3(0.2,0.05,0.0))
uniform int uSteps;// 16..48
uniform float uJitter;// 0..1 для шумового джиттера шага
uniform float uAniso;// фаза Хени–Грина, g∈[-0.9,0.9], 0 = изотропно
uniform float uExtinction;// σ_t (0.5..2.0) — «толщина» среды

// ——— утилиты ———
// дешевый 3D value noise (достаточно для пыли)
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453123);}
float valueNoise(vec3 p){
    vec3 i=floor(p),f=fract(p);
    vec3 u=f*f*(3.-2.*f);
    float n000=hash(i+vec3(0,0,0));
    float n100=hash(i+vec3(1,0,0));
    float n010=hash(i+vec3(0,1,0));
    float n110=hash(i+vec3(1,1,0));
    float n001=hash(i+vec3(0,0,1));
    float n101=hash(i+vec3(1,0,1));
    float n011=hash(i+vec3(0,1,1));
    float n111=hash(i+vec3(1,1,1));
    float nx00=mix(n000,n100,u.x);
    float nx10=mix(n010,n110,u.x);
    float nx01=mix(n001,n101,u.x);
    float nx11=mix(n011,n111,u.x);
    float nxy0=mix(nx00,nx10,u.y);
    float nxy1=mix(nx01,nx11,u.y);
    return mix(nxy0,nxy1,u.z);
}
// простая fBm
float fbm(vec3 p){
    float a=.5,s=0.;
    for(int i=0;i<4;i++){s+=a*valueNoise(p);p*=2.02;a*=.5;}
    return s;
}
// фаза Хени–Грина (анизотропия рассеяния)
float hg(float cosTheta,float g){
    float g2=g*g;
    return(1.-g2)/pow(1.+g2-2.*g*cosTheta,1.5)*.25;// нормировка ~1/(4π)
}

// пересечение луча с AABB (object space). возвращает t0,t1, ok
bool rayBox(vec3 ro,vec3 rd,vec3 bmin,vec3 bmax,out float t0,out float t1){
    vec3 inv=1./rd;
    vec3 tmin=(bmin-ro)*inv;
    vec3 tmax=(bmax-ro)*inv;
    vec3 t1v=min(tmin,tmax);
    vec3 t2v=max(tmin,tmax);
    t0=max(max(t1v.x,t1v.y),t1v.z);
    t1=min(min(t2v.x,t2v.y),t2v.z);
    return t1>max(t0,0.);
}

void main(){
    
    // камера в world & object space
    vec3 camWorld=(uViewInv*vec4(0.,0.,0.,1.)).xyz;
    vec3 worldPos=vWorldPos;
    vec3 worldDir=normalize(worldPos-camWorld);
    
    // перевод луча в object space
    vec3 ro=(uModelInv*vec4(camWorld,1.)).xyz;
    vec3 rd=normalize((uModelInv*vec4(worldDir,0.)).xyz);
    
    // пересечение с AABB объёма
    float t0,t1;
    if(!rayBox(ro,rd,uBoxMin,uBoxMax,t0,t1))discard;
    
    // стартовая точка в объёме + длина луча
    float len=t1-max(t0,0.);
    if(len<=0.)discard;
    
    // шаги
    int STEPS=uSteps;
    float dt=len/float(STEPS);
    
    // джиттер шага (уменьшает полосы)
    float seed=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
    float jitter=(seed*2.-1.)*uJitter*dt;
    
    vec3 accum=vec3(0.);
    float trans=1.;// трансмиссия (Beer-Lambert)
    
    // свет в object space для угла рассеяния
    vec3 Lw=normalize(uLightDir);// world
    vec3 Lo=normalize((uModelInv*vec4(Lw,0.)).xyz);
    vec3 Vo=normalize(-rd);// к камере (object)
    
    // марш
    float t=max(t0,0.)+jitter;
    for(int i=0;i<256;i++){
        if(i>=STEPS)break;
        vec3 p=ro+rd*t;// точка в object space
        
        // позиция в world для анимации ветром
        vec3 pw=(uModel*vec4(p,1.)).xyz;
        vec3 windShift=uWind*uTime;
        float n=fbm((pw+windShift)*uNoiseScale);// 0..~1
        // float dens=max(0.,uDensity+uNoiseAmp*(n-.5));// локальная плотность
        float dens=uDensity*pow(n,2.);
        // float dens=uDensity*smoothstep(.6,1.,n);
        
        // освещённость + фаза (без теней)
        float cosTheta=dot(Lo,Vo);
        float phase=hg(cosTheta,uAniso);// 0..~1
        vec3 scatterCol=uLightColor*uDustAlbedo*phase;
        
        // Beer-Lambert
        float sigma_t=uExtinction*dens;// поглощение+рассеяние
        float absorb=exp(-sigma_t*dt);// dT
        vec3 s=scatterCol*sigma_t*dt;// добавочная энергия
        
        accum+=trans*s;// накопить
        trans*=absorb;// уменьшить прозрачность
        
        if(trans<.01)break;// ранний выход
        t+=dt;
    }
    
    // итог — premultiplied (1 - trans) как альфа
    float alpha=clamp(1.-trans,0.,1.);
    gl_FragColor=vec4(accum,alpha);
    
    // depthTest включён, depthWrite = false — объём правильно «за» геометрией.
}