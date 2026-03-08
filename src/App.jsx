import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase.js';

const _fl=document.createElement("link");_fl.rel="stylesheet";_fl.href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";document.head.appendChild(_fl);
const _st=document.createElement("style");_st.textContent=`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;overscroll-behavior:none;}::-webkit-scrollbar{display:none;}input,select,button{font-family:inherit;outline:none;}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes popIn{0%{transform:scale(.93);opacity:0}70%{transform:scale(1.01)}100%{transform:scale(1);opacity:1}}.fu{animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}.pi{animation:popIn .28s cubic-bezier(.16,1,.3,1) both}`;document.head.appendChild(_st);

const DARK={bg:"#000",bg2:"#0c0c0c",card:"#141414",card2:"#1c1c1c",border:"rgba(255,255,255,0.07)",border2:"rgba(255,255,255,0.12)",text:"#fff",text2:"#e5e5e5",muted:"#636366",dim:"rgba(255,255,255,0.04)",green:"#30d158",red:"#ff453a",gold:"#ffd60a",orange:"#ff9f0a",purple:"#bf5af2",teal:"#5ac8fa",tabBar:"rgba(10,10,10,0.92)",shadow:"0 4px 24px rgba(0,0,0,0.5)",inputBg:"#1c1c1c",inputBorder:"#2c2c2e"};
const LIGHT={bg:"#f2f2f7",bg2:"#fff",card:"#fff",card2:"#f2f2f7",border:"rgba(0,0,0,0.07)",border2:"rgba(0,0,0,0.12)",text:"#000",text2:"#1c1c1e",muted:"#8e8e93",dim:"rgba(0,0,0,0.04)",green:"#34c759",red:"#ff3b30",gold:"#ff9500",orange:"#ff9500",purple:"#af52de",teal:"#32ade6",tabBar:"rgba(242,242,247,0.94)",shadow:"0 2px 16px rgba(0,0,0,0.08)",inputBg:"#f2f2f7",inputBorder:"#d1d1d6"};

const FOODS=[
  {n:"Chicken Breast",cal:165,p:31,c:0,f:3.6,unit:"g",cat:"Protein"},{n:"Chicken Thigh",cal:209,p:26,c:0,f:11,unit:"g",cat:"Protein"},{n:"Eggs (whole)",cal:155,p:13,c:1.1,f:11,unit:"g",cat:"Protein"},{n:"Egg White",cal:52,p:11,c:.7,f:.2,unit:"g",cat:"Protein"},{n:"Paneer",cal:265,p:18,c:1.2,f:20,unit:"g",cat:"Protein"},{n:"Tuna (canned)",cal:116,p:26,c:0,f:1,unit:"g",cat:"Protein"},{n:"Salmon",cal:208,p:20,c:0,f:13,unit:"g",cat:"Protein"},{n:"Whey Protein",cal:400,p:80,c:8,f:5,unit:"g",cat:"Protein"},{n:"Soya Chunks",cal:345,p:52,c:33,f:.5,unit:"g",cat:"Protein"},{n:"Tofu",cal:76,p:8,c:1.9,f:4.8,unit:"g",cat:"Protein"},
  {n:"Dal Makhani",cal:130,p:6,c:16,f:5,unit:"g",cat:"North Indian"},{n:"Dal Tadka",cal:116,p:7,c:18,f:2,unit:"g",cat:"North Indian"},{n:"Chana Masala",cal:164,p:9,c:27,f:3,unit:"g",cat:"North Indian"},{n:"Rajma",cal:127,p:8.7,c:22,f:.5,unit:"g",cat:"North Indian"},{n:"Palak Paneer",cal:150,p:7,c:6,f:11,unit:"g",cat:"North Indian"},{n:"Butter Chicken",cal:164,p:15,c:6,f:9,unit:"g",cat:"North Indian"},{n:"Aloo Gobi",cal:80,p:2.5,c:12,f:2.5,unit:"g",cat:"North Indian"},{n:"Aloo Paratha",cal:280,p:5,c:40,f:11,unit:"g",cat:"North Indian"},{n:"Roti / Chapati",cal:297,p:9,c:60,f:3.7,unit:"g",cat:"North Indian"},{n:"Chicken Biryani",cal:200,p:12,c:25,f:5,unit:"g",cat:"North Indian"},{n:"Khichdi",cal:120,p:4,c:22,f:2,unit:"g",cat:"North Indian"},{n:"Egg Bhurji",cal:185,p:13,c:3,f:13,unit:"g",cat:"North Indian"},{n:"Paneer Bhurji",cal:210,p:14,c:4,f:15,unit:"g",cat:"North Indian"},{n:"Sarson da Saag",cal:90,p:4,c:10,f:4,unit:"g",cat:"North Indian"},{n:"Chole Bhature",cal:350,p:9,c:50,f:13,unit:"g",cat:"North Indian"},
  {n:"Puttu",cal:148,p:3,c:30,f:1.5,unit:"g",cat:"Kerala"},{n:"Kadala Curry",cal:145,p:8,c:22,f:3,unit:"g",cat:"Kerala"},{n:"Kerala Fish Curry",cal:120,p:15,c:4,f:5,unit:"g",cat:"Kerala"},{n:"Meen Pollichathu",cal:210,p:22,c:3,f:12,unit:"g",cat:"Kerala"},{n:"Appam",cal:120,p:2.5,c:24,f:1,unit:"g",cat:"Kerala"},{n:"Veg Stew",cal:90,p:2.5,c:12,f:3.5,unit:"g",cat:"Kerala"},{n:"Chicken Stew",cal:110,p:10,c:8,f:4,unit:"g",cat:"Kerala"},{n:"Kerala Parotta",cal:310,p:7,c:48,f:11,unit:"g",cat:"Kerala"},{n:"Beef Fry",cal:250,p:28,c:3,f:14,unit:"g",cat:"Kerala"},{n:"Karimeen Fry",cal:180,p:22,c:2,f:9,unit:"g",cat:"Kerala"},{n:"Prawn Masala",cal:140,p:18,c:5,f:6,unit:"g",cat:"Kerala"},{n:"Avial",cal:95,p:2.5,c:12,f:4,unit:"g",cat:"Kerala"},{n:"Thoran (cabbage)",cal:60,p:2,c:8,f:2,unit:"g",cat:"Kerala"},{n:"Sambar",cal:55,p:3,c:9,f:.8,unit:"g",cat:"Kerala"},{n:"Idli",cal:39,p:2,c:8,f:.4,unit:"g",cat:"Kerala"},{n:"Plain Dosa",cal:168,p:3.9,c:30,f:3.7,unit:"g",cat:"Kerala"},{n:"Egg Roast",cal:190,p:13,c:4,f:13,unit:"g",cat:"Kerala"},{n:"Tapioca / Kappa",cal:160,p:1.5,c:38,f:.3,unit:"g",cat:"Kerala"},{n:"Kappa & Fish",cal:200,p:14,c:30,f:4,unit:"g",cat:"Kerala"},{n:"Erissery",cal:120,p:3.5,c:16,f:5,unit:"g",cat:"Kerala"},{n:"Olan",cal:80,p:2,c:10,f:3.5,unit:"g",cat:"Kerala"},{n:"Fish Molee",cal:130,p:14,c:5,f:7,unit:"g",cat:"Kerala"},{n:"Kozhikodan Biryani",cal:215,p:13,c:26,f:6,unit:"g",cat:"Kerala"},{n:"Unniyappam",cal:130,p:2,c:22,f:4,unit:"g",cat:"Kerala"},{n:"Ada Payasam",cal:185,p:3,c:35,f:4,unit:"g",cat:"Kerala"},
  {n:"White Rice (cooked)",cal:130,p:2.7,c:28,f:.3,unit:"g",cat:"Rice & Carbs"},{n:"Brown Rice",cal:112,p:2.3,c:23,f:.9,unit:"g",cat:"Rice & Carbs"},{n:"Oats (dry)",cal:389,p:17,c:66,f:7,unit:"g",cat:"Rice & Carbs"},{n:"Sweet Potato",cal:86,p:1.6,c:20,f:.1,unit:"g",cat:"Rice & Carbs"},{n:"Potato (boiled)",cal:87,p:1.9,c:20,f:.1,unit:"g",cat:"Rice & Carbs"},{n:"Poha",cal:130,p:2.7,c:27,f:1,unit:"g",cat:"Rice & Carbs"},{n:"Upma",cal:150,p:3.5,c:25,f:4,unit:"g",cat:"Rice & Carbs"},{n:"Whole Grain Bread",cal:247,p:9,c:43,f:4.2,unit:"g",cat:"Rice & Carbs"},
  {n:"Whole Milk",cal:61,p:3.2,c:4.8,f:3.3,unit:"ml",cat:"Dairy"},{n:"Curd / Dahi",cal:61,p:3.5,c:4.7,f:3.3,unit:"ml",cat:"Dairy"},{n:"Greek Yogurt",cal:59,p:10,c:3.6,f:.4,unit:"g",cat:"Dairy"},{n:"Buttermilk",cal:40,p:3.3,c:4.8,f:.9,unit:"ml",cat:"Dairy"},{n:"Lassi (sweet)",cal:98,p:3.5,c:15,f:3,unit:"ml",cat:"Dairy"},
  {n:"Banana",cal:89,p:1.1,c:23,f:.3,unit:"g",cat:"Fruits"},{n:"Apple",cal:52,p:.3,c:14,f:.2,unit:"g",cat:"Fruits"},{n:"Mango",cal:60,p:.8,c:15,f:.4,unit:"g",cat:"Fruits"},{n:"Papaya",cal:43,p:.5,c:11,f:.3,unit:"g",cat:"Fruits"},{n:"Watermelon",cal:30,p:.6,c:7.6,f:.2,unit:"g",cat:"Fruits"},{n:"Jackfruit",cal:95,p:1.7,c:23,f:.6,unit:"g",cat:"Fruits"},
  {n:"Peanut Butter",cal:588,p:25,c:20,f:50,unit:"g",cat:"Fats & Nuts"},{n:"Almonds",cal:579,p:21,c:22,f:50,unit:"g",cat:"Fats & Nuts"},{n:"Cashews",cal:553,p:18,c:30,f:44,unit:"g",cat:"Fats & Nuts"},{n:"Ghee",cal:900,p:0,c:0,f:100,unit:"ml",cat:"Fats & Nuts"},{n:"Coconut Oil",cal:862,p:0,c:0,f:100,unit:"ml",cat:"Fats & Nuts"},{n:"Grated Coconut",cal:354,p:3.3,c:15,f:33,unit:"g",cat:"Fats & Nuts"},
  {n:"Black Coffee",cal:2,p:.3,c:0,f:0,unit:"ml",cat:"Drinks"},{n:"Chai (milk+sugar)",cal:50,p:1.5,c:7,f:1.5,unit:"ml",cat:"Drinks"},{n:"Coconut Water",cal:19,p:.7,c:3.7,f:.2,unit:"ml",cat:"Drinks"},{n:"Protein Shake",cal:150,p:25,c:8,f:2,unit:"ml",cat:"Drinks"},
  {n:"Boiled Chana",cal:164,p:8.9,c:27,f:2.6,unit:"g",cat:"Snacks"},{n:"Sprouts",cal:62,p:4.3,c:11,f:.4,unit:"g",cat:"Snacks"},{n:"Roasted Makhana",cal:347,p:9.7,c:76,f:.1,unit:"g",cat:"Snacks"},{n:"Protein Bar",cal:200,p:20,c:22,f:7,unit:"g",cat:"Snacks"},
];

const GOALS=[{id:"lean_athletic",label:"Lean & Athletic",desc:"Low BF, visible abs",bf:"8-12%",icon:"⚡"},{id:"big_muscular",label:"Big & Muscular",desc:"Max size, imposing",bf:"14-18%",icon:"💪"},{id:"shredded",label:"Shredded",desc:"Competition-ready, veins",bf:"5-8%",icon:"🔥"},{id:"toned",label:"Toned & Fit",desc:"Healthy, some definition",bf:"12-18%",icon:"🏃"},{id:"bulk_cut",label:"Bulk then Cut",desc:"Build size then reveal",bf:"10-12%",icon:"📈"}];
const WO={beginner:{name:"5-Day Split",days:[{d:"Mon",f:"Chest & Triceps",tag:"PUSH",ex:["Bench Press 3×10","Incline DB Press 3×10","Cable Flyes 3×12","Tricep Pushdown 3×12","Overhead Ext 3×12"]},{d:"Tue",f:"Back & Biceps",tag:"PULL",ex:["Lat Pulldown 4×10","Seated Row 3×10","DB Row 3×10","Barbell Curl 3×12","Hammer Curl 3×12"]},{d:"Wed",f:"Rest & Cardio",tag:"REST",ex:["20 min walk","15 min stretch","Foam roll"]},{d:"Thu",f:"Shoulders & Core",tag:"PUSH",ex:["OHP 3×10","Lateral Raise 4×15","Front Raise 3×12","Plank 3×45s","Crunches 3×20"]},{d:"Fri",f:"Legs",tag:"LEGS",ex:["Squat 3×10","Leg Press 3×12","Leg Curl 3×12","Leg Ext 3×12","Calf Raises 4×20"]},{d:"Sat",f:"Arms & Abs",tag:"ARMS",ex:["EZ Curl 3×12","Preacher Curl 3×12","Skull Crushers 3×12","Dips 2×failure","Plank 3×60s"]},{d:"Sun",f:"Full Rest",tag:"REST",ex:["Sleep 8+ hrs","Eat macros","Active recovery"]}]},intermediate:{name:"PPL 6-Day",days:[{d:"Mon",f:"Push — Heavy",tag:"PUSH",ex:["Bench Press 5×5","Incline Press 4×8","OHP 4×8","Lateral Raise 5×15","Tricep Dips 3×fail"]},{d:"Tue",f:"Pull — Heavy",tag:"PULL",ex:["Deadlift 5×5","Weighted Pull-ups 4×6","Barbell Row 4×8","Face Pull 4×15","Barbell Curl 4×10"]},{d:"Wed",f:"Legs — Heavy",tag:"LEGS",ex:["Squat 5×5","Romanian DL 4×8","Leg Press 5×10","Leg Curl 4×12","Calf Raises 5×20"]},{d:"Thu",f:"Push — Volume",tag:"PUSH",ex:["DB Bench 4×12","Cable Flyes 4×15","Lateral Raise 6×15","Arnold Press 4×12","Pushdown 4×15"]},{d:"Fri",f:"Pull — Volume",tag:"PULL",ex:["Lat Pulldown 4×12","Seated Row 4×12","Incline Curl 4×12","Rear Delt Fly 4×15","Face Pull 3×15"]},{d:"Sat",f:"Legs & Arms",tag:"BOTH",ex:["Hack Squat 4×12","Lunges 3×20","EZ Curl 5×12","Skull Crushers 4×12","Cable Curl 3×15"]},{d:"Sun",f:"Full Rest",tag:"REST",ex:["Sleep 8+ hrs","Eat all macros","Passive recovery"]}]}};
const SUPPS=[{time:"🌅 Morning",items:[{n:"Multivitamin",d:"1 tablet"},{n:"Omega-3",d:"2 caps"},{n:"Ashwagandha",d:"300mg"},{n:"Creatine",d:"5g with water"}]},{time:"💪 Post-Workout",items:[{n:"Whey Protein",d:"25–30g scoop"},{n:"Creatine (alt)",d:"5g if not morning"}]},{time:"🌙 Before Bed",items:[{n:"Ashwagandha 2nd",d:"300mg"},{n:"ZMA / Zinc",d:"optional"}]}];
const PR_LIFTS=["Bench Press","Squat","Deadlift","OHP","Pull-ups","Barbell Row","Leg Press","Incline Press"];
const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function bmi(w,h){return(w/((h/100)**2)).toFixed(1);}
function calcNut(w,h,age,gender,mode){const bmr=gender==="female"?10*w+6.25*h-5*age-161:10*w+6.25*h-5*age+5;const tdee=Math.round(bmr*1.55);const sur=mode==="cut"?-400:350;const cals=Math.round(tdee+sur);const protein=mode==="cut"?Math.round(w*2.6):Math.round(w*2.2);const fats=Math.round(w*(mode==="cut"?.8:1));const carbs=Math.max(0,Math.round((cals-protein*4-fats*9)/4));return{tdee,cals,protein,carbs,fats};}
function isReal(cw,gw,mo){const diff=parseFloat(gw)-parseFloat(cw);const isCut=diff<0;const m=parseInt(mo)||12;const rate=isCut?1.5:2.2;const maxP=isCut?parseFloat(cw)-rate*m:parseFloat(cw)+rate*m;return{ok:isCut?parseFloat(gw)>=maxP:parseFloat(gw)<=maxP,minMo:Math.ceil(Math.abs(diff)/rate),maxP:parseFloat(maxP.toFixed(1)),isCut};}
function getWeekDates(off=0){const t=new Date(),dow=t.getDay()===0?6:t.getDay()-1;const mon=new Date(t);mon.setDate(t.getDate()-dow+off*7);return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return d;});}
const local={async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},async set(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch{}}};

function Spin(){return <div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.15)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite"}}/>;}
function Ring({pct=0,color,size=72,stroke=6,children,T}){const r=(size-stroke)/2,circ=2*Math.PI*r,dash=circ*Math.min(Math.max(pct,0),100)/100;return(<div style={{position:"relative",width:size,height:size,flexShrink:0}}><svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border2} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray .5s ease"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>{children}</div></div>);}
function Chart({data=[],color,T,h=90}){if(data.length<2)return <div style={{height:h,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontSize:12}}>Log more entries</div>;const vals=data.map(d=>d.v),mn=Math.min(...vals)-.5,mx=Math.max(...vals)+.5,rng=mx-mn||1;const W=300,pts=data.map((d,i)=>({x:i/(data.length-1)*(W-16)+8,y:h-(((d.v-mn)/rng)*(h-16)+8)}));const path="M"+pts.map(p=>`${p.x},${p.y}`).join("L");const area=path+`L${pts[pts.length-1].x},${h}L${pts[0].x},${h}Z`;const gid=`g${color.replace(/[^a-z0-9]/gi,"")}${data.length}`;return(<div><svg viewBox={`0 0 ${W} ${h}`} style={{width:"100%",height:h,overflow:"visible"}}><defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".15"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d={area} fill={`url(#${gid})`}/><path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3.5" fill={T.card} stroke={color} strokeWidth="2"/>)}</svg><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:T.muted}}>{data[0]?.label}</span><span style={{fontSize:10,color:T.muted}}>{data[data.length-1]?.label}</span></div></div>);}
const Card=({children,style={},onClick,T})=><div onClick={onClick} style={{background:T.card,borderRadius:18,padding:16,boxShadow:T.shadow,border:`1px solid ${T.border}`,...style,cursor:onClick?"pointer":"default"}}>{children}</div>;
const Btn=({children,onClick,color,outline,disabled,style={}})=><button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px",borderRadius:14,fontWeight:700,fontSize:16,cursor:disabled?"not-allowed":"pointer",transition:"opacity .15s",fontFamily:"inherit",background:disabled?"#2c2c2e":outline?"transparent":color||"#30d158",color:disabled?"#555":outline?color||"#30d158":"#000",border:outline?`1.5px solid ${color||"#30d158"}`:"none",opacity:disabled?.55:1,...style}}>{children}</button>;

export default function App(){
  const [theme,setTheme]=useState("dark");
  const T=theme==="dark"?DARK:LIGHT;
  const ac=T.green;
  const [screen,setScreen]=useState("loading");
  const [atab,setAtab]=useState("login");
  const [tab,setTab]=useState("home");
  const [user,setUser]=useState(null);
  const [prof,setProf]=useState(null);
  const [form,setForm]=useState({email:"",password:""});
  const [setup,setSetup]=useState({name:"",email:"",password:"",height:"",weight:"",goalWeight:"",goalLook:"lean_athletic",months:"12",age:"",gender:"male",activity:"moderate"});
  const [step,setStep]=useState(0);
  const [showVal,setShowVal]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [forgot,setForgot]=useState(false);
  const [fEmail,setFEmail]=useState("");
  const [fDone,setFDone]=useState(false);
  const [wLog,setWLog]=useState([]);
  const [fLog,setFLog]=useState([]);
  const [prs,setPrs]=useState({});
  const [meas,setMeas]=useState([]);
  const [dEx,setDEx]=useState({});
  const [dSup,setDSup]=useState({});
  const [weekOff,setWeekOff]=useState(0);
  const [selDay,setSelDay]=useState(null);
  const [fs,setFs]=useState("");
  const [fcat,setFcat]=useState("All");
  const [fqty,setFqty]=useState("100");
  const [selF,setSelF]=useState(null);
  const [newW,setNewW]=useState("");
  const [prLift,setPrLift]=useState("Bench Press");
  const [prW,setPrW]=useState("");
  const [prR,setPrR]=useState("");
  const [mIn,setMIn]=useState({});
  const [editId,setEditId]=useState(null);
  const [editV,setEditV]=useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session?.user){setUser(session.user);load(session.user.id);}else setScreen("auth");});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{if(!s){setUser(null);setScreen("auth");}});
    return()=>subscription.unsubscribe();
  },[]);

  async function load(uid){
    try{
      const{data:p}=await supabase.from("profiles").select("*").eq("id",uid).single();if(p)setProf(p);
      const{data:wl}=await supabase.from("weight_log").select("*").eq("user_id",uid).order("logged_at");if(wl)setWLog(wl.map(w=>({date:w.logged_at,weight:w.weight,id:w.id})));
      const{data:fl}=await supabase.from("food_log").select("*").eq("user_id",uid).order("logged_at");if(fl)setFLog(fl.map(f=>({...f,p:f.protein,c:f.carbs,f:f.fats,date:f.logged_at})));
      const{data:pd}=await supabase.from("prs").select("*").eq("user_id",uid).order("logged_at");if(pd){const m={};pd.forEach(p=>{if(!m[p.lift])m[p.lift]=[];m[p.lift].push({weight:p.weight,reps:p.reps,date:p.logged_at,id:p.id});});setPrs(m);}
      const{data:ms}=await supabase.from("measurements").select("*").eq("user_id",uid).order("logged_at");if(ms)setMeas(ms.map(m=>({...m.data,date:m.logged_at,id:m.id})));
      const de=await local.get(`dex_${uid}`)||{};const ds=await local.get(`dsu_${uid}`)||{};setDEx(de);setDSup(ds);
      setScreen("app");
    }catch(e){console.error(e);setScreen("app");}
  }

  async function doLogin(){setErr("");setLoading(true);const{data,error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});if(error){setErr(error.message);setLoading(false);return;}setUser(data.user);await load(data.user.id);setLoading(false);}
  async function doSignup(){setErr("");if(!setup.email||!setup.password){setErr("Email and password required.");return;}if(step===0){setStep(1);return;}if(step===1){if(!setup.height||!setup.weight||!setup.age){setErr("Fill all fields.");return;}setStep(2);return;}if(step===2){setShowVal(true);return;}}
  async function finalize(){setErr("");setLoading(true);const{data,error}=await supabase.auth.signUp({email:setup.email,password:setup.password});if(error){setErr(error.message);setShowVal(false);setLoading(false);return;}const uid=data.user.id;await supabase.from("profiles").insert({id:uid,name:setup.name,height:parseFloat(setup.height),age:parseInt(setup.age),gender:setup.gender,current_weight:parseFloat(setup.weight),goal_weight:parseFloat(setup.goalWeight),goal_look:setup.goalLook,duration_months:parseInt(setup.months),activity_level:setup.activity});const{data:w0}=await supabase.from("weight_log").insert({user_id:uid,weight:parseFloat(setup.weight)}).select().single();setUser(data.user);setProf({name:setup.name,height:parseFloat(setup.height),age:parseInt(setup.age),gender:setup.gender,current_weight:parseFloat(setup.weight),goal_weight:parseFloat(setup.goalWeight),goal_look:setup.goalLook,duration_months:parseInt(setup.months)});if(w0)setWLog([{date:w0.logged_at,weight:w0.weight,id:w0.id}]);setLoading(false);setShowVal(false);setScreen("app");}
  async function doForgot(){setErr("");setLoading(true);const{error}=await supabase.auth.resetPasswordForEmail(fEmail,{redirectTo:window.location.origin});if(error)setErr(error.message);else setFDone(true);setLoading(false);}
  async function logout(){await supabase.auth.signOut();setUser(null);setProf(null);setWLog([]);setFLog([]);setPrs({});setMeas([]);setDEx({});setDSup({});setScreen("auth");setForm({email:"",password:""});}
  async function logW(){if(!newW||!user)return;const{data,e}=await supabase.from("weight_log").insert({user_id:user.id,weight:parseFloat(newW)}).select().single();if(!e&&data)setWLog(prev=>[...prev,{date:data.logged_at,weight:data.weight,id:data.id}]);setNewW("");}
  async function delW(id){await supabase.from("weight_log").delete().eq("id",id);setWLog(prev=>prev.filter(w=>w.id!==id));}
  async function updW(id,val){const{error}=await supabase.from("weight_log").update({weight:parseFloat(val)}).eq("id",id);if(!error)setWLog(prev=>prev.map(w=>w.id===id?{...w,weight:parseFloat(val)}:w));setEditId(null);setEditV("");}
  async function resetW(){if(wLog.length<=1)return;for(const w of wLog.slice(1))await supabase.from("weight_log").delete().eq("id",w.id);setWLog(wLog.slice(0,1));}
  async function logF(){if(!selF||!fqty||!user)return;const r=parseFloat(fqty)/100;const{data,e}=await supabase.from("food_log").insert({user_id:user.id,name:selF.n,qty:parseFloat(fqty),unit:selF.unit,cal:Math.round(selF.cal*r),protein:Math.round(selF.p*r*10)/10,carbs:Math.round(selF.c*r*10)/10,fats:Math.round(selF.f*r*10)/10}).select().single();if(!e&&data)setFLog(prev=>[...prev,{...data,p:data.protein,c:data.carbs,f:data.fats,date:data.logged_at}]);setSelF(null);setFs("");setFqty("100");setFcat("All");}
  async function delF(id){await supabase.from("food_log").delete().eq("id",id);setFLog(prev=>prev.filter(f=>f.id!==id));}
  async function logPR(){if(!prW||!user)return;const{data,e}=await supabase.from("prs").insert({user_id:user.id,lift:prLift,weight:parseFloat(prW),reps:parseInt(prR)||1}).select().single();if(!e&&data)setPrs(prev=>({...prev,[prLift]:[...(prev[prLift]||[]),{weight:data.weight,reps:data.reps,date:data.logged_at,id:data.id}]}));setPrW("");setPrR("");}
  async function saveMs(){if(!user)return;const{data,e}=await supabase.from("measurements").insert({user_id:user.id,data:mIn}).select().single();if(!e&&data)setMeas(prev=>[...prev,{...data.data,date:data.logged_at,id:data.id}]);setMIn({});}
  async function togEx(k){const u={...dEx,[k]:!dEx[k]};setDEx(u);await local.set(`dex_${user?.id}`,u);}
  async function togSup(k){const u={...dSup,[k]:!dSup[k]};setDSup(u);await local.set(`dsu_${user?.id}`,u);}

  const p=prof||{};
  const cw=wLog.length>0?wLog[wLog.length-1].weight:parseFloat(p.current_weight)||70;
  const gw=parseFloat(p.goal_weight)||75;
  const dur=parseInt(p.duration_months)||12;
  const mode=gw<cw?"cut":"bulk";
  const nut=calcNut(cw,parseFloat(p.height)||170,parseInt(p.age)||21,p.gender||"male",mode);
  const wo=dur>=10?WO.intermediate:WO.beginner;
  const todDow=new Date().getDay()===0?6:new Date().getDay()-1;
  const todWO=wo.days[todDow];
  const wkDates=getWeekDates(weekOff);
  const todF=fLog.filter(f=>new Date(f.date).toDateString()===new Date().toDateString());
  const mCal=todF.reduce((s,f)=>s+f.cal,0);
  const mProt=todF.reduce((s,f)=>s+f.p,0);
  const calPct=Math.min(100,Math.round(mCal/nut.cals*100));
  const proPct=Math.min(100,Math.round(mProt/nut.protein*100));
  const exDone=todWO.ex.filter((_,i)=>dEx[`${todDow}-${i}`]).length;
  const cats=["All",...new Set(FOODS.map(f=>f.cat))];
  const results=FOODS.filter(f=>(fs.length<1||f.n.toLowerCase().includes(fs.toLowerCase()))&&(fcat==="All"||f.cat===fcat)).slice(0,8);
  const wChart=wLog.slice(-14).map(w=>({v:w.weight,label:new Date(w.date).toLocaleDateString("en",{day:"numeric",month:"short"})}));
  const sw=parseFloat(p.current_weight)||cw;
  const prog=gw===sw?0:Math.min(100,Math.max(0,Math.round(Math.abs(cw-sw)/Math.abs(gw-sw)*100)));

  const IS={background:"#1c1c1c",border:"1.5px solid #2c2c2e",borderRadius:12,padding:"12px 14px",color:"#fff",fontFamily:"inherit",fontSize:15};
  const IS2={...IS,background:T.inputBg,border:`1.5px solid ${T.inputBorder}`,color:T.text};

  if(screen==="loading")return<div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}><div style={{fontSize:48}}>⚡</div><Spin/></div>;

  if(screen==="auth"){
    if(showVal){const vr=isReal(setup.weight,setup.goalWeight,setup.months);return(
      <div style={{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:"'Inter',sans-serif",overflowY:"auto",padding:"36px 20px 40px"}}>
        <div style={{maxWidth:420,margin:"0 auto"}}>
          <button onClick={()=>setShowVal(false)} style={{background:"transparent",border:"none",color:DARK.green,fontSize:15,cursor:"pointer",fontFamily:"inherit",marginBottom:24,padding:0}}>← Back</button>
          <div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:56,marginBottom:10}}>{vr.ok?"✅":"⚠️"}</div><h2 style={{fontSize:26,fontWeight:800,color:vr.ok?DARK.green:DARK.gold,marginBottom:6}}>{vr.ok?"Goal is Achievable!":"Let's Adjust"}</h2><p style={{color:"#636366",fontSize:14}}>Honest assessment of your plan</p></div>
          <div style={{background:"#111",borderRadius:20,padding:18,marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[{l:"Start",v:`${setup.weight}kg`},{l:"Goal",v:`${setup.goalWeight}kg`},{l:"Change",v:`${(parseFloat(setup.goalWeight)-parseFloat(setup.weight)>0?"+":"")}${(parseFloat(setup.goalWeight)-parseFloat(setup.weight)).toFixed(1)}kg`,c:vr.isCut?DARK.red:DARK.green},{l:"Duration",v:`${setup.months}mo`},{l:"Min Needed",v:`${vr.minMo}mo`,c:parseInt(setup.months)>=vr.minMo?DARK.green:DARK.red},{l:"Max Possible",v:`${vr.maxP}kg`,c:DARK.green}].map(s=>(
                <div key={s.l} style={{background:"#1a1a1a",borderRadius:12,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:17,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div><div style={{fontSize:10,color:"#636366",marginTop:2}}>{s.l}</div></div>
              ))}
            </div>
          </div>
          {!vr.ok&&<div style={{background:"rgba(255,214,10,.07)",border:"1px solid rgba(255,214,10,.2)",borderRadius:16,padding:16,marginBottom:16}}><p style={{fontSize:13,color:DARK.gold,lineHeight:1.7,margin:"0 0 12px"}}>In <strong>{setup.months} months</strong> you can reach <strong>{vr.maxP}kg</strong>. To reach {setup.goalWeight}kg you need at least <strong>{vr.minMo} months</strong>.</p><div style={{display:"flex",gap:8}}><button onClick={()=>{setSetup(s=>({...s,goalWeight:String(vr.maxP)}));setShowVal(false);}} style={{flex:1,background:"rgba(255,214,10,.1)",border:"1px solid rgba(255,214,10,.25)",borderRadius:10,padding:10,color:DARK.gold,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Use {vr.maxP}kg</button><button onClick={()=>{setSetup(s=>({...s,months:String(vr.minMo)}));setShowVal(false);}} style={{flex:1,background:"rgba(255,214,10,.1)",border:"1px solid rgba(255,214,10,.25)",borderRadius:10,padding:10,color:DARK.gold,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Extend to {vr.minMo}mo</button></div></div>}
          {err&&<div style={{fontSize:13,color:DARK.red,marginBottom:12,textAlign:"center"}}>{err}</div>}
          <Btn onClick={finalize} color={DARK.green} disabled={loading}>{loading?<Spin/>:vr.ok?"Let's Go 🚀":"Accept & Continue →"}</Btn>
        </div>
      </div>
    );}

    return(
      <div style={{minHeight:"100vh",background:"#000",color:"#fff",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:400,paddingTop:20}} className="fu">
          <div style={{textAlign:"center",marginBottom:36}}><div style={{fontSize:48,marginBottom:10}}>⚡</div><h1 style={{fontSize:34,fontWeight:900,letterSpacing:-1,marginBottom:6}}>Physique</h1><p style={{color:"#636366",fontSize:14}}>Your transformation tracker</p></div>
          {forgot?(
            <div className="fu">
              <h2 style={{fontSize:22,fontWeight:700,marginBottom:6}}>Reset Password</h2>
              <p style={{color:"#636366",fontSize:13,marginBottom:22}}>Enter your email and we'll send a reset link</p>
              {fDone?<div style={{background:"rgba(48,209,88,.08)",border:"1px solid rgba(48,209,88,.25)",borderRadius:16,padding:20,textAlign:"center",marginBottom:20}}><div style={{fontSize:36,marginBottom:8}}>📧</div><div style={{color:DARK.green,fontWeight:700,marginBottom:4}}>Email sent!</div><div style={{color:"#636366",fontSize:13}}>Check your inbox for the reset link</div></div>:<>
                <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="your@email.com" type="email" style={{...IS,width:"100%",marginBottom:12}}/>
                {err&&<div style={{fontSize:13,color:DARK.red,marginBottom:12}}>{err}</div>}
                <Btn onClick={doForgot} color={DARK.green} disabled={loading||!fEmail}>{loading?<Spin/>:"Send Reset Link"}</Btn>
              </>}
              <button onClick={()=>{setForgot(false);setFDone(false);setFEmail("");setErr("");}} style={{width:"100%",marginTop:12,background:"transparent",border:"none",color:"#636366",fontSize:15,cursor:"pointer",fontFamily:"inherit",padding:10}}>← Back to Sign In</button>
            </div>
          ):(
            <>
              <div style={{display:"flex",background:"#111",borderRadius:14,padding:4,marginBottom:26}}>
                {["login","signup"].map(m=><button key={m} onClick={()=>{setAtab(m);setStep(0);setErr("");}} style={{flex:1,padding:"11px",border:"none",borderRadius:11,background:atab===m?"#2c2c2e":"transparent",color:atab===m?"#fff":"#636366",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",textTransform:"capitalize"}}>{m==="login"?"Sign In":"Sign Up"}</button>)}
              </div>
              {atab==="login"?(
                <div className="fu">
                  <div style={{marginBottom:14}}><div style={{fontSize:13,fontWeight:500,color:"#636366",marginBottom:6}}>Email</div><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" type="email" style={{...IS,width:"100%"}}/></div>
                  <div style={{marginBottom:6}}><div style={{fontSize:13,fontWeight:500,color:"#636366",marginBottom:6}}>Password</div><input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" type="password" style={{...IS,width:"100%"}}/></div>
                  <button onClick={()=>{setForgot(true);setErr("");}} style={{background:"transparent",border:"none",color:DARK.green,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginBottom:18,padding:0}}>Forgot password?</button>
                  {err&&<div style={{fontSize:13,color:DARK.red,marginBottom:12}}>{err}</div>}
                  <Btn onClick={doLogin} color={DARK.green} disabled={loading}>{loading?<Spin/>:"Sign In"}</Btn>
                </div>
              ):(
                <div className="fu">
                  <div style={{display:"flex",gap:5,marginBottom:22}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:3.5,borderRadius:999,background:i<=step?DARK.green:"#222",transition:"background .3s"}}/>)}</div>
                  <div style={{fontSize:11,color:"#636366",marginBottom:14,letterSpacing:.8,textTransform:"uppercase",fontWeight:600}}>Step {step+1} of 3</div>
                  {step===0&&<div className="fu">
                    {[{l:"Name",k:"name",ph:"Your name"},{l:"Email *",k:"email",ph:"your@email.com",t:"email"},{l:"Password *",k:"password",ph:"Min 6 characters",t:"password"}].map(f=><div key={f.k} style={{marginBottom:14}}><div style={{fontSize:13,fontWeight:500,color:"#636366",marginBottom:6}}>{f.l}</div><input value={setup[f.k]} onChange={e=>setSetup({...setup,[f.k]:e.target.value})} placeholder={f.ph} type={f.t||"text"} style={{...IS,width:"100%"}}/></div>)}
                  </div>}
                  {step===1&&<div className="fu">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Age *</div><input value={setup.age} onChange={e=>setSetup({...setup,age:e.target.value})} placeholder="21" type="number" style={{...IS,width:"100%"}}/></div>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Gender</div><select value={setup.gender} onChange={e=>setSetup({...setup,gender:e.target.value})} style={{...IS,width:"100%",appearance:"none"}}><option value="male">Male</option><option value="female">Female</option></select></div>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Height (cm) *</div><input value={setup.height} onChange={e=>setSetup({...setup,height:e.target.value})} placeholder="173" type="number" style={{...IS,width:"100%"}}/></div>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Weight (kg) *</div><input value={setup.weight} onChange={e=>setSetup({...setup,weight:e.target.value})} placeholder="65" type="number" style={{...IS,width:"100%"}}/></div>
                    </div>
                    <div style={{marginTop:4}}><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Activity Level</div><select value={setup.activity} onChange={e=>setSetup({...setup,activity:e.target.value})} style={{...IS,width:"100%",appearance:"none"}}><option value="sedentary">Sedentary (desk job)</option><option value="light">Light (1-3x/week)</option><option value="moderate">Moderate (3-5x/week)</option><option value="active">Very active (6-7x/week)</option></select></div>
                  </div>}
                  {step===2&&<div className="fu">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Goal Weight (kg) *</div><input value={setup.goalWeight} onChange={e=>setSetup({...setup,goalWeight:e.target.value})} placeholder="75" type="number" style={{...IS,width:"100%"}}/></div>
                      <div><div style={{fontSize:12,color:"#636366",marginBottom:5}}>Duration (months) *</div><input value={setup.months} onChange={e=>setSetup({...setup,months:e.target.value})} placeholder="12" type="number" style={{...IS,width:"100%"}}/></div>
                    </div>
                    <div style={{fontSize:13,fontWeight:500,color:"#636366",marginBottom:10}}>How do you want to look? *</div>
                    {GOALS.map(g=><div key={g.id} onClick={()=>setSetup({...setup,goalLook:g.id})} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:14,border:`1.5px solid ${setup.goalLook===g.id?DARK.green:"#222"}`,background:setup.goalLook===g.id?"rgba(48,209,88,.06)":"#111",marginBottom:8,cursor:"pointer",transition:"all .2s"}}><span style={{fontSize:20}}>{g.icon}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:setup.goalLook===g.id?DARK.green:"#fff"}}>{g.label}</div><div style={{fontSize:11,color:"#636366"}}>{g.desc} · {g.bf}</div></div>{setup.goalLook===g.id&&<div style={{width:20,height:20,borderRadius:"50%",background:DARK.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:700}}>✓</div>}</div>)}
                  </div>}
                  {err&&<div style={{fontSize:13,color:DARK.red,marginBottom:12,marginTop:4}}>{err}</div>}
                  <Btn onClick={doSignup} color={DARK.green} disabled={loading}>{loading?<Spin/>:step<2?"Continue →":"Check My Goal →"}</Btn>
                  {step>0&&<button onClick={()=>{setStep(s=>s-1);setErr("");}} style={{width:"100%",marginTop:10,background:"transparent",border:"none",color:"#636366",fontSize:15,cursor:"pointer",fontFamily:"inherit",padding:10}}>← Back</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if(screen!=="app")return null;

  const TABS=[{id:"home",e:"🏠",l:"Home"},{id:"plan",e:"📅",l:"Plan"},{id:"food",e:"🍗",l:"Food"},{id:"stats",e:"📊",l:"Stats"},{id:"settings",e:"⚙️",l:"Settings"}];

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif",color:T.text,paddingBottom:88}}>
      <div style={{background:T.tabBar,borderBottom:`1px solid ${T.border}`,padding:"14px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
        <div><h1 style={{fontSize:22,fontWeight:900,letterSpacing:-1,color:T.text,margin:0}}>Physique</h1><div style={{fontSize:11,color:T.muted,marginTop:1,fontWeight:500}}>{p.name||"Athlete"} · {mode==="cut"?"Cutting 🔪":"Bulking 💪"}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:900,color:ac,letterSpacing:-1}}>{cw}<span style={{fontSize:14,fontWeight:500,color:T.muted}}> kg</span></div><div style={{fontSize:11,color:T.muted}}>BMI {bmi(cw,parseFloat(p.height)||170)}</div></div>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"14px 14px"}}>

        {tab==="home"&&<div className="fu">
          <Card T={T} style={{marginBottom:12}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <Ring pct={prog} color={ac} size={82} stroke={7} T={T}><div style={{fontSize:17,fontWeight:900,color:ac}}>{prog}%</div></Ring>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:5}}>Goal Progress</div><div style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:-.5}}>{cw} → {gw} kg</div><div style={{fontSize:12,color:T.muted,marginTop:3}}>{Math.round(Math.abs(gw-cw)*10)/10}kg remaining · {dur} month plan</div></div>
            </div>
          </Card>
          <Card T={T} style={{marginBottom:12}}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
              <Ring pct={calPct} color={T.orange} size={72} stroke={6} T={T}><div style={{fontSize:12,fontWeight:900,color:T.orange}}>{calPct}%</div></Ring>
              <div style={{flex:1}}><div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:4}}>Today's Calories</div><div style={{fontSize:30,fontWeight:900,color:T.gold,letterSpacing:-1}}>{nut.cals}<span style={{fontSize:13,color:T.muted,fontWeight:400}}> target</span></div><div style={{fontSize:12,color:T.muted}}>{mCal} logged · {Math.max(0,nut.cals-mCal)} left</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[{l:"Protein",v:nut.protein,log:Math.round(mProt),c:T.red},{l:"Carbs",v:nut.carbs,log:Math.round(todF.reduce((s,f)=>s+f.c,0)),c:T.orange},{l:"Fats",v:nut.fats,log:Math.round(todF.reduce((s,f)=>s+f.f,0)),c:T.teal}].map(m=>(
                <div key={m.l} style={{background:T.card2,borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${T.border}`}}><div style={{fontSize:17,fontWeight:800,color:m.c}}>{m.v}g</div><div style={{fontSize:10,color:T.muted,marginTop:1}}>{m.log}g logged</div><div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{m.l}</div></div>
              ))}
            </div>
          </Card>
          <Card T={T} onClick={()=>setTab("plan")} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>Today's Workout</div><span style={{fontSize:11,fontWeight:700,color:ac,background:`${ac}18`,padding:"3px 10px",borderRadius:999}}>{todWO.tag}</span></div>
            <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:10,letterSpacing:-.3}}>{todWO.f}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,marginBottom:10}}><span>{todWO.ex.length} exercises</span><span style={{color:ac,fontWeight:600}}>{exDone}/{todWO.ex.length} done</span></div>
            <div style={{height:4,borderRadius:999,background:T.border2,overflow:"hidden"}}><div style={{height:"100%",width:`${exDone/todWO.ex.length*100}%`,background:ac,borderRadius:999,transition:"width .4s ease"}}/></div>
          </Card>
          <Card T={T}>
            <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>Log Weight</div>
            <div style={{display:"flex",gap:8,marginBottom:wChart.length>1?16:0}}>
              <input value={newW} onChange={e=>setNewW(e.target.value)} placeholder={`e.g. ${cw}`} type="number" step=".1" style={{flex:1,...IS2}}/>
              <button onClick={logW} style={{background:ac,color:"#000",border:"none",borderRadius:12,padding:"12px 22px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
            </div>
            {wChart.length>1&&<Chart data={wChart} color={ac} T={T} h={88}/>}
          </Card>
        </div>}

        {tab==="plan"&&<div className="fu">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button onClick={()=>setWeekOff(w=>w-1)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"9px 18px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:16}}>←</button>
            <div style={{textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:T.text}}>{weekOff===0?"This Week":weekOff===1?"Next Week":weekOff===-1?"Last Week":`Week ${weekOff>0?"+":""}${weekOff}`}</div><div style={{fontSize:11,color:T.muted}}>{wkDates[0].toLocaleDateString("en",{month:"short",day:"numeric"})} – {wkDates[6].toLocaleDateString("en",{month:"short",day:"numeric"})}</div></div>
            <button onClick={()=>setWeekOff(w=>w+1)} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"9px 18px",color:T.text,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:16}}>→</button>
          </div>
          {wkDates.map((date,i)=>{const w=wo.days[i],isTod=date.toDateString()===new Date().toDateString(),dc=w.ex.filter((_,j)=>dEx[`${i}-${j}`]).length,isSel=selDay===i;return(
            <div key={i}>
              <Card T={T} onClick={()=>setSelDay(isSel?null:i)} style={{marginBottom:8,background:isTod?`${ac}08`:T.card,border:`1px solid ${isTod?ac+"30":isSel?T.border2:T.border}`}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:46,textAlign:"center",flexShrink:0}}><div style={{fontSize:10,color:isTod?ac:T.muted,fontWeight:700,letterSpacing:.5}}>{DAYS[i]}</div><div style={{fontSize:24,fontWeight:900,color:isTod?ac:T.text}}>{date.getDate()}</div></div>
                  <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:T.text,marginBottom:4}}>{w.f}</div><div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:10,fontWeight:700,color:w.tag==="REST"?T.muted:ac,background:w.tag==="REST"?T.dim:`${ac}15`,padding:"2px 9px",borderRadius:999}}>{w.tag}</span>{weekOff===0&&w.tag!=="REST"&&<span style={{fontSize:11,color:T.muted,fontWeight:500}}>{dc}/{w.ex.length} done</span>}</div></div>
                  {isTod&&<div style={{width:8,height:8,borderRadius:"50%",background:ac,flexShrink:0,animation:"pulse 2s infinite"}}/>}
                </div>
              </Card>
              {isSel&&<div className="fu" style={{background:T.card2,borderRadius:16,padding:14,marginBottom:10,marginTop:-4,border:`1px solid ${T.border}`}}>
                {w.ex.map((ex,j)=>{const k=`${i}-${j}`,done=dEx[k];return(
                  <div key={j} onClick={()=>togEx(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,background:done?`${ac}08`:T.dim,border:`1px solid ${done?ac+"30":T.border}`,marginBottom:6,cursor:"pointer",transition:"all .2s"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:done?ac:T.card,border:`2px solid ${done?ac:T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:700,flexShrink:0,transition:"all .2s"}}>{done?"✓":""}</div>
                    <span style={{fontSize:13,fontWeight:500,color:done?T.muted:T.text,textDecoration:done?"line-through":"none"}}>{ex}</span>
                  </div>
                );})}
              </div>}
            </div>
          );})}
          <div style={{fontSize:13,fontWeight:700,color:T.text,margin:"20px 0 10px"}}>💊 Supplements</div>
          {SUPPS.map((blk,bi)=><Card key={bi} T={T} style={{marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10}}>{blk.time}</div>
            {blk.items.map((item,ii)=>{const k=`s${bi}-${ii}`,done=dSup[k];return(
              <div key={ii} onClick={()=>togSup(k)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:done?`${T.purple}08`:T.dim,border:`1px solid ${done?T.purple+"30":T.border}`,marginBottom:6,cursor:"pointer",transition:"all .2s"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:done?T.purple:T.card,border:`2px solid ${done?T.purple:T.border2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,flexShrink:0}}>{done?"✓":""}</div>
                <span style={{fontSize:13,fontWeight:500,color:done?T.muted:T.text,textDecoration:done?"line-through":"none",flex:1}}>{item.n}</span>
                <span style={{fontSize:11,color:T.muted}}>{item.d}</span>
              </div>
            );})}
          </Card>)}
        </div>}

        {tab==="food"&&<div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[{l:"Calories",v:mCal,t:nut.cals,c:T.gold,pct:calPct},{l:"Protein",v:`${Math.round(mProt)}g`,t:`${nut.protein}g`,c:T.red,pct:proPct}].map(m=>(
              <Card key={m.l} T={T}><div style={{display:"flex",alignItems:"center",gap:10}}><Ring pct={m.pct} color={m.c} size={52} stroke={5} T={T}><div style={{fontSize:10,fontWeight:900,color:m.c}}>{m.pct}%</div></Ring><div><div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:.6,fontWeight:700}}>{m.l}</div><div style={{fontSize:18,fontWeight:900,color:m.c,letterSpacing:-.5}}>{m.v}</div><div style={{fontSize:10,color:T.muted}}>/ {m.t}</div></div></div></Card>
            ))}
          </div>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>Add Food</div>
            <input value={fs} onChange={e=>{setFs(e.target.value);setSelF(null);}} placeholder="Search 90+ foods..." style={{width:"100%",...IS2,marginBottom:10}}/>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
              {cats.map(cat=><button key={cat} onClick={()=>{setFcat(cat);setSelF(null);}} style={{padding:"5px 12px",borderRadius:999,border:`1px solid ${fcat===cat?ac+"50":T.border}`,background:fcat===cat?`${ac}12`:T.card2,color:fcat===cat?ac:T.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",whiteSpace:"nowrap",flexShrink:0}}>{cat}</button>)}
            </div>
            {!selF&&results.length>0&&<div style={{background:T.card2,borderRadius:14,overflow:"hidden",border:`1px solid ${T.border}`,marginBottom:10}}>
              {results.map((f,i)=><div key={i} onClick={()=>{setSelF(f);setFs(f.n);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:i<results.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}><div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{f.n}</div><div style={{fontSize:10,color:T.muted}}>{f.cat}</div></div><div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:T.red,fontWeight:600}}>{f.p}g P</span><span style={{color:T.muted}}>{f.cal}cal</span></div></div>)}
            </div>}
            {selF&&<div className="pi" style={{background:`${ac}07`,border:`1px solid ${ac}25`,borderRadius:14,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:ac}}>{selF.n}</div><button onClick={()=>{setSelF(null);setFs("");}} style={{background:"transparent",border:"none",color:T.muted,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button></div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}><input value={fqty} onChange={e=>setFqty(e.target.value)} type="number" placeholder="100" style={{width:76,...IS2}}/><span style={{fontSize:13,color:T.muted}}>{selF.unit}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
                {[{l:"kcal",v:Math.round(selF.cal*parseFloat(fqty||0)/100),c:T.gold},{l:"Protein",v:`${Math.round(selF.p*parseFloat(fqty||0)/100*10)/10}g`,c:T.red},{l:"Carbs",v:`${Math.round(selF.c*parseFloat(fqty||0)/100*10)/10}g`,c:T.orange},{l:"Fat",v:`${Math.round(selF.f*parseFloat(fqty||0)/100*10)/10}g`,c:T.teal}].map(s=><div key={s.l} style={{textAlign:"center",background:T.card2,borderRadius:10,padding:"8px 4px",border:`1px solid ${T.border}`}}><div style={{fontSize:14,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:9,color:T.muted}}>{s.l}</div></div>)}
              </div>
              <Btn onClick={logF} color={ac} style={{color:"#000"}}>+ Add to Log</Btn>
            </div>}
          </Card>
          <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:10}}>Today's Log</div>
          {todF.length===0?<Card T={T}><p style={{color:T.muted,fontSize:13,textAlign:"center",margin:0}}>Nothing logged yet today 🍽️</p></Card>:todF.map((f,i)=>(
            <Card key={i} T={T} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontSize:13,fontWeight:600,color:T.text,flex:1,paddingRight:8}}>{f.name}</div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontSize:15,fontWeight:800,color:T.gold}}>{f.cal}<span style={{fontSize:10,fontWeight:400,color:T.muted}}> cal</span></div><button onClick={()=>delF(f.id)} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:18,padding:"0 2px",lineHeight:1}}>×</button></div></div>
              <div style={{display:"flex",gap:12,fontSize:11}}><span style={{color:T.muted}}>{f.qty}{f.unit}</span><span style={{color:T.red,fontWeight:600}}>P:{f.p}g</span><span style={{color:T.orange,fontWeight:600}}>C:{f.c}g</span><span style={{color:T.teal,fontWeight:600}}>F:{f.f}g</span></div>
            </Card>
          ))}
        </div>}

        {tab==="stats"&&<div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
            {[{l:"Current",v:`${cw}kg`,c:ac},{l:"Goal",v:`${gw}kg`,c:T.green},{l:"BMI",v:bmi(cw,parseFloat(p.height)||170),c:T.orange}].map(s=><Card key={s.l} T={T} style={{textAlign:"center",padding:"14px 8px"}}><div style={{fontSize:22,fontWeight:900,color:s.c,letterSpacing:-.5}}>{s.v}</div><div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginTop:2}}>{s.l}</div></Card>)}
          </div>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>Weight History</div><button onClick={()=>{if(window.confirm("Reset to starting weight only?"))resetW();}} style={{background:`${T.red}12`,border:`1px solid ${T.red}25`,borderRadius:8,padding:"5px 12px",color:T.red,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Reset</button></div>
            {wChart.length>1&&<div style={{marginBottom:14}}><Chart data={wChart} color={ac} T={T} h={100}/></div>}
            <div style={{maxHeight:240,overflowY:"auto"}}>
              {[...wLog].reverse().map((e,i)=>{
                const ri=wLog.length-1-i,prev=ri>0?wLog[ri-1]:null,ch=prev?(e.weight-prev.weight).toFixed(1):null,isEd=editId===e.id;
                return(<div key={e.id||i} style={{padding:"10px 0",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1}}><div style={{fontSize:11,color:T.muted,fontWeight:500}}>{new Date(e.date).toLocaleDateString("en",{day:"numeric",month:"short",year:"2-digit"})}</div></div>
                  {isEd?<div style={{display:"flex",gap:6,alignItems:"center"}}><input value={editV} onChange={ev=>setEditV(ev.target.value)} type="number" step=".1" style={{width:70,...IS2}}/><button onClick={()=>updW(e.id,editV)} style={{background:ac,border:"none",borderRadius:8,padding:"5px 10px",color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Save</button><button onClick={()=>setEditId(null)} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>:<>
                    <div style={{fontSize:15,fontWeight:800,color:T.text}}>{e.weight}<span style={{fontSize:11,fontWeight:400,color:T.muted}}> kg</span></div>
                    {ch!==null&&<div style={{fontSize:11,fontWeight:700,color:parseFloat(ch)>0?(mode==="bulk"?T.green:T.red):(mode==="bulk"?T.red:T.green),minWidth:36,textAlign:"right"}}>{parseFloat(ch)>0?"+":""}{ch}</div>}
                    <button onClick={()=>{setEditId(e.id);setEditV(String(e.weight));}} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:14,padding:"2px 4px"}}>✎</button>
                    {ri>0&&<button onClick={()=>delW(e.id)} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:18,padding:"2px 2px",lineHeight:1}}>×</button>}
                  </>}
                </div>);
              })}
            </div>
          </Card>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Personal Records 🏆</div>
            <select value={prLift} onChange={e=>setPrLift(e.target.value)} style={{width:"100%",...IS2,marginBottom:10,appearance:"none"}}>{PR_LIFTS.map(l=><option key={l} value={l}>{l}</option>)}</select>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <input value={prW} onChange={e=>setPrW(e.target.value)} placeholder="Weight (kg)" type="number" step=".5" style={IS2}/>
              <input value={prR} onChange={e=>setPrR(e.target.value)} placeholder="Reps" type="number" style={IS2}/>
            </div>
            <Btn onClick={logPR} color={T.gold} style={{color:"#000",marginBottom:12}}>🏆 Log PR</Btn>
            {PR_LIFTS.filter(l=>prs[l]?.length>0).map(l=>{const best=prs[l].reduce((a,b)=>a.weight>b.weight?a:b);return<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:13,color:T.muted,fontWeight:500}}>{l}</span><span style={{fontSize:14,fontWeight:800,color:T.gold}}>🏆 {best.weight}kg × {best.reps}</span></div>;})}
            {Object.keys(prs).length===0&&<p style={{color:T.muted,fontSize:12,textAlign:"center",marginTop:8}}>Log your first PR!</p>}
          </Card>
          <Card T={T}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Body Measurements 📏</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {["Chest (cm)","Waist (cm)","Arms (cm)","Thighs (cm)","Shoulders (cm)","Hips (cm)"].map(m=><div key={m}><div style={{fontSize:11,color:T.muted,fontWeight:500,marginBottom:5}}>{m}</div><input value={mIn[m]||""} onChange={e=>setMIn({...mIn,[m]:e.target.value})} placeholder="cm" type="number" step=".5" style={{width:"100%",...IS2}}/></div>)}
            </div>
            <Btn onClick={saveMs} color={T.teal} style={{color:"#000"}}>Save Measurements</Btn>
            {meas.length>0&&<div style={{marginTop:14}}><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:8}}>Latest — {new Date(meas[meas.length-1].date).toLocaleDateString("en",{day:"numeric",month:"short"})}</div>{Object.entries(meas[meas.length-1]).filter(([k])=>k!=="date"&&k!=="id"&&k!=="user_id").map(([k,v])=>{const prev=meas.length>1?meas[meas.length-2][k]:null,ch=prev?(parseFloat(v)-parseFloat(prev)).toFixed(1):null;return<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:12,color:T.muted,fontWeight:500}}>{k}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:14,fontWeight:700,color:T.teal}}>{v} cm</span>{ch!==null&&<span style={{fontSize:11,fontWeight:600,color:parseFloat(ch)>0?T.green:T.red}}>{parseFloat(ch)>0?"+":""}{ch}</span>}</div></div>;})}</div>}
          </Card>
        </div>}

        {tab==="settings"&&<div className="fu">
          <Card T={T} style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:58,height:58,borderRadius:"50%",background:`${ac}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`2px solid ${ac}30`,flexShrink:0}}>{p.name?p.name[0].toUpperCase():"A"}</div>
              <div><div style={{fontSize:20,fontWeight:800,color:T.text,letterSpacing:-.3}}>{p.name||"Athlete"}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{user?.email}</div><div style={{fontSize:12,color:ac,marginTop:3,fontWeight:500}}>{p.height}cm · {p.age}yo · {p.gender}</div></div>
            </div>
          </Card>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Your Plan</div>
            {[{l:"Current Weight",v:`${cw} kg`},{l:"Goal Weight",v:`${gw} kg`},{l:"Goal Look",v:GOALS.find(g=>g.id===p.goal_look)?.label||"—"},{l:"Duration",v:`${dur} months`},{l:"Daily Calories",v:`${nut.cals} kcal`},{l:"Daily Protein",v:`${nut.protein}g`},{l:"Workout Split",v:wo.name}].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:13,color:T.muted,fontWeight:500}}>{s.l}</span><span style={{fontSize:13,fontWeight:700,color:T.text}}>{s.v}</span></div>
            ))}
          </Card>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Appearance</div>
            <div style={{display:"flex",background:T.card2,borderRadius:12,padding:4,border:`1px solid ${T.border}`}}>
              {["dark","light"].map(m=><button key={m} onClick={()=>setTheme(m)} style={{flex:1,padding:"11px",border:"none",borderRadius:9,background:theme===m?T.bg2:"transparent",color:theme===m?T.text:T.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{m==="dark"?"🌙 Dark":"☀️ Light"}</button>)}
            </div>
          </Card>
          <Card T={T} style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:14}}>Supplement Guide</div>
            {[{n:"Creatine Monohydrate",p:"5g daily — most important",c:T.red},{n:"Whey Protein",p:"Post-workout, 25–30g",c:T.orange},{n:"Omega-3 Fish Oil",p:"2 caps with food",c:T.teal},{n:"Multivitamin",p:"Morning with breakfast",c:ac},{n:"Ashwagandha KSM-66",p:"300mg morning & night",c:T.purple}].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.n}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.p}</div></div><div style={{width:8,height:8,borderRadius:"50%",background:s.c,flexShrink:0}}/></div>
            ))}
          </Card>
          <button onClick={logout} style={{width:"100%",padding:"16px",borderRadius:14,background:`${T.red}10`,border:`1px solid ${T.red}25`,color:T.red,fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"inherit"}}>Log Out</button>
        </div>}

      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.tabBar,borderTop:`1px solid ${T.border}`,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        <div style={{display:"flex",maxWidth:640,margin:"0 auto"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all .15s"}}>
              <span style={{fontSize:21,lineHeight:1}}>{t.e}</span>
              <span style={{fontSize:10,fontWeight:700,color:tab===t.id?ac:T.muted,letterSpacing:.2,transition:"color .15s"}}>{t.l}</span>
              {tab===t.id&&<div style={{width:4,height:4,borderRadius:"50%",background:ac}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
