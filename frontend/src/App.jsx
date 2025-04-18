import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./pages/authentication";
import Dashboard from "./pages/dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;