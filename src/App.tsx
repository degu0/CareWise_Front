import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { AppRouter } from "./routes";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
