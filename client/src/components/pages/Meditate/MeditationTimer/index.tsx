import { Redirect, RouteComponentProps, useNavigate } from "@reach/router";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MEDITATION_SEARCH_PARAM_TIME_KEY } from "../../../../constants";
import { deviceGeolocationSelector } from "../../../../selectors";
import eventsSlice from "../../../../store/eventsSlice";
import { Meditation } from "../../../../types";
import useKeyboardEscape from "../../../hooks/useKeyboardEscape";
import { noSleep } from "../nosleep";
import bell from "./bell";
import MeditationTimerPresentation from "./MeditationTimerPresentation";
import { initialState, reducer } from "./reducer";

export default function MeditationTimer({ location }: RouteComponentProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localState, localDispatch] = React.useReducer(reducer, initialState);

  const geolocation = useSelector(deviceGeolocationSelector);
  const searchParams = new URLSearchParams(location?.search);
  const timerDurationInSeconds = Number(
    searchParams.get(MEDITATION_SEARCH_PARAM_TIME_KEY)
  );
  const initialTime = React.useRef(Date.now());
  const roundedSecondsRemaining = Math.round(
    (localState.remainingTime ?? timerDurationInSeconds * 1e3) / 1e3
  );

  const onDim = React.useCallback(
    () => localDispatch({ payload: true, type: "isDimmerEnabled/set" }),
    []
  );
  const onFinish = React.useCallback(() => {
    navigate("/meditate");
  }, [navigate]);
  const onFinishAndLog = React.useCallback(() => {
    const payload: Meditation = { seconds: Math.round(timerDurationInSeconds) };
    if (geolocation) payload.location = geolocation;

    let createdAt: string;
    if (localState.timeFinished)
      createdAt = localState.timeFinished.toISOString();
    else {
      // eslint-disable-next-line no-console
      console.warn(
        "Problem logging meditation: Expected finish time to be defined, falling back to log time instead"
      );
      createdAt = new Date().toISOString();
    }
    dispatch(
      eventsSlice.actions.add({
        type: "v1/meditations/create",
        createdAt,
        payload,
      })
    );
    onFinish();
  }, [
    dispatch,
    geolocation,
    onFinish,
    localState.timeFinished,
    timerDurationInSeconds,
  ]);
  const onPause = React.useCallback(() => {
    noSleep.disable();
    localDispatch({ payload: "PAUSED", type: "timerState/set" });
  }, []);
  const onPlay = React.useCallback(() => {
    noSleep.enable();
    initialTime.current =
      Date.now() + roundedSecondsRemaining * 1e3 - timerDurationInSeconds * 1e3;
    localDispatch({ payload: "TIMING", type: "timerState/set" });
  }, [roundedSecondsRemaining, timerDurationInSeconds]);
  const onReveal = React.useCallback(
    () => localDispatch({ payload: false, type: "isDimmerEnabled/set" }),
    []
  );

  useKeyboardEscape(() =>
    localDispatch({ payload: false, type: "isDimmerEnabled/set" })
  );

  React.useEffect(() => {
    noSleep.enable();
    return () => {
      bell.stop();
      noSleep.disable();
    };
  }, []);

  React.useEffect(() => {
    let abort = false;
    requestAnimationFrame(function update() {
      if (
        localState.timerState === "FINISHED" ||
        localState.timerState === "PAUSED" ||
        abort
      )
        return;
      requestAnimationFrame(update);
      const t =
        timerDurationInSeconds * 1e3 - (Date.now() - initialTime.current);
      if (t > 0)
        return localDispatch({ payload: t, type: "remainingTime/set" });

      localDispatch({ payload: new Date(), type: "timeFinished/set" });
      bell.start();
      noSleep.disable();
    });
    return () => void (abort = true);
  }, [
    localState.isDimmerEnabled,
    timerDurationInSeconds,
    localState.timerState,
  ]);

  if (!searchParams.has(MEDITATION_SEARCH_PARAM_TIME_KEY))
    return <Redirect to="/meditate" />;

  return (
    <MeditationTimerPresentation
      dimmed={localState.isDimmerEnabled}
      onDim={onDim}
      onFinish={onFinish}
      onPause={onPause}
      onPlay={onPlay}
      onFinishAndLog={onFinishAndLog}
      onReveal={onReveal}
      roundedSecondsRemaining={roundedSecondsRemaining}
      timerState={localState.timerState}
      totalSeconds={timerDurationInSeconds}
    />
  );
}
