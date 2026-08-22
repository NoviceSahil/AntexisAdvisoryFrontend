import React from 'react';
import icaiLogo from '../../assets/icai.png';
import Reveal from '../motion/Reveal';

// The original "/path/to/icai-logo.png" etc. were never-filled-in
// placeholders that would 404. icai.png is the one real asset in the
// project; the other two use a text mark instead of a broken image path
// until real logo files are supplied.
const affiliations = [
  {
    id: 1,
    name: 'Institute of Chartered Accountants of India',
    desc: 'Governing body for chartered accountancy practice in India.',
    logo: icaiLogo
  },
  {
    id: 2,
    name: 'International Federation of Accountants',
    desc: 'Global organisation for the accountancy profession.',
    mark: 'IFAC'
  },
  {
    id: 3,
    name: 'Chartered Institute of Management Accountants',
    desc: 'International body for management accountancy.',
    mark: 'CIMA'
  }
];

const Affiliation = () => (
  <>
    <section className="page-hero panel">
      <span className="eyebrow">Affiliations</span>
      <h1>Held to the same standards our clients rely on.</h1>
      <p>Our practice is grounded in the frameworks and governance these bodies set for the profession.</p>
    </section>

    <section className="panel">
      <div className="cred-list">
        {affiliations.map((item, i) => (
          <Reveal as="div" key={item.id} className="cred-row" delay={i * 60}>
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="cred-mark" style={{ objectFit: 'contain', padding: 4 }} />
            ) : (
              <span className="cred-mark">{item.mark}</span>
            )}
            <div>
              <div className="cred-name">{item.name}</div>
              <div className="cred-desc">{item.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  </>
);

export default Affiliation;
