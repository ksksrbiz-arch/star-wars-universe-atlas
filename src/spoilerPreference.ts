import {useSyncExternalStore} from 'react';

const STORAGE_KEY='atlas:hide-spoilers:v1';
const CHANGE_EVENT='atlas:spoiler-preference-changed';
// A session value also keeps the control usable when browser storage is blocked.
let sessionValue:boolean|undefined;
function snapshot(){
 if(sessionValue!==undefined)return sessionValue;
 try{return typeof window!=='undefined'&&window.localStorage.getItem(STORAGE_KEY)==='true';}
 catch{return false;}
}
function subscribe(notify:()=>void){
 const storage=(event:StorageEvent)=>{
  if(event.key!==STORAGE_KEY&&event.key!==null)return;
  sessionValue=event.newValue==='true';notify();
 };
 window.addEventListener(CHANGE_EVENT,notify);window.addEventListener('storage',storage);
 return()=>{window.removeEventListener(CHANGE_EVENT,notify);window.removeEventListener('storage',storage);};
}
function setHideSpoilers(value:boolean){
 sessionValue=value;
 try{window.localStorage.setItem(STORAGE_KEY,String(value));}catch{/* Session preference remains active. */}
 window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function useSpoilerPreference(){
 const hideSpoilers=useSyncExternalStore(subscribe,snapshot,()=>false);
 return {hideSpoilers,setHideSpoilers};
}
