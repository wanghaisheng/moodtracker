import { Header, Nav as EriNav, QuickNav, Icon } from "eri";
import Nav from "./Nav";
import useEvents from "./hooks/useEvents";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../selectors";
import AddMoodFab from "./shared/AddMoodFab";
import { TEST_IDS } from "../constants";
import useGeolocation from "./hooks/useGeolocation";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  useUser();
  useGeolocation();
  useEvents();
  useStorage();
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Header>
        <h1>
          <Link to="/">MoodTracker</Link>
        </h1>
        <EriNav.Button
          data-test-id={TEST_IDS.navButton}
          onClick={() => setIsNavOpen(true)}
        />
      </Header>
      <Nav handleNavClose={() => setIsNavOpen(false)} open={isNavOpen} />
      <main>
        <Outlet />
      </main>
      <AddMoodFab hide={!userIsSignedIn} />
      {userIsSignedIn && (
        <QuickNav>
          <QuickNav.Link aria-label="Home" to="/">
            <Icon name="home" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Statistics" to="/stats">
            <Icon name="chart" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Meditate" to="/meditation">
            <Icon name="bell" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Add new mood" to="/add">
            <Icon name="plus" size="3" />
          </QuickNav.Link>
        </QuickNav>
      )}
    </>
  );
}