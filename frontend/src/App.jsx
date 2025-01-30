import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'; // Add this
import SearchPage from './components/searchPage/SearchPage';
import CoursesPage from './components/coursesPage/CoursesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> 
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;