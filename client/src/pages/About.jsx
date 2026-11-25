import { useEffect, useState } from 'react';
import API_URL from "../config/api";

function About() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchStaff() {
            try {
                const response = await fetch(
                    `${API_URL}/api/staff`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch staff');
                }

                const data = await response.json();
                setStaff(data);
            } catch (error) {
                console.error('Error fetching staff:', error);
                setError('Unable to load our team at this time.');
            } finally {
                setLoading(false);
            }
        }

        fetchStaff();
    }, []);

    return (
        <main className="about-page">
            <section className="about-workshop">
                <img
                    src="/images/car-workshop-tommy-anderson-unsplash.jpg"
                    alt="Orange car inside the workshop"
                    className="about-workshop-image"
                />

                <div className="about-intro">
                    <h1>About Bob's Garage</h1>
                    <p>Integrity. Quality. Honesty. </p>
                    <p>At Bob's Garage, we believe every vehicle deserves quality care and attention.
                        We're committed to providing reliable service, honest advice and workmanship you can trust.
                    </p>
                </div>
            </section>

            <section className="about-team">
                <div className="about-team-heading">
                    <h2>Meet Our Team</h2>
                    <p>The people who keep you moving.</p>
                </div>

                {loading && <p>Loading our team...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && staff.length === 0 && (
                    <p>No staff members found.</p>
                )}

                {!loading && !error && staff.length > 0 && (
                    <div className="staff-grid">
                        {staff.map((member) => (
                            <article className="staff-card" key={member.id}>
                                {member.image_url ? (
                                    <img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="staff-image"
                                    />
                                ) : (
                                    <div className="staff-image-placeholder">
                                        {member.name.charAt(0).toUppercase()}
                                    </div>
                                )}
                                   
                                <div className="staff-card-content">
                                    <h3>{member.name}</h3>
                                    <p className="staff-job-title">
                                        {member.job_title}
                                    </p>

                                    {member.bio && (
                                        <p className="staff-bio">
                                            {member.bio}
                                        </p>
                                    )}
                                </div> 
                            </article>
                        ))}
                    </div>
                )}
            </section>
      </main>
    );
}

export default About;