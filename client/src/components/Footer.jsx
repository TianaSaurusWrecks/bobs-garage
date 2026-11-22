// Footer Component
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (

        <footer className="footer">
            <div className="footer-content">

                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Phone: (03) 9000 0000</p>
                    <p>Email: info@bobsgarage.com.au</p>
                </div>

                <div className="footer-section">
                    <h3>Follow Us</h3>
                   <div className="social-icons">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                   </div>
                </div>
            


                <div className="footer-section">
                    <h3>Opening Hours</h3>
                    <p>Monday - Friday: 8:00am - 5:30pm</p>
                    <p>Saturday: 8:00am - 12:00pm</p>
                    <p>Sunday: Closed</p>
                </div>

            </div>
            <div className="footer-bottom">
                  <p>
                    &copy; {new Date().getFullYear()} Bob's Garage. All rights reserved.
                  </p>
            </div>
        </footer>
    );
}

export default Footer;