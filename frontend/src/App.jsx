import Loading from "./components/Loading";
import { UserData } from "./context/User";
import Admin from "./pages/Admin";
import Album from "./pages/Album";
import Home from "./pages/Home";
import Login from "./pages/login";
import PlayList from "./pages/PlayList";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const { loading, user, isAuth } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/playlist"
              element={isAuth ? <PlayList user={user} /> : <Login />}
            />
            <Route
              path="/album/:id"
              element={isAuth ? <Album user={user} /> : <Login />}
            />
            <Route path="/admin" element={isAuth ? <Admin /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
