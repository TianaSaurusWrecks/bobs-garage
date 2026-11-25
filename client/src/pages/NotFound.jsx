import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <main className="not-found-page">
            <section className="not-found-content">
                <h1 className="not-found-code">404</h1>
                <h2>You're on the Road to Nowhere</h2>
                <h3>Page Not Found</h3>

                <Link to="/" className="not-found-home">
                    Back to Home
                </Link>
            </section>
        </main>
    );
}

export default NotFound;