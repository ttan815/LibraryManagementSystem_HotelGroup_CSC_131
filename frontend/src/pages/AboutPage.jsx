import React from 'react';
import BasePage from './BasePage';
import './style.css';

/**
 * AboutPage Component - Michael Saldana
 * Team information and project credits page
 * Shows team members, roles, and contributions
 */
const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Simran Sandhu',
      role: 'Project Manager',
      contribution: 'Project Planning, Documentation, Coordination',
      avatar: 'S',
      education: [
        { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' },
        { year: '2025', institution: 'American River College', degree: 'Associate Degree' }
      ],
      professionalSkills: ['Problem Solving', 'Creativity', 'Adaptability'],
      technicalSkills: ['Python', 'C++', 'Object-Oriented Programming (OOP)'],
      awards: [],
      workExperience: [
        { year: 'Jun 2025 – Jul 2025', role: 'Flight Software Intern', company: 'Umbra, Santa Barbara, CA' },
        { year: 'Aug 2024 – Jun 2025', role: 'Student Robotics Developer', company: 'Business & Computer Lab, American River College' },
        { year: 'May 2019 – Present', role: 'Catering Event Manager', company: 'Kilted Pig BBQ' }
      ]
    },
    {
      name: 'Michael Saldana',
      role: 'Programmer (Full Stack Developer)',
      contribution: 'User Dashboard, Notifications, Reservation System',
      avatar: 'M',
      education: [
        { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' }
      ],
      professionalSkills: ['Problem Solving', 'Creativity', 'Adaptability'],
      technicalSkills: ['Python', 'Javascript', 'Java', 'React', 'SQL', 'CSS'],
      awards: [],
      workExperience: [
        { year: '2004 – 2024', role: 'Transportation Supervisor', company: 'Freight / Logistics Industry' }
      ]
    },
    {
      name: 'Wyatt Walker',
      role: 'Quality Control',
      contribution: 'Data validation, analysis, system testing',
      avatar: 'W',
      education: [
       { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' }
      ],
      professionalSkills: ['Problem Solving', 'Creativity', 'Adaptability'],
      technicalSkills: ['Python', 'Java', 'SQL'],
      awards: [],
      workExperience: [
        { year: 'Current', role: 'On-campus Staff', company: 'Peak Adventures' },
        { year: 'Summers', role: 'Youth Camp Manager', company: 'Seasonal Youth Programs' }
      ]
    },
    {
      name: 'Tony Tan',
      role: 'Programmer (Backend Developer)',
      contribution: 'Admin Dashboard, API Integration, Security, Authentication System',
      avatar: 'T',
      education: [
        { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' }
      ],
      professionalSkills: ['Problem Solving', 'Creativity', 'Adaptability'],
      technicalSkills: ['Python', 'C++', 'Javascript', 'React', 'SQL'],
      awards: [],
      workExperience: [
        { year: 'Aug 2025 - Present', role: 'Student Assistant - IT Title Information Team', company: 'California Department of Motor Vehicles' },
        { year: 'Oct 2024 - May 2025', role: 'Design Hub Intern (IT Focus)', company: 'American River College' },
        { year: 'Jan 2024 - Sep 2024', role: 'Design Hub Intern (Software Focus)', company: 'American River College' }
      ]
    },
    {
      name: 'Thomas Williams',
      role: 'Analyst & UI/UX Designer',
      contribution: 'UI/UX Design, CSS Styling, Component Structure',
      avatar: 'T',
      education: [
        { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' }
      ],
      professionalSkills: ['Design Thinking', 'Communication', 'User Experience'],
      technicalSkills: ['Figma', 'CSS', 'React', 'Graphic Design'],
      awards: [],
      workExperience: [
        { year: '2023 - Present', role: 'UI/UX Designer', company: 'Freelance' }
      ]
    },
    {
      name: 'Abdul Subhan',
      role: 'Designer',
      contribution: 'UI/UX Design, CSS Styling, Component Structure',
      avatar: 'A',
      education: [
        { year: 'Expected 2027', institution: 'CSU, Sacramento', degree: 'B.S. in Computer Science (In Progress)' }
      ],
      professionalSkills: ['Design Thinking', 'Communication', 'User Experience'],
      technicalSkills: ['Figma', 'CSS', 'React', 'Graphic Design'],
      awards: [],
    }
  ];

  return (
    <BasePage className="about-page">
      {/* Page Header */}
      <div className="about-header">
        <h1>About Our Team</h1>
        <p>Meet the developers behind Library Management System</p>
      </div>

      {/* Team Introduction */}
      <div className="about-intro">
        <h2>Hotel Group</h2>
        <p className="team-description">
          Developed by Team Hotel for CSC 131 - Software Engineering. 
          Our team is dedicated to creating efficient and user-friendly library management solutions.
        </p>
      </div>

      {/* Team Members Grid */}
      <div className="team-section">
        <h2>Team Members</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              {/* Member Header */}
              <div className="member-header">
                <div className="member-avatar">
                  {member.avatar}
                </div>
                <div className="member-basic-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>

              {/* Contribution */}
              <div className="member-contribution">
                <strong>Contribution:</strong> {member.contribution}
              </div>

              {/* Skills */}
              <div className="member-skills">
                <div className="skills-section">
                  <h4>Technical Skills</h4>
                  <div className="skills-tags">
                    {member.technicalSkills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="skills-section">
                  <h4>Professional Skills</h4>
                  <div className="skills-tags">
                    {member.professionalSkills.map((skill, i) => (
                      <span key={i} className="skill-tag professional">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="member-education">
                <h4>Education</h4>
                <ul>
                  {member.education.map((edu, i) => (
                    <li key={i}>
                      <strong>{edu.institution}</strong> ({edu.year})<br />
                      {edu.degree}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Work Experience */}
              {member.workExperience && member.workExperience.length > 0 && (
                <div className="member-experience">
                  <h4>Work Experience</h4>
                  <ul>
                    {member.workExperience.map((job, i) => (
                      <li key={i}>
                        <strong>{job.role}</strong> at {job.company}<br />
                        <span className="job-period">{job.year}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="project-info">
        <h2>About the Project</h2>
        <div className="project-details">
          <div className="project-features">
            <h3>Key Features</h3>
            <ul>
              <li>User authentication and authorization system</li>
              <li>Book search and wishlist functionality</li>
              <li>Loan and reservation management</li>
              <li>Admin dashboard for library management</li>
              <li>Responsive design for all devices</li>
              <li>RESTful API integration</li>
            </ul>
          </div>
          
          <div className="technology-stack">
            <h3>Technology Stack</h3>
            <div className="tech-tags">
              <span className="tech-tag">React</span>
              <span className="tech-tag">JavaScript</span>
              <span className="tech-tag">CSS3</span>
              <span className="tech-tag">FastAPI</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">SQLite</span>
              <span className="tech-tag">JWT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="project-timeline">
        <h2>Project Timeline</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">Week 1-2</div>
            <div className="timeline-content">
              <h4>Project Setup & Planning</h4>
              <p>Requirements gathering, technology selection, and project structure setup</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Week 3-4</div>
            <div className="timeline-content">
              <h4>Backend Development</h4>
              <p>API development, database design, and authentication system</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Week 5-6</div>
            <div className="timeline-content">
              <h4>Frontend Development</h4>
              <p>UI components, page layouts, and API integration</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Week 7-8</div>
            <div className="timeline-content">
              <h4>Testing & Deployment</h4>
              <p>System testing, bug fixes, and final deployment</p>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default AboutPage;