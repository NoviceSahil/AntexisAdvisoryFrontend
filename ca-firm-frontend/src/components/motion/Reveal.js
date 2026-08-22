import React from 'react';
import useReveal from '../../hooks/useReveal';

// Generic scroll-reveal wrapper. `as` picks the rendered element so it can
// wrap a <section>, a <div>, or (via asChild-style className passthrough)
// sit directly on a component that accepts className/style.
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const [ref, visible] = useReveal();
  const classes = ['reveal', delay ? 'stagger' : '', visible ? 'in' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag ref={ref} className={classes} style={{ '--stagger-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
