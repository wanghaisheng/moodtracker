import * as React from "react";

interface Props {
  Component: React.ComponentType;
  title: string;
}

export function Page({ Component, title, ...rest }: Props) {
  React.useEffect(() => {
    document.title = `MoodTracker - ${title}`;
  }, [title]);
  return <Component {...rest} />;
}
