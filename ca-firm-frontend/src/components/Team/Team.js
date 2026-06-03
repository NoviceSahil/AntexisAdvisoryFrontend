import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            id: 1,
            name: 'John Doe',
            position: 'Senior Partner',
        },
        {
            id: 2,
            name: 'Jane Smith',
            position: 'Manager',
        },
        {
            id: 3,
            name: 'Michael Brown',
            position: 'Consultant',
        },
        {
            id: 4,
            name: 'Emily Davis',
            position: 'Accountant',
        },
    ];

    const initials = (name) => name.split(' ').map((part) => part[0]).join('');

    return (
        <main className="team-page">
            <section className="team-hero">
                <div className="team-hero-copy">
                    <span className="eyebrow">Leadership & Expertise</span>
                    <h1>Experienced professionals guiding every financial decision.</h1>
                    <p>Meet the team that delivers audit, compliance, taxation, and corporate advisory with precision.</p>
                </div>
            </section>

            <section className="team-grid">
                {teamMembers.map((member) => (
                    <article key={member.id} className="team-card">
                        <div className="team-avatar">{initials(member.name)}</div>
                        <h3>{member.name}</h3>
                        <p>{member.position}</p>
                    </article>
                ))}
            </section>
        </main>
    );
};

export default Team;
