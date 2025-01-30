import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          textDecoration: 'none', 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#212529'
        }}>
          Courseify
        </Link>
        <Link to="/courses" style={{
          textDecoration: 'none',
          color: '#fff',
          backgroundColor: '#0d6efd',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem'
        }}>
          Browse Courses
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;