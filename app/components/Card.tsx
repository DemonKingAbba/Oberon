export function Card({ title, badge, badgeColor, children }: {
  title: string;
  badge?: string;
  badgeColor?: "red" | "amber" | "blue";
  children: React.ReactNode;
}){
  const color =
    badgeColor === "red" ? "var(--red)" :
    badgeColor === "amber" ? "var(--amber)" :
    "var(--blue)";

  return (
    <div style={{
      background:"var(--surface)",
      borderRadius:"var(--radius)",
      padding:16,
      boxShadow:"0 8px 24px rgba(0,0,0,0.25)",
      border:"1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
        <div style={{fontSize:16,fontWeight:700}}>{title}</div>
        {badge ? (
          <div style={{padding:"4px 10px",borderRadius:999,fontSize:12,fontWeight:700,color:"black",background:color}}>
            {badge}
          </div>
        ) : null}
      </div>
      <div style={{marginTop:10,color:"var(--muted)",fontSize:13,lineHeight:1.35}}>
        {children}
      </div>
    </div>
  );
}
