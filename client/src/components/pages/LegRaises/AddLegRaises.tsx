import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";

export default function AddLegRaises() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <AddEvent
      eventType="leg-raises"
      ref={formRef}
      onSubmit={(): true | void => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return;
        }
        const inputEl: HTMLInputElement = formEl[FIELDS.legRaises.name];
        const { valueAsNumber } = inputEl;

        if (inputEl.validity.valueMissing) return setError(ERRORS.required);
        if (inputEl.validity.rangeOverflow)
          return setError(ERRORS.rangeOverflow);
        if (inputEl.validity.rangeUnderflow)
          return setError(ERRORS.rangeUnderflow);
        if (inputEl.validity.stepMismatch) return setError(ERRORS.integer);

        dispatch(
          eventsSlice.actions.add({
            type: "v1/leg-raises/create",
            createdAt: new Date().toISOString(),
            payload: geolocation
              ? { location: geolocation, value: valueAsNumber }
              : { value: valueAsNumber },
          }),
        );
        return true;
      }}
    >
      <TextField {...FIELDS.legRaises} error={error} />
    </AddEvent>
  );
}
