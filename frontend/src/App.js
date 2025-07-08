import { useRoutes } from "react-router-dom";
import RouterAdmin from "./routers/RouterAdmin";

function App() {
  const element = useRoutes([...RouterAdmin]);
  return element;
}

export default App;
