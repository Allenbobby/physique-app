import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from './supabase.js';

// ── FONTS & STYLES ────────────────────────────────────────────
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap";
document.head.appendChild(_fl);

const _st = document.createElement("style");
_st.textContent = `
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  ::-webkit-scrollbar{display:none;}
  body{margin:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  @keyframes slideRight{from{transform:translateX(-20px);opacity:0;}to{transform:translateX(0);opacity:1;}}
  @keyframes popIn{0%{transform:scale(.85);opacity:0;}80%{transform:scale(1.03);}100%{transform:scale(1);opacity:1;}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  .fu{animation:fadeUp .4s ease both;}
  .fi{animation:fadeIn .3s ease both;}
  .pi{animation:popIn .35s ease both;}
  .sr{animation:slideRight .3s ease both;}
  input,select,textarea{outline:none;font-family:inherit;}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
`;
document.head.appendChild(_st);

// ── THEME ────────────────────────────────────────────────────
const T = {
  bg:"#050508", card:"#0c0c14", card2:"#111120",
  border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.12)",
  text:"#f0f0f5", muted:"#52525e", dim:"rgba(255,255,255,0.04)",
  accent:"#6c63ff", green:"#00d4aa", red:"#ff4b6e",
  gold:"#ffc93c", blue:"#3b9eff", purple:"#b066ff",
  orange:"#ff8c42",
};

// ── NUTRITION DB (per 100g/100ml) ────────────────────────────
const FOOD_DB = [
  // Proteins
  {n:"Chicken Breast (grilled)",cal:165,p:31,c:0,f:3.6,unit:"g",cat:"🍗 Protein"},
  {n:"Chicken Thigh",cal:209,p:26,c:0,f:11,unit:"g",cat:"🍗 Protein"},
  {n:"Eggs (whole)",cal:155,p:13,c:1.1,f:11,unit:"g",cat:"🍗 Protein"},
  {n:"Egg White",cal:52,p:11,c:.7,f:.2,unit:"g",cat:"🍗 Protein"},
  {n:"Paneer",cal:265,p:18,c:1.2,f:20,unit:"g",cat:"🍗 Protein"},
  {n:"Salmon",cal:208,p:20,c:0,f:13,unit:"g",cat:"🍗 Protein"},
  {n:"Tuna (canned)",cal:116,p:26,c:0,f:1,unit:"g",cat:"🍗 Protein"},
  {n:"Fish (rohu/katla)",cal:97,p:17,c:0,f:2.7,unit:"g",cat:"🍗 Protein"},
  {n:"Whey Protein",cal:400,p:80,c:8,f:5,unit:"g",cat:"🍗 Protein"},
  {n:"Soya Chunks (dry)",cal:345,p:52,c:33,f:.5,unit:"g",cat:"🍗 Protein"},
  {n:"Tofu",cal:76,p:8,c:1.9,f:4.8,unit:"g",cat:"🍗 Protein"},
  // Indian Meals
  {n:"Chicken Biryani",cal:200,p:12,c:25,f:5,unit:"g",cat:"🍛 Indian"},
  {n:"Mutton Biryani",cal:230,p:13,c:24,f:8,unit:"g",cat:"🍛 Indian"},
  {n:"Veg Biryani",cal:170,p:4,c:30,f:4,unit:"g",cat:"🍛 Indian"},
  {n:"Dal Makhani",cal:130,p:6,c:16,f:5,unit:"g",cat:"🍛 Indian"},
  {n:"Dal Tadka",cal:116,p:7,c:18,f:2,unit:"g",cat:"🍛 Indian"},
  {n:"Chana Masala",cal:164,p:9,c:27,f:3,unit:"g",cat:"🍛 Indian"},
  {n:"Rajma (cooked)",cal:127,p:8.7,c:22,f:.5,unit:"g",cat:"🍛 Indian"},
  {n:"Palak Paneer",cal:150,p:7,c:6,f:11,unit:"g",cat:"🍛 Indian"},
  {n:"Butter Chicken",cal:164,p:15,c:6,f:9,unit:"g",cat:"🍛 Indian"},
  {n:"Chicken Curry",cal:150,p:14,c:4,f:8,unit:"g",cat:"🍛 Indian"},
  {n:"Egg Bhurji",cal:185,p:13,c:3,f:13,unit:"g",cat:"🍛 Indian"},
  {n:"Aloo Gobi",cal:80,p:2.5,c:12,f:2.5,unit:"g",cat:"🍛 Indian"},
  {n:"Sambar",cal:55,p:3,c:9,f:.8,unit:"g",cat:"🍛 Indian"},
  {n:"Idli (1 piece ~40g)",cal:39,p:2,c:8,f:.4,unit:"g",cat:"🍛 Indian"},
  {n:"Dosa (plain)",cal:168,p:3.9,c:30,f:3.7,unit:"g",cat:"🍛 Indian"},
  {n:"Poha",cal:130,p:2.7,c:27,f:1,unit:"g",cat:"🍛 Indian"},
  {n:"Upma",cal:150,p:3.5,c:25,f:4,unit:"g",cat:"🍛 Indian"},
  {n:"Pav Bhaji",cal:180,p:4,c:28,f:6,unit:"g",cat:"🍛 Indian"},
  {n:"Paratha (plain)",cal:260,p:6,c:36,f:10,unit:"g",cat:"🍛 Indian"},
  {n:"Paratha (aloo)",cal:280,p:5,c:40,f:11,unit:"g",cat:"🍛 Indian"},
  {n:"Khichdi",cal:120,p:4,c:22,f:2,unit:"g",cat:"🍛 Indian"},
  {n:"Chole Bhature",cal:350,p:9,c:50,f:13,unit:"g",cat:"🍛 Indian"},
  // Carbs
  {n:"White Rice (cooked)",cal:130,p:2.7,c:28,f:.3,unit:"g",cat:"🌾 Carbs"},
  {n:"Brown Rice (cooked)",cal:112,p:2.3,c:23,f:.9,unit:"g",cat:"🌾 Carbs"},
  {n:"Roti / Chapati",cal:297,p:9,c:60,f:3.7,unit:"g",cat:"🌾 Carbs"},
  {n:"Oats",cal:389,p:17,c:66,f:7,unit:"g",cat:"🌾 Carbs"},
  {n:"Bread (whole grain)",cal:247,p:9,c:43,f:4.2,unit:"g",cat:"🌾 Carbs"},
  {n:"Sweet Potato",cal:86,p:1.6,c:20,f:.1,unit:"g",cat:"🌾 Carbs"},
  {n:"Potato (boiled)",cal:87,p:1.9,c:20,f:.1,unit:"g",cat:"🌾 Carbs"},
  {n:"Pasta (cooked)",cal:158,p:6,c:31,f:.9,unit:"g",cat:"🌾 Carbs"},
  // Dairy
  {n:"Whole Milk",cal:61,p:3.2,c:4.8,f:3.3,unit:"ml",cat:"🥛 Dairy"},
  {n:"Curd / Dahi",cal:61,p:3.5,c:4.7,f:3.3,unit:"ml",cat:"🥛 Dairy"},
  {n:"Greek Yogurt",cal:59,p:10,c:3.6,f:.4,unit:"g",cat:"🥛 Dairy"},
  {n:"Buttermilk (chaas)",cal:40,p:3.3,c:4.8,f:.9,unit:"ml",cat:"🥛 Dairy"},
  {n:"Lassi (sweet)",cal:98,p:3.5,c:15,f:3,unit:"ml",cat:"🥛 Dairy"},
  // Fruits
  {n:"Banana",cal:89,p:1.1,c:23,f:.3,unit:"g",cat:"🍎 Fruits"},
  {n:"Apple",cal:52,p:.3,c:14,f:.2,unit:"g",cat:"🍎 Fruits"},
  {n:"Mango",cal:60,p:.8,c:15,f:.4,unit:"g",cat:"🍎 Fruits"},
  {n:"Papaya",cal:43,p:.5,c:11,f:.3,unit:"g",cat:"🍎 Fruits"},
  {n:"Orange",cal:47,p:.9,c:12,f:.1,unit:"g",cat:"🍎 Fruits"},
  {n:"Watermelon",cal:30,p:.6,c:7.6,f:.2,unit:"g",cat:"🍎 Fruits"},
  // Fats & Nuts
  {n:"Peanut Butter",cal:588,p:25,c:20,f:50,unit:"g",cat:"🥜 Fats"},
  {n:"Almonds",cal:579,p:21,c:22,f:50,unit:"g",cat:"🥜 Fats"},
  {n:"Peanuts",cal:567,p:26,c:16,f:49,unit:"g",cat:"🥜 Fats"},
  {n:"Walnuts",cal:654,p:15,c:14,f:65,unit:"g",cat:"🥜 Fats"},
  {n:"Cashews",cal:553,p:18,c:30,f:44,unit:"g",cat:"🥜 Fats"},
  {n:"Ghee",cal:900,p:0,c:0,f:100,unit:"ml",cat:"🥜 Fats"},
  {n:"Olive Oil",cal:884,p:0,c:0,f:100,unit:"ml",cat:"🥜 Fats"},
  // Drinks
  {n:"Coffee (black)",cal:2,p:.3,c:0,f:0,unit:"ml",cat:"☕ Drinks"},
  {n:"Chai (milk+sugar)",cal:50,p:1.5,c:7,f:1.5,unit:"ml",cat:"☕ Drinks"},
  {n:"Coconut Water",cal:19,p:.7,c:3.7,f:.2,unit:"ml",cat:"☕ Drinks"},
  // Snacks
  {n:"Boiled Chana",cal:164,p:8.9,c:27,f:2.6,unit:"g",cat:"🍿 Snacks"},
  {n:"Sprouts (mixed)",cal:62,p:4.3,c:11,f:.4,unit:"g",cat:"🍿 Snacks"},
  {n:"Roasted Makhana",cal:347,p:9.7,c:76,f:.1,unit:"g",cat:"🍿 Snacks"},
  {n:"Protein Bar (avg)",cal:200,p:20,c:22,f:7,unit:"g",cat:"🍿 Snacks"},
]

// ── WORKOUT TEMPLATES ────────────────────────────────────────
const WO_TEMPLATES = {
  beginner: {
    name:"5-Day Beginner Split", days:[
      {d:"Mon",f:"Chest + Triceps",tag:"PUSH",ex:["Bench Press 3×10","Incline DB Press 3×10","Cable Flyes 3×12","Tricep Pushdown 3×12","Overhead Ext 3×12"]},
      {d:"Tue",f:"Back + Biceps",tag:"PULL",ex:["Lat Pulldown 4×10","Seated Row 3×10","DB Row 3×10","Barbell Curl 3×12","Hammer Curl 3×12"]},
      {d:"Wed",f:"Rest + Cardio",tag:"REST",ex:["20 min walk","Stretching","Foam roll"]},
      {d:"Thu",f:"Shoulders + Core",tag:"PUSH",ex:["OHP 3×10","Lateral Raise 4×15","Front Raise 3×12","Plank 3×45s","Crunches 3×20"]},
      {d:"Fri",f:"Legs",tag:"LEGS",ex:["Squat 3×10","Leg Press 3×12","Leg Curl 3×12","Leg Ext 3×12","Calf Raises 4×20"]},
      {d:"Sat",f:"Arms + Abs",tag:"ARMS",ex:["EZ Curl 3×12","Preacher Curl 3×12","Skull Crushers 3×12","Dips 2×failure","Plank 3×60s"]},
      {d:"Sun",f:"Full Rest",tag:"REST",ex:["Sleep 8+ hrs","Eat your macros","Recover"]},
    ]
  },
  intermediate: {
    name:"6-Day PPL", days:[
      {d:"Mon",f:"Push — Heavy",tag:"PUSH",ex:["Bench Press 5×5","Incline Press 4×8","OHP 4×8","Lateral Raise 5×15","Tricep Dips 3×failure"]},
      {d:"Tue",f:"Pull — Heavy",tag:"PULL",ex:["Deadlift 5×5","Weighted Pull-ups 4×6","Barbell Row 4×8","Face Pull 4×15","Barbell Curl 4×10"]},
      {d:"Wed",f:"Legs — Heavy",tag:"LEGS",ex:["Squat 5×5","Romanian DL 4×8","Leg Press 5×10","Leg Curl 4×12","Calf Raises 5×20"]},
      {d:"Thu",f:"Push — Volume",tag:"PUSH",ex:["DB Bench 4×12","Cable Flyes 4×15","Lateral Raise 6×15","Arnold Press 4×12","Cable Pushdown 4×15"]},
      {d:"Fri",f:"Pull — Volume",tag:"PULL",ex:["Lat Pulldown 4×12","Seated Row 4×12","Incline Curl 4×12","Rear Delt Fly 4×15","Face Pull 3×15"]},
      {d:"Sat",f:"Legs + Arms",tag:"BOTH",ex:["Hack Squat 4×12","Walking Lunges 3×20","EZ Curl 5×12","Skull Crushers 4×12","Cable Curl 3×15"]},
      {d:"Sun",f:"Full Rest",tag:"REST",ex:["Sleep 8+ hrs","Eat macros","Recovery"]},
    ]
  },
  cut: {
    name:"Cut Phase — 6 Day", days:[
      {d:"Mon",f:"Upper Heavy",tag:"UPPER",ex:["Bench Press 4×5","Weighted Pull-ups 4×6","OHP 4×6","Barbell Row 4×6","Superset Curl+Pushdown 4×12"]},
      {d:"Tue",f:"HIIT Cardio",tag:"CARDIO",ex:["10 min warmup","20 min 30s sprint/30s walk","10 min cooldown","Abs 3×"]},
      {d:"Wed",f:"Lower Heavy",tag:"LOWER",ex:["Squat 4×5","RDL 4×6","Leg Press 4×10","Leg Curl 3×12","Calf Raises 5×20"]},
      {d:"Thu",f:"Cardio + Core",tag:"CARDIO",ex:["35 min steady run","Plank 5×60s","Leg Raises 4×15","Russian Twists 3×20"]},
      {d:"Fri",f:"Full Body",tag:"FULL",ex:["Deadlift 4×4","Incline Press 3×8","Lat Pulldown 4×10","Lunges 3×12","Face Pull 3×15"]},
      {d:"Sat",f:"LISS + Shoulders",tag:"CARDIO",ex:["45 min jog/walk","Lateral Raise 6×20","Face Pull 5×20","Rear Delt Fly 4×15"]},
      {d:"Sun",f:"Full Rest",tag:"REST",ex:["Sleep 8+ hrs","Hit protein","Light walk"]},
    ]
  },
};

const GOAL_LOOKS = [
  {id:"lean_athletic",label:"Lean & Athletic",desc:"Low body fat, visible abs, defined muscles",bf:"8-12%",icon:"⚡"},
  {id:"big_muscular",label:"Big & Muscular",desc:"Maximum size, thick everywhere, imposing",bf:"14-18%",icon:"💪"},
  {id:"shredded",label:"Shredded",desc:"Competition-ready, veins, paper-thin skin",bf:"5-8%",icon:"🔥"},
  {id:"toned",label:"Toned & Fit",desc:"Healthy, some definition, athletic build",bf:"12-18%",icon:"🏃"},
  {id:"bulk_cut",label:"Bulk then Cut",desc:"Build max size then reveal with a cut",bf:"10-12%",icon:"📈"},
];

// ── HELPERS ──────────────────────────────────────────────────
// Local storage fallback (used for workout/supplement state only)
const local = {
  async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch{}},
  async del(k){try{await window.storage.delete(k);}catch{}},
};

function calcBMR(w,h,age,gender="male"){
  return gender==="male" ? 10*w+6.25*h-5*age+5 : 10*w+6.25*h-5*age-161;
}
function calcNutrition(w,h,age,gender,goal){
  const bmr=calcBMR(w,h,age,gender);
  const tdee=Math.round(bmr*1.55);
  const surplus = goal==="cut"?-400:goal==="aggressive"?500:300;
  const cals=tdee+surplus;
  const protein=goal==="cut"?Math.round(w*2.6):Math.round(w*2.2);
  const fats=goal==="cut"?Math.round(w*.8):Math.round(w*1);
  const carbs=Math.max(0,Math.round((cals-protein*4-fats*9)/4));
  return {tdee,cals:Math.round(cals),surplus,protein,carbs,fats};
}
function bmi(w,h){return(w/((h/100)**2)).toFixed(1);}
function monthsToGoal(curr,goal,phase){
  const diff=Math.abs(goal-curr);
  const rate=phase==="cut"?1.2:phase==="aggressive"?2.2:1.5;
  return Math.ceil(diff/rate);
}
function isGoalRealistic(profile){
  const currentWeight=parseFloat(pm_currentWeight)||70;
  const goalWeight=parseFloat(pm_goalWeight)||75;
  const durationMonths=parseInt(pm_durationMonths)||12;
  const diff=goalWeight-currentWeight;
  const isCut=diff<0;
  const maxGainPerMonth=2.2, maxLossPerMonth=1.5;
  const rawMax=isCut ? currentWeight - maxLossPerMonth*durationMonths : currentWeight + maxGainPerMonth*durationMonths;
  const maxPossible=parseFloat(rawMax.toFixed(1));
  const feasible=isCut ? goalWeight>=maxPossible : goalWeight<=maxPossible;
  const minMonths=Math.ceil(Math.abs(diff)/(isCut?maxLossPerMonth:maxGainPerMonth));
  return {feasible, minMonths, maxPossible, isCut};
}

const DAYS_SHORT=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTHS_SHORT=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getWeekDates(weekOffset=0){
  const today=new Date();
  const dow=today.getDay()===0?6:today.getDay()-1;
  const monday=new Date(today);
  monday.setDate(today.getDate()-dow+weekOffset*7);
  return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});
}

// ── UI PRIMITIVES ────────────────────────────────────────────
const Spinner=()=><div style={{width:20,height:20,border:`2px solid ${T.border2}`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;

function Ring({pct=0,color=T.accent,size=72,stroke=7,children}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,dash=circ*Math.min(pct/100,1);
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"22"} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray .6s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        {children}
      </div>
    </div>
  );
}

function LineChart({data=[],color=T.accent,height=120,label=""}){
  if(data.length<2)return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontSize:12}}>Log more data to see chart</div>;
  const vals=data.map(d=>d.v);
  const min=Math.min(...vals)-1, max=Math.max(...vals)+1;
  const range=max-min||1;
  const w=300,h=height;
  const pts=data.map((d,i)=>({
    x:i/(data.length-1)*(w-20)+10,
    y:h-(((d.v-min)/range)*(h-20)+10),
  }));
  const path="M"+pts.map(p=>`${p.x},${p.y}`).join(" L");
  const area=path+` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  return(
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height,overflow:"visible"}}>
        <defs>
          <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#g${color.replace("#","")})`}/>
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={T.card} stroke={color} strokeWidth="2"/>
        ))}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        {data.filter((_,i)=>i===0||i===data.length-1||i===Math.floor(data.length/2)).map((d,i)=>(
          <span key={i} style={{fontSize:10,color:T.muted}}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function BarChart({data=[],color=T.accent,height=80}){
  if(!data.length)return null;
  const max=Math.max(...data.map(d=>d.v),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:`linear-gradient(180deg,${color},${color}88)`,height:`${(d.v/max)*height*.8}px`,minHeight:d.v?3:0,transition:"height .4s ease"}}/>
          <span style={{fontSize:9,color:T.muted,textAlign:"center",lineHeight:1}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const Card=({children,style={},color,onClick,className=""})=>(
  <div onClick={onClick} className={className} style={{
    background:T.card,border:`1px solid ${color?color+"28":T.border}`,
    borderRadius:18,padding:18,...style,cursor:onClick?"pointer":"default",
  }}>{children}</div>
);

const Pill=({children,color=T.accent,size="sm"})=>(
  <span style={{fontSize:size==="sm"?10:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",
    background:color+"1a",color,padding:size==="sm"?"3px 9px":"5px 14px",borderRadius:999}}>{children}</span>
);

function Input({label,value,onChange,placeholder,type="text",step,options,required}){
  return(
    <div style={{marginBottom:14}}>
      {label&&<div style={{fontSize:11,color:T.muted,marginBottom:6,letterSpacing:.5}}>{label}{required&&<span style={{color:T.red}}> *</span>}</div>}
      {options?(
        <select value={value} onChange={onChange} style={{width:"100%",background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"11px 14px",color:value?T.text:T.muted,fontFamily:"inherit",fontSize:14}}>
          <option value="">{placeholder||"Select..."}</option>
          {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
        </select>
      ):(
        <input value={value} onChange={onChange} placeholder={placeholder} type={type} step={step}
          style={{width:"100%",background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"11px 14px",color:T.text,fontFamily:"inherit",fontSize:14}}/>
      )}
    </div>
  );
}

function GlowBtn({children,onClick,color=T.accent,disabled,style={}}){
  return(
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"rgba(255,255,255,0.05)":`linear-gradient(135deg,${color},${color}cc)`,
      color:disabled?T.muted:"#fff",border:"none",borderRadius:14,padding:"13px 22px",
      fontFamily:"inherit",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",width:"100%",
      boxShadow:disabled?"none":`0 4px 20px ${color}33`,transition:"all .2s",...style,
    }}>{children}</button>
  );
}

// ── GOAL VALIDATOR COMPONENT ─────────────────────────────────
function GoalValidator({profile,onAccept,onRevise}){
  const result=isGoalRealistic(profile);
  const diff=parseFloat(pm_goalWeight)-parseFloat(pm_currentWeight);
  const viable=result.feasible;
  const suggestedDuration=result.minMonths;

  return(
    <div className="fu" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:48,marginBottom:8}}>{viable?"✅":"⚠️"}</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,color:viable?T.green:T.gold,margin:"0 0 6px"}}>{viable?"Goal is Achievable!":"Goal Needs Adjustment"}</h2>
        <p style={{color:T.muted,fontSize:13,margin:0}}>Here's your honest assessment</p>
      </div>

      <Card style={{marginBottom:14}} color={viable?T.green:T.gold}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {l:"Start Weight",v:`${pm_currentWeight} kg`},
            {l:"Goal Weight",v:`${pm_goalWeight} kg`},
            {l:"Change Needed",v:`${diff>0?"+":""}${diff} kg`,c:diff>0?T.blue:T.red},
            {l:"Your Duration",v:`${pm_durationMonths} months`},
            {l:"Min Needed",v:`${suggestedDuration} months`,c:parseInt(pm_durationMonths)>=suggestedDuration?T.green:T.red},
            {l:"Max Possible",v:`${result.maxPossible} kg`,c:T.accent},
          ].map(s=>(
            <div key={s.l} style={{textAlign:"center",padding:"10px",background:T.dim,borderRadius:12}}>
              <div style={{fontSize:16,fontWeight:800,color:s.c||T.text}}>{s.v}</div>
              <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      {!viable&&(
        <Card style={{marginBottom:14,background:"rgba(255,196,60,.06)"}} color={T.gold}>
          <div style={{fontSize:11,color:T.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Viable Alternative</div>
          <p style={{fontSize:13,color:"#ffe08a",margin:"0 0 12px",lineHeight:1.6}}>
            In <strong>{pm_durationMonths} months</strong>, you can realistically reach <strong>{result.maxPossible} kg</strong> — not {pm_goalWeight} kg.<br/><br/>
            To hit {pm_goalWeight} kg, you need at least <strong>{suggestedDuration} months</strong>.
          </p>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onRevise("goalWeight",result.maxPossible.toString())} style={{flex:1,background:"rgba(255,196,60,.15)",border:`1px solid ${T.gold}44`,borderRadius:12,padding:"10px",color:T.gold,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Use {result.maxPossible} kg
            </button>
            <button onClick={()=>onRevise("durationMonths",suggestedDuration.toString())} style={{flex:1,background:"rgba(255,196,60,.15)",border:`1px solid ${T.gold}44`,borderRadius:12,padding:"10px",color:T.gold,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Extend to {suggestedDuration}mo
            </button>
          </div>
        </Card>
      )}

      <Card style={{marginBottom:20}} color={T.accent}>
        <div style={{fontSize:11,color:T.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Your Projected Plan</div>
        {[
          {l:"Phase",v:result.isCut?"Cutting (calorie deficit)":"Bulking then Cut",c:result.isCut?T.green:T.blue},
          {l:"Weekly change",v:result.isCut?"~0.3-0.5kg loss":"~0.4-0.6kg gain",c:T.text},
          {l:"Workout split",v:parseInt(pm_durationMonths)>=12?"PPL 6-day":"5-day split",c:T.text},
          {l:"Goal look",v:GOAL_LOOKS.find(g=>g.id===pm_goalLook)?.label||pm_goalLook,c:T.accent},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.muted}}>{s.l}</span>
            <span style={{fontSize:13,fontWeight:600,color:s.c}}>{s.v}</span>
          </div>
        ))}
      </Card>

      <GlowBtn onClick={onAccept} color={viable?T.green:T.accent}>
        {viable?"Let's Go! Build My Plan →":"Accept & Build Plan →"}
      </GlowBtn>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("loading");
  const [authMode,setAuthMode]=useState("login");
  const [tab,setTab]=useState("home");
  const [currentUser,setCurrentUser]=useState(null); // supabase user object
  const [userProfile,setUserProfile]=useState(null); // profile from DB

  // Setup wizard
  const [setupStep,setSetupStep]=useState(0);
  const [setupProfile,setSetupProfile]=useState({name:"",email:"",password:"",height:"",currentWeight:"",goalWeight:"",goalLook:"lean_athletic",durationMonths:"12",age:"",gender:"male",activityLevel:"moderate"});
  const [showValidator,setShowValidator]=useState(false);

  // Auth form
  const [authForm,setAuthForm]=useState({email:"",password:""});
  const [authError,setAuthError]=useState("");

  // Data
  const [weightLog,setWeightLog]=useState([]);
  const [foodLog,setFoodLog]=useState([]);
  const [prs,setPrs]=useState({});
  const [measures,setMeasures]=useState([]);
  const [doneEx,setDoneEx]=useState({});
  const [doneSupps,setDoneSupps]=useState({});

  // UI state
  const [weekOffset,setWeekOffset]=useState(0);
  const [selectedDay,setSelectedDay]=useState(null);
  const [foodSearch,setFoodSearch]=useState("");
  const [foodCat,setFoodCat]=useState("All");
  const [foodQty,setFoodQty]=useState("100");
  const [selectedFood,setSelectedFood]=useState(null);
  const [newWeight,setNewWeight]=useState("");
  const [prLift,setPrLift]=useState("Bench Press");
  const [prW,setPrW]=useState("");
  const [prR,setPrR]=useState("");
  const [aiInput,setAiInput]=useState("");
  const [aiHistory,setAiHistory]=useState([]);
  const [aiLoading,setAiLoading]=useState(false);
  const [measureInput,setMeasureInput]=useState({});
  const chatRef=useRef(null);

  // ── Supabase Auth + Data Load ──────────────────────────────
  useEffect(()=>{
    // Check if user is already logged in
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        setCurrentUser(session.user);
        loadUserData(session.user.id);
        setScreen("app");
      } else {
        setScreen("auth");
      }
    });
    // Listen for auth changes (login/logout)
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session)=>{
      if(session?.user){
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setScreen("auth");
      }
    });
    return ()=> subscription.unsubscribe();
  },[]);

  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[aiHistory]);

  async function loadUserData(uid){
    try{
      // Load profile
      const {data:prof} = await supabase.from("profiles").select("*").eq("id",uid).single();
      if(prof) setUserProfile(prof);

      // Load weight log
      const {data:wl} = await supabase.from("weight_log").select("*").eq("user_id",uid).order("logged_at");
      if(wl) setWeightLog(wl.map(w=>({date:w.logged_at,weight:w.weight,id:w.id})));

      // Load food log
      const {data:fl} = await supabase.from("food_log").select("*").eq("user_id",uid).order("logged_at");
      if(fl) setFoodLog(fl.map(f=>({...f,date:f.logged_at})));

      // Load PRs
      const {data:prData} = await supabase.from("prs").select("*").eq("user_id",uid).order("logged_at");
      if(prData){
        const prMap={};
        prData.forEach(p=>{ if(!prMap[p.lift]) prMap[p.lift]=[]; prMap[p.lift].push({weight:p.weight,reps:p.reps,date:p.logged_at,id:p.id}); });
        setPrs(prMap);
      }

      // Load measurements
      const {data:ms} = await supabase.from("measurements").select("*").eq("user_id",uid).order("logged_at");
      if(ms) setMeasures(ms.map(m=>({...m.data,date:m.logged_at,id:m.id})));

      // Load local-only state (workout ticks, supp ticks, ai chat)
      const de=await local.get(`doneEx_${uid}`)||{};
      const ds=await local.get(`doneSupps_${uid}`)||{};
      const ah=await local.get(`ai_${uid}`)||[];
      setDoneEx(de); setDoneSupps(ds); setAiHistory(ah);
    }catch(e){ console.error("loadUserData error:",e); }
  }

  async function saveD(key,val,uid=currentUser?.id){
    // Only used for local-only data now (workout ticks, supp ticks)
    await local.set(`${key}_${uid}`,val);
  }

  // Auth
  async function handleLogin(){
    setAuthError("");
    const {data,error} = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });
    if(error){ setAuthError(error.message); return; }
    setCurrentUser(data.user);
    await loadUserData(data.user.id);
    setScreen("app");
  }

  async function handleSignup(){
    setAuthError("");
    if(!setupProfile.email||!setupProfile.password){setAuthError("Email and password required.");return;}
    if(setupStep===0){setSetupStep(1);return;}
    if(setupStep===1){setSetupStep(2);return;}
    if(setupStep===2){setShowValidator(true);return;}
  }

  async function finalizeSignup(){
    setAuthError("");
    // 1. Create auth account in Supabase
    const {data,error} = await supabase.auth.signUp({
      email: setupProfile.email,
      password: setupProfile.password,
    });
    if(error){ setAuthError(error.message); setShowValidator(false); return; }

    const uid = data.user.id;

    // 2. Save profile to profiles table
    await supabase.from("profiles").insert({
      id: uid,
      name: setupProfile.name,
      height: parseFloat(setupProfile.height)||0,
      age: parseInt(setupProfile.age)||0,
      gender: setupProfile.gender,
      current_weight: parseFloat(setupProfile.currentWeight)||0,
      goal_weight: parseFloat(setupProfile.goalWeight)||0,
      goal_look: setupProfile.goalLook,
      duration_months: parseInt(setupProfile.durationMonths)||12,
      activity_level: setupProfile.activityLevel,
    });

    // 3. Save starting weight
    await supabase.from("weight_log").insert({
      user_id: uid,
      weight: parseFloat(setupProfile.currentWeight)||0,
    });

    // 4. Set state and go to app
    const prof = {
      name: setupProfile.name,
      height: parseFloat(setupProfile.height)||0,
      age: parseInt(setupProfile.age)||0,
      gender: setupProfile.gender,
      current_weight: parseFloat(setupProfile.currentWeight)||0,
      goal_weight: parseFloat(setupProfile.goalWeight)||0,
      goal_look: setupProfile.goalLook,
      duration_months: parseInt(setupProfile.durationMonths)||12,
      activity_level: setupProfile.activityLevel,
    };
    setCurrentUser(data.user);
    setUserProfile(prof);
    setWeightLog([{date:new Date().toISOString(),weight:parseFloat(setupProfile.currentWeight)||0}]);
    setScreen("app");
    setShowValidator(false);
  }

  async function logout(){
    await supabase.auth.signOut();
    setCurrentUser(null); setUserProfile(null); setScreen("auth"); setAuthForm({email:"",password:""});
    setWeightLog([]); setFoodLog([]); setPrs({}); setMeasures([]); setAiHistory([]);
    setDoneEx({}); setDoneSupps({});
  }

  // Data ops
  async function logWeight(){
    if(!newWeight||!currentUser)return;
    const {data,error} = await supabase.from("weight_log").insert({
      user_id: currentUser.id,
      weight: parseFloat(newWeight),
    }).select().single();
    if(!error&&data){
      const entry={date:data.logged_at,weight:data.weight,id:data.id};
      setWeightLog(prev=>[...prev,entry]);
    }
    setNewWeight("");
  }

  async function resetWeightLog(){
    if(!currentUser)return;
    // Delete all except first entry
    const toDelete=weightLog.slice(1).filter(w=>w.id);
    for(const w of toDelete){
      await supabase.from("weight_log").delete().eq("id",w.id);
    }
    setWeightLog(weightLog.slice(0,1));
  }

  async function deleteWeightEntry(idx){
    const entry=weightLog[idx];
    if(entry?.id) await supabase.from("weight_log").delete().eq("id",entry.id);
    setWeightLog(prev=>prev.filter((_,i)=>i!==idx));
  }

  async function logFood(){
    if(!selectedFood||!foodQty||!currentUser)return;
    const ratio=parseFloat(foodQty)/100;
    const entry={
      user_id: currentUser.id,
      name:selectedFood.n, qty:parseFloat(foodQty), unit:selectedFood.unit,
      cal:Math.round(selectedFood.cal*ratio),
      protein:Math.round(selectedFood.p*ratio*10)/10,
      carbs:Math.round(selectedFood.c*ratio*10)/10,
      fats:Math.round(selectedFood.f*ratio*10)/10,
    };
    const {data,error} = await supabase.from("food_log").insert(entry).select().single();
    if(!error&&data){
      setFoodLog(prev=>[...prev,{...data,p:data.protein,c:data.carbs,f:data.fats,date:data.logged_at}]);
    }
    setSelectedFood(null); setFoodSearch(""); setFoodQty("100");
  }

  async function logPR(){
    if(!prW||!currentUser)return;
    const {data,error} = await supabase.from("prs").insert({
      user_id: currentUser.id,
      lift: prLift,
      weight: parseFloat(prW),
      reps: parseInt(prR)||1,
    }).select().single();
    if(!error&&data){
      setPrs(prev=>({...prev,[prLift]:[...(prev[prLift]||[]),{weight:data.weight,reps:data.reps,date:data.logged_at,id:data.id}]}));
    }
    setPrW(""); setPrR("");
  }

  async function saveMeasure(){
    if(!currentUser)return;
    const {data,error} = await supabase.from("measurements").insert({
      user_id: currentUser.id,
      data: measureInput,
    }).select().single();
    if(!error&&data){
      setMeasures(prev=>[...prev,{...data.data,date:data.logged_at,id:data.id}]);
    }
    setMeasureInput({});
  }

  async function toggleEx(k){
    const u={...doneEx,[k]:!doneEx[k]};
    setDoneEx(u); await local.set(`doneEx_${currentUser?.id}`,u);
  }

  async function toggleSupp(k){
    const u={...doneSupps,[k]:!doneSupps[k]};
    setDoneSupps(u); await local.set(`doneSupps_${currentUser?.id}`,u);
  }

  async function askAI(msg){
    if(!msg.trim()||aiLoading)return;
    const profile=userProfile||{};
    const nut=calcNutrition(parseFloat(pm_currentWeight)||70,parseFloat(profile.height||173)||170,parseInt(profile.age)||25,profile.gender||"male","moderate");
    const userMsg={role:"user",content:msg};
    const newH=[...aiHistory,userMsg];
    setAiHistory(newH); setAiInput(""); setAiLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are an elite fitness coach. User: ${profile.name||"User"}, ${profile.age||"?"}yo ${profile.gender||"male"}, ${profile.height||173||"?"}cm, ${pm_currentWeight||"?"}kg → goal ${pm_goalWeight||"?"}kg in ${pm_durationMonths||"?"}mo. Goal look: ${GOAL_LOOKS.find(g=>g.id===pm_goalLook)?.label||"?"}. Daily target: ${nut.cals}kcal, ${nut.protein}g protein. Be direct, specific, motivating. 2-4 sentences max. Casual tone.`,
          messages:newH.map(m=>({role:m.role,content:m.content})),
        }),
      });
      const data=await res.json();
      const reply=data.content?.map(c=>c.text||"").join("")||"Ask me anything about your training!";
      const updated=[...newH,{role:"assistant",content:reply}];
      setAiHistory(updated); await local.set(`ai_${currentUser?.id}`,updated);
    }catch{
      const updated=[...newH,{role:"assistant",content:"Connection issue — try again! 💪"}];
      setAiHistory(updated); await local.set(`ai_${currentUser?.id}`,updated);
    }
    setAiLoading(false);
  }

  // Derived
  const profile=userProfile||{};
  // Map DB snake_case to camelCase for display
  const pm_currentWeight = profile.current_weight || profile.currentWeight || 70;
  const pm_goalWeight = profile.goal_weight || profile.goalWeight || 75;
  const pm_durationMonths = profile.duration_months || profile.durationMonths || 12;
  const pm_goalLook = profile.goal_look || profile.goalLook || 'lean_athletic';
  const cw=weightLog.length>0?weightLog[weightLog.length-1].weight:parseFloat(pm_currentWeight)||70;
  const isCutPhase=cw>=parseFloat(pm_goalWeight)-(parseFloat(pm_goalWeight)<parseFloat(pm_currentWeight)?0:3);
  const goalMode=parseFloat(pm_goalWeight)<parseFloat(pm_currentWeight)?"cut":"bulk";
  const nut=calcNutrition(cw,parseFloat(profile.height||173)||170,parseInt(profile.age)||25,profile.gender||"male",goalMode);
  const woTemplate=parseInt(pm_durationMonths)>=10?WO_TEMPLATES.intermediate:WO_TEMPLATES.beginner;
  const todayDow=new Date().getDay()===0?6:new Date().getDay()-1;
  const todayWO=woTemplate.days[todayDow];
  const weekDates=getWeekDates(weekOffset);
  const todayMeals=foodLog.filter(f=>new Date(f.date).toDateString()===new Date().toDateString());
  const mealCals=todayMeals.reduce((s,f)=>s+f.cal,0);
  const mealProt=todayMeals.reduce((s,f)=>s+f.p,0);
  const calPct=Math.min(100,Math.round(mealCals/nut.cals*100));
  const protPct=Math.min(100,Math.round(mealProt/nut.protein*100));
  const exDoneCount=todayWO.ex.filter((_,i)=>doneEx[`${todayDow}-${i}`]).length;

  const weightChartData=weightLog.slice(-14).map((w,i)=>({
    v:w.weight,
    label:new Date(w.date).toLocaleDateString("en",{month:"short",day:"numeric"}),
  }));

  const calChartData=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-6+i);
    const meals=foodLog.filter(f=>new Date(f.date).toDateString()===d.toDateString());
    return {v:meals.reduce((s,m)=>s+m.cal,0),label:DAYS_SHORT[(i+new Date().getDay()-1+7)%7]||DAYS_SHORT[i]};
  });

  const categories=["All",...new Set(FOOD_DB.map(f=>f.cat||"Other"))];
  const searchResults=FOOD_DB.filter(f=>{
    const matchSearch=foodSearch.length<1||f.n.toLowerCase().includes(foodSearch.toLowerCase());
    const matchCat=foodCat==="All"||(f.cat||"Other")===foodCat;
    return matchSearch&&matchCat;
  }).slice(0,8);

  const PR_LIFTS_LIST=["Bench Press","Squat","Deadlift","OHP","Pull-ups","Barbell Row","Leg Press","Incline Press"];
  const SUPP_LIST=[
    {time:"🌅 Morning",items:[{n:"Multivitamin",d:"1 tablet"},{n:"Omega-3",d:"2 caps"},{n:"Ashwagandha",d:"300mg"},{n:"Creatine",d:"5g"}]},
    {time:"💪 Post-Workout",items:[{n:"Whey Protein",d:"1 scoop"},{n:"Creatine (alt)",d:"5g if not morning"}]},
    {time:"🌙 Before Bed",items:[{n:"Ashwagandha",d:"300mg 2nd dose"},{n:"ZMA / Zinc",d:"optional"}]},
  ];

  // ── LOADING ──
  if(screen==="loading")return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Spinner/>
    </div>
  );

  // ── AUTH ──
  if(screen==="auth"){
    if(showValidator)return(
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif",color:T.text,overflowY:"auto"}}>
        <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px"}}>
          <GoalValidator
            profile={setupProfile}
            onAccept={finalizeSignup}
            onRevise={(field,val)=>{setSetupProfile(p=>({...p,[field]:val.toString()}));setShowValidator(false);}}
          />
        </div>
      </div>
    );

    return(
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif",color:T.text,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{width:"100%",maxWidth:420}} className="fu">

          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:52,marginBottom:10,filter:`drop-shadow(0 0 20px ${T.accent}66)`}}>⚡</div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,margin:"0 0 4px",background:`linear-gradient(135deg,${T.accent},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PHYSIQUE</h1>
            <p style={{color:T.muted,fontSize:13,margin:0}}>Your personalized transformation tracker</p>
          </div>

          <div style={{display:"flex",background:T.card,borderRadius:14,padding:4,marginBottom:20}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setAuthMode(m);setSetupStep(0);setAuthError("");}} style={{flex:1,padding:"9px",border:"none",borderRadius:11,background:authMode===m?T.card2:"transparent",color:authMode===m?T.text:T.muted,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",transition:"all .2s"}}>{m==="login"?"Sign In":"Sign Up"}</button>
            ))}
          </div>

          {authMode==="login"?(
            <Card>
              <Input label="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} placeholder="your@email.com" type="email" required/>
              <Input label="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} placeholder="••••••••" type="password" required/>
              {authError&&<div style={{fontSize:12,color:T.red,marginBottom:12}}>{authError}</div>}
              <GlowBtn onClick={handleLogin}>Sign In</GlowBtn>
            </Card>
          ):(
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:11,color:T.muted,letterSpacing:2,textTransform:"uppercase"}}>Step {setupStep+1} of 3</div>
                <div style={{display:"flex",gap:6}}>
                  {[0,1,2].map(i=><div key={i} style={{width:24,height:3,borderRadius:999,background:i<=setupStep?T.accent:T.border}}/>)}
                </div>
              </div>

              {setupStep===0&&(
                <div className="fu">
                  <Input label="Full Name" value={setupProfile.name} onChange={e=>setSetupProfile({...setupProfile,name:e.target.value})} placeholder="Your name" required/>
                  <Input label="Email" value={setupProfile.email} onChange={e=>setSetupProfile({...setupProfile,email:e.target.value})} placeholder="your@email.com" type="email" required/>
                  <Input label="Password" value={setupProfile.password} onChange={e=>setSetupProfile({...setupProfile,password:e.target.value})} placeholder="Min 6 characters" type="password" required/>
                </div>
              )}
              {setupStep===1&&(
                <div className="fu">
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <Input label="Age" value={setupProfile.age} onChange={e=>setSetupProfile({...setupProfile,age:e.target.value})} placeholder="21" type="number" required/>
                    <Input label="Gender" value={setupProfile.gender} onChange={e=>setSetupProfile({...setupProfile,gender:e.target.value})} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} required/>
                    <Input label="Height (cm)" value={setupProfile.height} onChange={e=>setSetupProfile({...setupProfile,height:e.target.value})} placeholder="173" type="number" required/>
                    <Input label="Current Weight (kg)" value={setupProfile.currentWeight} onChange={e=>setSetupProfile({...setupProfile,currentWeight:e.target.value})} placeholder="70" type="number" required/>
                  </div>
                  <Input label="Activity Level" value={setupProfile.activityLevel} onChange={e=>setSetupProfile({...setupProfile,activityLevel:e.target.value})} options={[{value:"sedentary",label:"Sedentary (desk job)"},{value:"light",label:"Light (1-3x/week)"},{value:"moderate",label:"Moderate (3-5x/week)"},{value:"active",label:"Very active (6-7x/week)"}]} required/>
                </div>
              )}
              {setupStep===2&&(
                <div className="fu">
                  <Input label="Goal Weight (kg)" value={setupProfile.goalWeight} onChange={e=>setSetupProfile({...setupProfile,goalWeight:e.target.value})} placeholder="75" type="number" required/>
                  <Input label="Duration (months)" value={setupProfile.durationMonths} onChange={e=>setSetupProfile({...setupProfile,durationMonths:e.target.value})} placeholder="12" type="number" required/>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:10,letterSpacing:.5}}>How do you want to look? *</div>
                    {GOAL_LOOKS.map(g=>(
                      <div key={g.id} onClick={()=>setSetupProfile({...setupProfile,goalLook:g.id})} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:14,border:`1px solid ${setupProfile.goalLook===g.id?T.accent+"60":T.border}`,background:setupProfile.goalLook===g.id?T.accent+"0d":T.card2,marginBottom:8,cursor:"pointer",transition:"all .2s"}}>
                        <span style={{fontSize:22}}>{g.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:setupProfile.goalLook===g.id?T.accent:T.text}}>{g.label}</div>
                          <div style={{fontSize:11,color:T.muted}}>{g.desc} • {g.bf} BF</div>
                        </div>
                        {setupProfile.goalLook===g.id&&<div style={{width:18,height:18,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>✓</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {authError&&<div style={{fontSize:12,color:T.red,marginBottom:12}}>{authError}</div>}
              <GlowBtn onClick={handleSignup} disabled={setupStep===0&&(!setupProfile.email||!setupProfile.password)}>
                {setupStep<2?"Continue →":"Check My Goal →"}
              </GlowBtn>
              {setupStep>0&&<button onClick={()=>setSetupStep(s=>s-1)} style={{marginTop:10,width:"100%",background:"transparent",border:`1px solid ${T.border}`,borderRadius:14,padding:"11px",color:T.muted,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  const TABS=[
    {id:"home",icon:"⚡",label:"Home"},
    {id:"calendar",icon:"📅",label:"Plan"},
    {id:"food",icon:"🍗",label:"Food"},
    {id:"stats",icon:"📊",label:"Stats"},
    {id:"coach",icon:"🤖",label:"Coach"},
  ];

  const accentColor=goalMode==="cut"?T.green:T.accent;

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif",color:T.text,paddingBottom:80}}>

      {/* Header */}
      <div style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,background:`linear-gradient(135deg,${T.accent},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>PHYSIQUE</div>
          <div style={{fontSize:11,color:T.muted,marginTop:2}}>{profile.name||"Athlete"} · {goalMode==="cut"?"Cut Phase 🔪":"Bulk Phase 💪"}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:accentColor,lineHeight:1}}>{cw} kg</div>
            <div style={{fontSize:10,color:T.muted}}>BMI {bmi(cw,parseFloat(profile.height||173)||170)}</div>
          </div>
          <button onClick={logout} style={{background:T.dim,border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 12px",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Out</button>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"16px 14px"}}>

        {/* ══ HOME ══ */}
        {tab==="home"&&(
          <div className="fu">
            {/* Goal progress banner */}
            <div style={{background:`linear-gradient(135deg,${accentColor}18,${T.purple}10)`,border:`1px solid ${accentColor}30`,borderRadius:20,padding:18,marginBottom:14,display:"flex",gap:14,alignItems:"center"}}>
              <Ring pct={Math.min(100,Math.round(Math.abs(cw-(parseFloat(pm_currentWeight)||cw))/Math.abs((parseFloat(pm_goalWeight)||cw)-(parseFloat(pm_currentWeight)||cw))*100))} color={accentColor} size={72} stroke={7}>
                <div style={{fontSize:14,fontWeight:800,color:accentColor}}>{Math.min(100,Math.round(Math.abs(cw-(parseFloat(pm_currentWeight)||cw))/Math.abs((parseFloat(pm_goalWeight)||cw)-(parseFloat(pm_currentWeight)||cw))*100))}%</div>
              </Ring>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Goal Progress</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.text,lineHeight:1.2}}>{cw} → {pm_goalWeight} kg</div>
                <div style={{fontSize:12,color:T.muted,marginTop:4}}>{Math.round(Math.abs(parseFloat(pm_goalWeight)-cw)*10)/10} kg remaining · {pm_durationMonths} month plan</div>
              </div>
            </div>

            {/* Today nutrition */}
            <Card style={{marginBottom:14}} color={accentColor}>
              <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
                <Ring pct={calPct} color={accentColor} size={76} stroke={7}>
                  <div style={{fontSize:14,fontWeight:800,color:accentColor,lineHeight:1}}>{calPct}%</div>
                  <div style={{fontSize:9,color:T.muted}}>cals</div>
                </Ring>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Today's Nutrition</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:T.gold,lineHeight:1}}>{nut.cals} <span style={{fontSize:14,color:T.muted,fontFamily:"'Inter',sans-serif",fontWeight:400}}>kcal</span></div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>{mealCals} logged · {Math.max(0,nut.cals-mealCals)} left</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{l:"Protein",v:nut.protein,logged:mealProt,c:T.red},{l:"Carbs",v:nut.carbs,logged:0,c:T.gold},{l:"Fats",v:nut.fats,logged:0,c:T.blue}].map(m=>(
                  <div key={m.l} style={{background:`${m.c}0f`,border:`1px solid ${m.c}22`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:m.c}}>{m.v}g</div>
                    <div style={{fontSize:9,color:T.muted,letterSpacing:1,textTransform:"uppercase"}}>{m.l}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Today workout */}
            <Card onClick={()=>setTab("calendar")} style={{marginBottom:14,cursor:"pointer"}} color={T.purple}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase"}}>Today's Workout</div>
                <Pill color={T.purple}>{todayWO.tag}</Pill>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:T.purple,marginBottom:8}}>{todayWO.f}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,marginBottom:10}}>
                <span>{todayWO.ex.length} exercises</span>
                <span>{exDoneCount}/{todayWO.ex.length} done</span>
              </div>
              <div style={{height:5,borderRadius:999,background:T.border,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${exDoneCount/todayWO.ex.length*100}%`,background:`linear-gradient(90deg,${T.purple}88,${T.purple})`,borderRadius:999,transition:"width .3s"}}/>
              </div>
            </Card>

            {/* Weight chart */}
            <Card style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Weight Trend</div>
              <LineChart data={weightChartData} color={accentColor} height={100}/>
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <input value={newWeight} onChange={e=>setNewWeight(e.target.value)} placeholder={`Log weight (current: ${cw}kg)`} type="number" step="0.1"
                  style={{flex:1,background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"10px 14px",color:T.text,fontFamily:"inherit",fontSize:13}}/>
                <button onClick={logWeight} style={{background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Log</button>
              </div>
            </Card>

            {/* Calorie bar chart */}
            <Card>
              <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Calories This Week</div>
              <BarChart data={calChartData} color={T.gold} height={80}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:T.muted}}>
                <span>Target: {nut.cals} kcal/day</span>
                <span>Avg: {Math.round(calChartData.reduce((s,d)=>s+d.v,0)/7)} kcal</span>
              </div>
            </Card>
          </div>
        )}

        {/* ══ CALENDAR ══ */}
        {tab==="calendar"&&(
          <div className="fu">
            {/* Week nav */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <button onClick={()=>setWeekOffset(w=>w-1)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 14px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:14}}>←</button>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:T.text}}>
                  {weekOffset===0?"This Week":weekOffset===1?"Next Week":weekOffset===-1?"Last Week":`Week ${weekOffset>0?"+":""}${weekOffset}`}
                </div>
                <div style={{fontSize:11,color:T.muted}}>{weekDates[0].toLocaleDateString("en",{month:"short",day:"numeric"})} – {weekDates[6].toLocaleDateString("en",{month:"short",day:"numeric"})}</div>
              </div>
              <button onClick={()=>setWeekOffset(w=>w+1)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 14px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:14}}>→</button>
            </div>

            {/* Day cards */}
            {weekDates.map((date,i)=>{
              const wo=woTemplate.days[i];
              const isToday=date.toDateString()===new Date().toDateString();
              const isPast=date<new Date()&&!isToday;
              const doneCount=wo.ex.filter((_,j)=>doneEx[`${i}-${j}`]).length;
              const isSelected=selectedDay===i;
              return(
                <div key={i}>
                  <div onClick={()=>setSelectedDay(isSelected?null:i)} style={{display:"flex",gap:14,alignItems:"center",background:isToday?`${accentColor}0c`:T.card,border:`1px solid ${isToday?accentColor+"40":isSelected?T.border2:T.border}`,borderRadius:16,padding:"14px 16px",marginBottom:8,cursor:"pointer",opacity:isPast?.7:1,transition:"all .2s"}}>
                    <div style={{width:44,textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:10,color:isToday?accentColor:T.muted,fontWeight:700,letterSpacing:1}}>{DAYS_SHORT[i]}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:isToday?accentColor:T.text,lineHeight:1}}>{date.getDate()}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:isToday?T.text:T.muted,marginBottom:3}}>{wo.f}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <Pill color={wo.tag==="REST"?T.muted:accentColor}>{wo.tag}</Pill>
                        {weekOffset===0&&<span style={{fontSize:11,color:T.muted}}>{doneCount}/{wo.ex.length} done</span>}
                      </div>
                    </div>
                    {isToday&&<div style={{width:8,height:8,borderRadius:"50%",background:accentColor,animation:"pulse 2s infinite"}}/>}
                  </div>

                  {isSelected&&(
                    <div className="fu" style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:16,padding:16,marginBottom:10,marginTop:-4}}>
                      <div style={{fontSize:12,color:T.muted,marginBottom:12}}>{wo.ex.length} exercises · tap to mark done</div>
                      {wo.ex.map((ex,j)=>{
                        const k=`${i}-${j}`;
                        const done=doneEx[k];
                        return(
                          <div key={j} onClick={()=>toggleEx(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,background:done?`${accentColor}0c`:T.dim,border:`1px solid ${done?accentColor+"40":T.border}`,marginBottom:7,cursor:"pointer",transition:"all .2s"}}>
                            <div style={{width:22,height:22,borderRadius:"50%",background:done?accentColor:T.card,border:`2px solid ${done?accentColor:T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,transition:"all .2s"}}>{done?"✓":""}</div>
                            <span style={{fontSize:13,color:done?T.muted:T.text,textDecoration:done?"line-through":"none"}}>{ex}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Supplements */}
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:T.text,margin:"20px 0 12px"}}>💊 Supplements</div>
            {SUPP_LIST.map((block,bi)=>(
              <Card key={bi} style={{marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10}}>{block.time}</div>
                {block.items.map((item,ii)=>{
                  const k=`s${bi}-${ii}`;
                  const done=doneSupps[k];
                  return(
                    <div key={ii} onClick={()=>toggleSupp(k)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,background:done?`${T.purple}0c`:T.dim,border:`1px solid ${done?T.purple+"40":T.border}`,marginBottom:6,cursor:"pointer",transition:"all .2s"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:done?T.purple:T.card,border:`2px solid ${done?T.purple:T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{done?"✓":""}</div>
                      <span style={{fontSize:13,color:done?T.muted:T.text,textDecoration:done?"line-through":"none",flex:1}}>{item.n}</span>
                      <span style={{fontSize:11,color:T.muted}}>{item.d}</span>
                    </div>
                  );
                })}
              </Card>
            ))}
          </div>
        )}

        {/* ══ FOOD ══ */}
        {tab==="food"&&(
          <div className="fu">
            {/* Macro rings */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <Card color={T.gold}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Ring pct={calPct} color={T.gold} size={58} stroke={6}><div style={{fontSize:12,fontWeight:800,color:T.gold}}>{calPct}%</div></Ring>
                  <div>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase"}}>Calories</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.gold}}>{mealCals}</div>
                    <div style={{fontSize:10,color:T.muted}}>/ {nut.cals}</div>
                  </div>
                </div>
              </Card>
              <Card color={T.red}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Ring pct={protPct} color={T.red} size={58} stroke={6}><div style={{fontSize:12,fontWeight:800,color:T.red}}>{protPct}%</div></Ring>
                  <div>
                    <div style={{fontSize:10,color:T.muted,letterSpacing:1,textTransform:"uppercase"}}>Protein</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.red}}>{mealProt}g</div>
                    <div style={{fontSize:10,color:T.muted}}>/ {nut.protein}g</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Food search */}
            <Card style={{marginBottom:14}} color={T.green}>
              <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Log Food</div>
              <input value={foodSearch} onChange={e=>{setFoodSearch(e.target.value);setSelectedFood(null);}} placeholder="Search food or browse by category..."
                style={{width:"100%",background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"11px 14px",color:T.text,fontFamily:"inherit",fontSize:14,marginBottom:10}}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                {categories.map(cat=>(
                  <button key={cat} onClick={()=>{setFoodCat(cat);setSelectedFood(null);}} style={{padding:"5px 12px",borderRadius:999,border:`1px solid ${foodCat===cat?T.green+"60":T.border}`,background:foodCat===cat?T.green+"18":"transparent",color:foodCat===cat?T.green:T.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{cat}</button>
                ))}
              </div>

              {(searchResults.length>0||foodCat!=="All")&&!selectedFood&&(
                <div style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",marginBottom:10}}>
                  {searchResults.map((f,i)=>(
                    <div key={i} onClick={()=>{setSelectedFood(f);setFoodSearch(f.n);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:i<searchResults.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
                      <span style={{fontSize:13,color:T.text,fontWeight:500}}>{f.n}</span>
                      <div style={{display:"flex",gap:8,fontSize:11,color:T.muted}}>
                        <span style={{color:T.red}}>{f.p}g P</span>
                        <span>{f.cal} kcal/100{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFood&&(
                <div className="pi">
                  <div style={{background:`${T.green}0c`,border:`1px solid ${T.green}30`,borderRadius:14,padding:14,marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:700,color:T.green,marginBottom:8}}>{selectedFood.n}</div>
                    <div style={{display:"flex",gap:8,marginBottom:12}}>
                      <input value={foodQty} onChange={e=>setFoodQty(e.target.value)} type="number" placeholder="Qty"
                        style={{width:80,background:T.card2,border:`1px solid ${T.border2}`,borderRadius:10,padding:"8px 12px",color:T.text,fontFamily:"inherit",fontSize:14}}/>
                      <span style={{display:"flex",alignItems:"center",fontSize:13,color:T.muted}}>{selectedFood.unit}</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                      {[
                        {l:"Kcal",v:Math.round(selectedFood.cal*parseFloat(foodQty||0)/100),c:T.gold},
                        {l:"Protein",v:`${Math.round(selectedFood.p*parseFloat(foodQty||0)/100*10)/10}g`,c:T.red},
                        {l:"Carbs",v:`${Math.round(selectedFood.c*parseFloat(foodQty||0)/100*10)/10}g`,c:T.orange},
                        {l:"Fats",v:`${Math.round(selectedFood.f*parseFloat(foodQty||0)/100*10)/10}g`,c:T.blue},
                      ].map(s=>(
                        <div key={s.l} style={{textAlign:"center",background:T.dim,borderRadius:10,padding:"8px 4px"}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:s.c}}>{s.v}</div>
                          <div style={{fontSize:9,color:T.muted}}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <GlowBtn onClick={logFood} color={T.green}>+ Add to Log</GlowBtn>
                </div>
              )}
            </Card>

            {/* Today log */}
            <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Today's Food Log</div>
            {todayMeals.length===0?(
              <Card><p style={{color:T.muted,fontSize:13,textAlign:"center",margin:0}}>No food logged today — start tracking!</p></Card>
            ):(
              todayMeals.map((m,i)=>(
                <Card key={i} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontSize:14,fontWeight:600,color:T.text}}>{m.name}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:T.gold}}>{m.cal} kcal</div>
                  </div>
                  <div style={{display:"flex",gap:12,fontSize:11,color:T.muted}}>
                    <span>{m.qty}{m.unit}</span>
                    <span style={{color:T.red}}>P:{m.p}g</span>
                    <span style={{color:T.orange}}>C:{m.c}g</span>
                    <span style={{color:T.blue}}>F:{m.f}g</span>
                    <span>{new Date(m.date).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* ══ STATS ══ */}
        {tab==="stats"&&(
          <div className="fu">
            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {[
                {l:"Current",v:`${cw}kg`,c:accentColor},
                {l:"Goal",v:`${pm_goalWeight}kg`,c:T.green},
                {l:"BMI",v:bmi(cw,parseFloat(profile.height||173)||170),c:T.blue},
              ].map(s=>(
                <Card key={s.l} style={{textAlign:"center",padding:14}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:T.muted,letterSpacing:1}}>{s.l}</div>
                </Card>
              ))}
            </div>

            {/* Weight chart */}
            <Card style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase"}}>Weight History</div>
                <button onClick={()=>{if(window.confirm("Reset weight log to first entry only?"))resetWeightLog();}} style={{background:"rgba(255,75,110,.1)",border:"1px solid rgba(255,75,110,.25)",borderRadius:8,padding:"4px 12px",color:T.red,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Reset Log</button>
              </div>
              <LineChart data={weightChartData} color={accentColor} height={110}/>
              <div style={{marginTop:14,maxHeight:200,overflowY:"auto"}}>
                {[...weightLog].reverse().slice(0,15).map((e,i)=>{
                  const realIdx=weightLog.length-1-i;
                  const prev=realIdx>0?weightLog[realIdx-1]:null;
                  const ch=prev?(e.weight-prev.weight).toFixed(1):null;
                  return(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{fontSize:12,color:T.muted}}>{new Date(e.date).toLocaleDateString("en",{day:"numeric",month:"short",year:"2-digit"})}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:T.text}}>{e.weight} kg</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {ch!==null&&<span style={{fontSize:11,fontWeight:700,color:parseFloat(ch)>0?(goalMode==="bulk"?T.green:T.red):(goalMode==="bulk"?T.red:T.green)}}>{parseFloat(ch)>0?"+":""}{ch}</span>}
                        {realIdx>0&&<button onClick={()=>deleteWeightEntry(realIdx)} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:14,padding:"0 2px"}}>×</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* PR Tracker */}
            <Card style={{marginBottom:14}} color={T.gold}>
              <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Personal Records 🏆</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <select value={prLift} onChange={e=>setPrLift(e.target.value)} style={{gridColumn:"1/-1",background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"10px 14px",color:T.text,fontFamily:"inherit",fontSize:13}}>
                  {PR_LIFTS_LIST.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
                <input value={prW} onChange={e=>setPrW(e.target.value)} placeholder="Weight (kg)" type="number" step=".5"
                  style={{background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"10px 14px",color:T.text,fontFamily:"inherit",fontSize:13}}/>
                <input value={prR} onChange={e=>setPrR(e.target.value)} placeholder="Reps" type="number"
                  style={{background:T.card2,border:`1px solid ${T.border2}`,borderRadius:12,padding:"10px 14px",color:T.text,fontFamily:"inherit",fontSize:13}}/>
              </div>
              <GlowBtn onClick={logPR} color={T.gold} style={{color:"#000"}}>🏆 Log PR</GlowBtn>
              {PR_LIFTS_LIST.filter(l=>prs[l]?.length>0).map(l=>{
                const best=prs[l].reduce((a,b)=>a.weight>b.weight?a:b);
                const chartData=prs[l].slice(-8).map((p,i)=>({v:p.weight,label:`${i+1}`}));
                return(
                  <div key={l} style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:600,color:T.text}}>{l}</span>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:T.gold}}>🏆 {best.weight}kg×{best.reps}</span>
                    </div>
                    <LineChart data={chartData} color={T.gold} height={60}/>
                  </div>
                );
              })}
              {Object.keys(prs).length===0&&<p style={{color:T.muted,fontSize:12,margin:"10px 0 0",textAlign:"center"}}>Log your first PR above!</p>}
            </Card>

            {/* Body Measurements */}
            <Card color={T.blue}>
              <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Body Measurements 📏</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {["Chest (cm)","Waist (cm)","Arms (cm)","Thighs (cm)","Shoulders (cm)","Hips (cm)"].map(m=>(
                  <div key={m}>
                    <div style={{fontSize:10,color:T.muted,marginBottom:4}}>{m}</div>
                    <input value={measureInput[m]||""} onChange={e=>setMeasureInput({...measureInput,[m]:e.target.value})} placeholder="cm" type="number" step=".5"
                      style={{width:"100%",background:T.card2,border:`1px solid ${T.border2}`,borderRadius:10,padding:"9px 12px",color:T.text,fontFamily:"inherit",fontSize:13}}/>
                  </div>
                ))}
              </div>
              <GlowBtn onClick={saveMeasure} color={T.blue}>Save Measurements</GlowBtn>
              {measures.length>0&&(
                <div style={{marginTop:14}}>
                  <div style={{fontSize:10,color:T.muted,marginBottom:8}}>Latest — {new Date(measures[measures.length-1].date).toLocaleDateString("en",{day:"numeric",month:"short",year:"numeric"})}</div>
                  {Object.entries(measures[measures.length-1]).filter(([k])=>k!=="date").map(([k,v])=>{
                    const prev=measures.length>1?measures[measures.length-2][k]:null;
                    const change=prev?parseFloat(v)-parseFloat(prev):null;
                    return(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                        <span style={{fontSize:12,color:T.muted}}>{k}</span>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:T.blue}}>{v} cm</span>
                          {change!==null&&<span style={{fontSize:11,color:change>0?T.green:T.red}}>{change>0?"+":""}{change.toFixed(1)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ══ AI COACH ══ */}
        {tab==="coach"&&(
          <div className="fu" style={{display:"flex",flexDirection:"column",minHeight:"calc(100vh - 180px)"}}>
            <div style={{background:`linear-gradient(135deg,${T.accent}18,${T.purple}10)`,border:`1px solid ${T.accent}30`,borderRadius:18,padding:16,marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:36}}>🤖</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.accent}}>AI Coach</div>
                <div style={{fontSize:11,color:T.muted}}>Powered by Claude · Knows your full plan & stats</div>
              </div>
            </div>

            <div style={{flex:1,overflowY:"auto",marginBottom:12,minHeight:300}}>
              {aiHistory.length===0&&(
                <div style={{textAlign:"center",padding:"24px 16px"}}>
                  <div style={{fontSize:36,marginBottom:10}}>💬</div>
                  <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Ask anything about your training, diet, recovery, supplements...</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                    {["Why am I not gaining?","Best protein sources?","How to increase bench?","Should I deload?","Fix my plateau"].map(q=>(
                      <button key={q} onClick={()=>askAI(q)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"8px 14px",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {aiHistory.map((m,i)=>(
                <div key={i} className="sr" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10,animationDelay:`${i*.03}s`}}>
                  <div style={{maxWidth:"85%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?`linear-gradient(135deg,${T.accent},${T.purple})`:`${T.card}`,border:m.role==="user"?"none":`1px solid ${T.border}`,color:T.text,fontSize:14,lineHeight:1.6}}>{m.content}</div>
                </div>
              ))}
              {aiLoading&&(
                <div style={{display:"flex",gap:5,padding:"10px 14px"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.accent,animation:`pulse 1s ${i*.2}s infinite`}}/>)}
                </div>
              )}
              <div ref={chatRef}/>
            </div>

            <div style={{display:"flex",gap:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAI(aiInput)} placeholder="Ask your coach..." style={{flex:1,background:T.card2,border:`1px solid ${T.border2}`,borderRadius:14,padding:"12px 16px",color:T.text,fontFamily:"inherit",fontSize:14}}/>
              <button onClick={()=>askAI(aiInput)} disabled={aiLoading||!aiInput.trim()} style={{background:`linear-gradient(135deg,${T.accent},${T.purple})`,color:"#fff",border:"none",borderRadius:14,padding:"12px 18px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",opacity:aiLoading||!aiInput.trim()?.4:1}}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.card,borderTop:`1px solid ${T.border}`,display:"flex",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderTop:`2px solid ${tab===t.id?T.accent:"transparent"}`,transition:"border-color .2s"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:10,letterSpacing:.5,color:tab===t.id?T.accent:T.muted,fontWeight:600}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
