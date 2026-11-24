import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
    const location = useLocation();
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        // if a service was passed from services page use its name otherwise leave blank
        service: location.state?.service || '',
        message: '',
    });

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/services'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        }
        fetchServices();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log('Enquiry submitted:', formData);
    }

    return (
        <main className="contact-page">
            <section className="contact-heading">
                <h1>Contact Us</h1>
                <p>Have a question? We'd love to hear from you.</p>
            </section>

            <form className="contact-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Your Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />


                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="service">Service</label>
                <select
                    
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                > 
                <option value="">Please select a service</option>
                {services.map((service) => (
                    <option key={service.id} value={service.name}>
                        {service.name}
                    </option>
                ))}
                </select>
                

                <label htmlFor="message">Your Enquiry</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                />

                <button type="submit" className="enquire-button">
                    Send Enquiry
                </button>
            </form>
        </main>
    );
}

export default Contact;