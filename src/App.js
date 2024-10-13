import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import { AdminForm } from "./AdminForm";
import { ExternalRecognitionList } from "./ExternalRecogitionList";

const router = createBrowserRouter([
  {
    path: "/admin/recognition/create",
    element: <AdminForm />,
  },
  {
    path: "/recognition",
    element: <ExternalRecognitionList />,
  },
]);

function App() {
  return (
    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  );
}

export default App;
