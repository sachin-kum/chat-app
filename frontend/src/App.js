import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Chat from "./Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
