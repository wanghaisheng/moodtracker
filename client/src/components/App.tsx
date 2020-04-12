import { Link } from "@reach/router";
import { Header, Menu as EriMenu, Main } from "eri";
import * as React from "react";
import Menu from "./Menu";
import Router from "./Router";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <Header>
        <h1>
          <Link to="/">MoodTracker</Link>
        </h1>
        <EriMenu.Button onClick={() => setIsMenuOpen(true)} />
      </Header>
      <Menu handleMenuClose={() => setIsMenuOpen(false)} open={isMenuOpen} />
      <Main>
        <Router />
      </Main>
    </>
  );
}
