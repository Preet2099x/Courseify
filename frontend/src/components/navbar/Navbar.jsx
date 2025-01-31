import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div>
        <Link to="/">
          Courseify
        </Link>

        <Link to="/courses">
          Browse Courses
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;