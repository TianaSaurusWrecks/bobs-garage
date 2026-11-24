import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Services() {
    const [services, setServices] = useState([]);
    const [favouriteIds, setFavouriteIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { user } = useAuth();

    // fetch services
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

    // fetch the logged in user's favourites
    useEffect(() => {
        async function fetchFavourites() {
            if (!user) {
                setFavouriteIds([]);
                return;
            }

            try {
                const response = await fetch(
                    'http://localhost:5000/api/favourites',
                    {
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch favourites');
                }

                const data = await response.json();

                const ids = data.favourites.map(
                    (favourite) => Number(favourite.service_id)
                );

                setFavouriteIds(ids);
            } catch (error) {
                console.error('Error fetching favourites:', error);
            }
        }

        fetchFavourites();
    }, [user]);

    // add or remove a service from faves
    async function toggleFavourite(service) {
        if (!user) {
            navigate('/login');
            return;
        }

        const serviceId = Number(service.id);
        const isFavourite = favouriteIds.includes(serviceId);

        try {
            let response;

            if (isFavourite) {
                response = await fetch(
                    `http://localhost:5000/api/favourites/${serviceId}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                    }
                );
            } else {
                response = await fetch(
                    'http://localhost:5000/api/favourites',
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            service_id: serviceId,
                        }),
                    }
                );
            }

            if (!response.ok) {
                throw new Error('Failed to update favourite');
            }

            setFavouriteIds((currentIds) =>
                isFavourite
                    ? currentIds.filter((id) => id !== serviceId)
                    : [...currentIds, serviceId]
            );
        } catch (error) {
            console.error('Error updating favourite:', error);
            alert('Unable to update favourite. Please try again.');
        }
    }

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
                {services.map((service) => {
                    const isFavourite = favouriteIds.includes(
                        Number(service.id)
                    );

                    return (
                    
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
                                            state: { 
                                                service: service.name, 

                                            },
                                        })
                                    }   
                                >
                                    Enquire Now
                                </button>

                                <button
                                    type="button"
                                    className="favourite-button"
                                    onClick={() => toggleFavourite(service)}
                                    aria-label={
                                        isFavourite
                                            ? `Remove ${service.name} from favourites`
                                            : `Add ${service.name} to favourites`
                                    }
                                    aria-pressed={isFavourite}
                                    title={
                                        isFavourite
                                        ? 'Remove from favourites'
                                        : 'Add to favourites'
                                    }
                                >
                                    {isFavourite ? (
                                        <FaHeart />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                </button>
                           </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}

export default Services;






