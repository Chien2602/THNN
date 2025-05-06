import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { PlayerProvider } from "./components/player-provider";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import RegisterPage from "./components/register";
import LoginPage from "./components/login";
import PlaylistPage from "./pages/PlaylistPage";
import ArtistPage from "./pages/ArtistPage";
import FavoritesPage from "./pages/FavoritePage";
import HistoryPage from "./pages/HistoryPage";
import Player from "./components/player";
import ProtectedRoute from "./ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const hiddenPlayerRoutes = ["/register", "/login"];

  const shouldHidePlayer = hiddenPlayerRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist"
          element={
            <ProtectedRoute>
              <ArtistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!shouldHidePlayer && (
        <div className="sticky bottom-0 left-0 right-0 z-10 bg-black border-t border-neutral-800">
          <Player />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <div className="h-screen bg-black overflow-hidden text-white flex flex-col">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PlayerProvider>
          <Router>
            <AppContent />
          </Router>
        </PlayerProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
