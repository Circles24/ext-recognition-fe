import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import { AdminForm } from "./external-recognition/Create";
import { ExternalRecognitionList } from "./external-recognition/List";
import { ExternalRecognitionView } from "./external-recognition/View";

const router = createBrowserRouter([
  {
    path: "/admin/recognition/create",
    element: <AdminForm />,
  },
  {
    path: "/recognition",
    element: <ExternalRecognitionList />,
  },
  {
    path: "/recognition/:id",
    element: <ExternalRecognitionView />,
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
