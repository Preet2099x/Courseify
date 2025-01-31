import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'; 
import SearchPage from './components/searchPage/SearchPage';
import CoursesPage from './components/coursesPage/CoursesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> 
      <main>
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;