import "./Footer.css";
import Container from "../Layout/PageContainer/PageContainer";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-container">
          <div className="footer-section">
            <h3>QUICK LINKS</h3>

            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Parts</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>SECURE PAYMENTS</h3>

            <p>Shop with confidence using our secure payment options.</p>
          </div>

          <div className="footer-section">
            <h3>HELP CENTER</h3>

            <p>Need assistance? Our support team is here to help.</p>

            <a href="#">Visit Help Center</a>
          </div>

          <div className="footer-section">
            <h3>RELIABLE SHIPPING</h3>

            <p>Fast and reliable shipping for your construction parts.</p>
          </div>
        </div>

        
      </Container>
      <div className="footer-bottom">
          <p>© 2026 Online Express. All rights reserved.</p>
        </div>
    </footer>
  );
}

export default Footer;