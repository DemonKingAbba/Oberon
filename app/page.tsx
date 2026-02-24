"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { Section } from "./components/Section";
import { Card } from "./components/Card";

type GmailItem = { id:string; from:string; subject:string; type:"URGENT"|"FIX_REQUIRED"|"INFO"; title:string; body:string; drawing:string|null; };
type CalItem = { id:string; title:string; start:string; end:string; location:string|null; };

export default function Home(){
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [gmail,setGmail]=useState<GmailItem[]>([]);
  const [cal,setCal]=useState<CalItem[]>([]);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState<string|null>(null);

  async function refresh(){
    setErr(null); setLoading(true);
    try{
      const [g,c]=await Promise.all([fetch("/api/gmail").then(r=>r.json()), fetch("/api/calendar").then(r=>r.json())]);
      if (g?.error) throw new Error(g.error);
      if (c?.error) throw new Error(c.error);
      setGmail(g.items||[]); setCal(c.items||[]);
    }catch(e:any){ setErr(e?.message||"Failed"); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ if(signedIn) refresh(); },[signedIn]);

  const urgent = useMemo(()=> gmail.filter(x=>x.type==="URGENT"),[gmail]);
  const fix = useMemo(()=> gmail.filter(x=>x.type==="FIX_REQUIRED"),[gmail]);

  return (
    <div style={{minHeight:"100vh",padding:18,maxWidth:1100,margin:"0 auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"14px 16px",background:"var(--surface2)",borderRadius:"var(--radius)",border:"1px solid rgba(255,255,255,0.06)"}}>
        <div>
          <div style={{fontSize:18,fontWeight:900}}>OBERON — Web Lite</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Visual dashboard • Gmail + Calendar (read-only)</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {signedIn ? (
            <>
              <button onClick={refresh} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:"var(--text)",padding:"10px 12px",borderRadius:12,cursor:"pointer"}}>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button onClick={()=>signOut()} style={{background:"var(--blue)",border:"none",color:"#00121f",padding:"10px 12px",borderRadius:12,cursor:"pointer",fontWeight:800}}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={()=>signIn("google")} style={{background:"var(--blue)",border:"none",color:"#00121f",padding:"10px 12px",borderRadius:12,cursor:"pointer",fontWeight:800}}>
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {!signedIn ? <div style={{marginTop:18,color:"var(--muted)"}}>Sign in to load your Gmail & Calendar. Oberon stays read-only.</div> : null}
      {err ? <div style={{marginTop:14,padding:12,borderRadius:12,background:"rgba(255,77,77,0.12)",border:"1px solid rgba(255,77,77,0.3)"}}>{err}</div> : null}

      <main style={{marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <Section title="URGENT" subtitle="Immediate attention">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {urgent.length===0 ? <Card title="No urgent items" badge="OK" badgeColor="blue">Quiet night. Oberon sees no alarms in the last 7 days.</Card>
              : urgent.map(item=>(
                <Card key={item.id} title={item.title} badge="URGENT" badgeColor="red">
                  <div><b>From:</b> {item.from}</div>
                  {item.drawing ? <div><b>Drawing:</b> {item.drawing}</div> : null}
                  <div style={{marginTop:8}}>{item.body}</div>
                </Card>
              ))}
          </div>
        </Section>

        <Section title="FIX REQUIRED" subtitle="Change requests detected">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {fix.length===0 ? <Card title="No fix requests" badge="OK" badgeColor="blue">No detected “fix/change/revise” items.</Card>
              : fix.map(item=>(
                <Card key={item.id} title={item.title} badge="FIX" badgeColor="amber">
                  <div><b>From:</b> {item.from}</div>
                  {item.drawing ? <div><b>Drawing:</b> {item.drawing}</div> : null}
                  <div style={{marginTop:8}}>{item.body}</div>
                </Card>
              ))}
          </div>
        </Section>

        <Section title="CALENDAR" subtitle="Next 7 days">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {cal.length===0 ? <Card title="No upcoming events" badge="EMPTY" badgeColor="blue">Calendar returned no events in the next 7 days.</Card>
              : cal.map(ev=>(
                <Card key={ev.id} title={ev.title} badge="MEETING" badgeColor="blue">
                  <div><b>Start:</b> {ev.start}</div>
                  <div><b>End:</b> {ev.end}</div>
                  {ev.location ? <div><b>Location:</b> {ev.location}</div> : null}
                </Card>
              ))}
          </div>
        </Section>
      </main>

      <footer style={{marginTop:18,color:"var(--muted)",fontSize:12}}>
        WhatsApp ingestion is not included in web mode because WhatsApp has no general web-accessible API.
      </footer>
    </div>
  );
}
