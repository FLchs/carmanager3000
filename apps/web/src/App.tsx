import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "./lib/orpc";

function App() {
  const { data } = useQuery(orpc.cars.list.queryOptions());

  return (
    <div className="card">
      <p>Cars:</p>
      <li>
        {data?.map((car) => {
          return (
            <ul key={car.id}>
              {car.id} - {car.name}
            </ul>
          );
        })}
      </li>
    </div>
  );
}

export default App;
