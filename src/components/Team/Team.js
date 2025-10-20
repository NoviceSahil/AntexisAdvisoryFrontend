import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            id: 1,
            name: "John Doe",
            position: "Senior Partner",
            // image: "/path/to/john.jpg", // Replace with actual image path
        },
        {
            id: 2,
            name: "Jane Smith",
            position: "Manager",
            // image: "/path/to/jane.jpg", // Replace with actual image path
        },
        {
            id: 3,
            name: "Michael Brown",
            position: "Consultant",
            // image: "/path/to/michael.jpg", // Replace with actual image path
        },
        {
            id: 4,
            name: "Emily Davis",
            position: "Accountant",
            // image: "/path/to/emily.jpg", // Replace with actual image path
        },
    ];

    return (
        <div className="team-section">
            <h2 className="team-title">Meet Our Team</h2>
            <div className="team-list">
                {teamMembers.map(member => (
                    <div key={member.id} className="team-card">
                        <img src={member.image} alt={member.name} className="team-image" />
                        <h5 className="team-member-name">{member.name}</h5>
                        <p className="team-member-position">{member.position}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Team;
