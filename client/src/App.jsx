import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  About,
  Register,
  Login,
  HomePage,
  Dashboard,
  Profile,
  CreateListing,
  Listing,
  EditListing,
  Search,
  Error
} from "./pages/index";

// import actions
import { Action as registerAction } from "./pages/Register.jsx";
import { Action as loginAction } from "./pages/Login.jsx";
import { Action as profileAction } from "./pages/Profile.jsx";
import { Action as createListingAction } from "./pages/CreateListing.jsx";
import { Action as EditListingAction } from "./pages/EditListing.jsx";
import { Action as DeleteListingAction } from "./pages/DeleteListing.jsx";

// import loaders
import { Loader as DashboardLoader } from "./pages/Dashboard.jsx";
import { Loader as ProfileLoader } from "./pages/Profile.jsx";
import { Loader as EditListingLoader } from "./pages/EditListing.jsx";
import { Loader as ListingLoader } from "./pages/Listing.jsx";
import { Loader as HomePageLoader } from "./pages/HomePage.jsx";
import { Loader as SearchLoader } from "./pages/Search.jsx";
import { Loader as LoginLoader } from "./pages/Login.jsx";
import { Loader as RegisterLoader } from "./pages/Register.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: DashboardLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: HomePageLoader,
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
        loader: LoginLoader,
      },
      {
        path: "/register",
        element: <Register />,
        action: registerAction,
        loader: RegisterLoader,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
        action: profileAction,
        loader: ProfileLoader,
      },
      {
        path: "/create-listing",
        element: <CreateListing />,
        action: createListingAction,
      },
      {
        path: "/edit-listing/:id",
        element: <EditListing />,
        loader: EditListingLoader,
        action: EditListingAction,
      },
      {
        path: "/delete-listing/:id",
        action: DeleteListingAction,
      },
      {
        path: "/listing/:id",
        element: <Listing />,
        loader: ListingLoader,
      },
      {
        path: "/search",
        element: <Search />,
        loader: SearchLoader,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
