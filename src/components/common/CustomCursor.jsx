// Premium diamond cursor
import { useEffect, useRef } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const svgRef = useRef(null), ringRef = useRef(null), trailRef = useRef(null);
  const pos = useRef({x:-200,y:-200}), ringPos = useRef({x:-200,y:-200}), trailPos = useRef({x:-200,y:-200});
  const rafId = useRef(null);

  useEffect(() => {
    const lerp = (a,b,t) => a+(b-a)*t;
    const onMove = e => {
      pos.current = {x:e.clientX, y:e.clientY};
      if (svgRef.current) svgRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.14);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.14);
      trailPos.current.x = lerp(trailPos.current.x, pos.current.x, 0.06);
      trailPos.current.y = lerp(trailPos.current.y, pos.current.y, 0.06);
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px)`;
      if (trailRef.current) trailRef.current.style.transform = `translate(${trailPos.current.x}px,${trailPos.current.y}px)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    const onOver = e => {
      const isLink = !!e.target.closest("a,button,[role='button'],label,select,[tabindex='0'],input,textarea");
      [svgRef,ringRef,trailRef].forEach(r => r.current?.classList.toggle("cursor--hover", isLink));
    };
    const onClick = () => {
      svgRef.current?.classList.add("cursor--click");
      setTimeout(() => svgRef.current?.classList.remove("cursor--click"), 280);
    };
    window.addEventListener("mousemove", onMove, {passive:true});
    window.addEventListener("mouseover", onOver, {passive:true});
    window.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(rafId.current); window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseover",onOver); window.removeEventListener("click",onClick); };
  }, []);

  return (
    <>
      <div ref={trailRef} className="cursor-trail" aria-hidden="true"/>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
          <circle cx="19" cy="19" r="17" stroke="var(--mid)" strokeWidth="1.2" strokeDasharray="5 3" fill="none" className="cursor-ring__dash"/>
        </svg>
      </div>
      <div ref={svgRef} className="cursor-svg" aria-hidden="true">
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          {/* Diamond/spark shape */}
          <polygon points="10,1 19,10 10,19 1,10" fill="var(--deep)" opacity="0.9"/>
          <polygon points="10,4 16,10 10,16 4,10" fill="var(--white)" opacity="0.7"/>
          <circle cx="10" cy="10" r="2.5" fill="var(--terra)"/>
        </svg>
      </div>
    </>
  );
}
