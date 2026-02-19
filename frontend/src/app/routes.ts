import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import TripPlanning from "./pages/TripPlanning";
import TripResearch from "./pages/TripResearch";
import Itinerary from "./pages/Itinerary";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import MyTrips from "./pages/MyTrips";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import ExportPreview from "./pages/ExportPreview";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/plan",
    Component: TripPlanning,
  },
  {
    path: "/research",
    Component: TripResearch,
  },
  {
    path: "/itinerary",
    Component: Itinerary,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/trips",
    Component: MyTrips,
  },
  {
    path: "/explore",
    Component: Explore,
  },
  {
    path: "/export",
    Component: ExportPreview,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);