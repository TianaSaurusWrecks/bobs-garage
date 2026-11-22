import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch('http://localhost:5000/api/services');

                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Unable to load services. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    if (loading) {
        return (
            <main className="services-page">
                <p>Loading services...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="services-page">
                <p>{error}</p>
            </main>
        );
    }
    
    return (
        <main className="services-page">
            <section className="services-heading">
                <h1>Our Services</h1>
                <p>Quality Workmanship. Honest Prices.</p>
            </section>

            <section className="services-grid">
                {services.map((service) => (
                    <article className="service-card" key={service.id}>
                        <img
                            src={service.image_url}
                            alt={service.name}
                            className="service-image"
                        />

                        <div className="service-card-content">
                            <h2>{service.name}</h2>

                            <p className="service-description">
                                {service.description}
                            </p>

                            <p className="service-price">
                                Price: ${service.price}
                            </p>

                            <button 
                                className="enquire-button"
                                onClick={() =>
                                    navigate('/contact', {
                                        state: { service: service.name },
                                    })
                                }   
                            >
                                Enquire Now
                            </button>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Services;






