import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./components/LoginPage.jsx";
import MyPosts from "./components/MyPosts.jsx";
import CreatePost from "./components/CreatePost.jsx";
import EditPost from "./components/EditPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <MyPosts />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/edit-post/:id",
    element: <EditPost />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
