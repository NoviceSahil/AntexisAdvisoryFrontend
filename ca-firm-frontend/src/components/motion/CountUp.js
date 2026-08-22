import React, { useEffect, useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Renders a number that counts up from 0 once scrolled into view - used
// for the trust stats (years of service, clients, etc). `pad` zero-pads
// the number (e.g. "08"), `suffix` appends text (e.g. "+").
const CountUp = ({ value, pad = 0, suffix = '' }) => {
  const [ref, visible] = useReveal(0.4);
  const [display, setDisplay] = useState(pad ? '0'.repeat(pad) : '0');
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;

    const format = (n) => (pad ? String(n).padStart(pad, '0') : String(n)) + suffix;

    if (reduceMotion()) {
      setDisplay(format(value));
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      setDisplay(format(Math.round(value * eased)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, pad, suffix]);

  return (
    <strong className="num" ref={ref}>
      {display}
    </strong>
  );
};

export default CountUp;
