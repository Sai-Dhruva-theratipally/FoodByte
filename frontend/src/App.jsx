import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<h1>Login</h1>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;