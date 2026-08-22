import React from 'react';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Placeholder roster - swap in real names, roles and credentials when ready.
const teamMembers = [
  { id: 1, name: 'John Doe', position: 'Senior Partner', cred: 'FCA' },
  { id: 2, name: 'Jane Smith', position: 'Manager', cred: 'ACA' },
  { id: 3, name: 'Michael Brown', position: 'Consultant', cred: 'CA' },
  { id: 4, name: 'Emily Davis', position: 'Accountant', cred: 'CA Inter' }
];

const initials = (name) => name.split(' ').map((part) => part[0]).join('');

const Team = () => {
  useDocumentTitle('Team');
  return (
  <>
    <section className="page-hero panel">
      <span className="eyebrow">Leadership &amp; expertise</span>
      <h1>Experienced professionals guiding every financial decision.</h1>
      <p>Meet the team that delivers audit, compliance, taxation, and corporate advisory with precision.</p>
    </section>

    <section className="panel">
      <div className="team-grid">
        {teamMembers.map((member, i) => (
          <Reveal as="article" key={member.id} className="team-card" delay={i * 60}>
            <div className="team-avatar">{initials(member.name)}</div>
            <h3>{member.name}</h3>
            <p className="team-role">{member.position}</p>
            <span className="team-cred">{member.cred}</span>
          </Reveal>
        ))}
      </div>
    </section>
  </>
  );
};

export default Team;
