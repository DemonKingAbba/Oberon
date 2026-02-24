export function Section({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:0.4}}>{title}</div>
        {subtitle ? <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}
