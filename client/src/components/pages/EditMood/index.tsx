import * as React from "react";
import { Button, Paper, RadioButton, TextArea, TextField } from "eri";
import MoodDeleteDialog from "./MoodDeleteDialog";
import { normalizedMoodsSelector } from "../../../selectors";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../../store/eventsSlice";
import { UpdateMood } from "../../../types";
import { ERRORS, FIELDS } from "../../../constants";
import useKeyboardSave from "../../hooks/useKeyboardSave";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import Location from "../../shared/Location";
import RedirectHome from "../../RedirectHome";
import { useNavigate, useParams } from "react-router-dom";

export default function EditMood() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const moods = useSelector(normalizedMoodsSelector);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState<
    string | undefined
  >();
  const [showNoUpdateError, setShowNoUpdateError] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    const descriptionEl: HTMLInputElement = formEl[FIELDS.description.name];
    const descriptionValue = descriptionEl.value;
    const explorationValue: string = formEl[FIELDS.exploration.name].value;
    const moodValue: string = formEl[FIELDS.mood.name].value;

    const descriptionFieldError = descriptionEl.validity.patternMismatch;
    setDescriptionError(descriptionFieldError ? ERRORS.specialCharacters : "");

    // There's some code further down that redirects the user
    // if `id` is not defined
    const payload: UpdateMood = { id: id! };
    let shouldUpdate = false;

    const moodValueNumber = Number(moodValue);
    if (moodValueNumber !== mood.mood) {
      payload.mood = moodValueNumber;
      shouldUpdate = true;
    }

    const trimmedDescriptionValue = descriptionValue.trim();
    if (trimmedDescriptionValue !== mood.description) {
      payload.description = trimmedDescriptionValue;
      shouldUpdate = true;
    }

    const trimmedExplorationValue = explorationValue.trim();
    if (trimmedExplorationValue !== mood.exploration) {
      payload.exploration = explorationValue.trim();
      shouldUpdate = true;
    }

    if (!shouldUpdate) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/moods/update",
        createdAt: new Date().toISOString(),
        payload,
      })
    );
    navigate("/");
  };
  useKeyboardSave(handleSubmit);

  if (!id) return <RedirectHome />;
  const mood = moods.byId[id];
  if (!mood) return <RedirectHome />;

  const createdDate = new Date(id);

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit mood</h2>
        <p>
          <small>Created: {dateTimeFormatter.format(createdDate)}</small>
          {mood.updatedAt && (
            <>
              <br />
              <small>
                Last updated:{" "}
                {dateTimeFormatter.format(new Date(mood.updatedAt))}
              </small>
            </>
          )}
        </p>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <RadioButton.Group label={FIELDS.mood.label}>
            {[...Array(11)].map((_, i) => (
              <RadioButton
                // There is old data where mood is a float between 0 and 10
                // We handle that by rounding for this input control
                defaultChecked={Math.round(mood.mood) === i}
                key={i}
                name={FIELDS.mood.name}
                value={i}
              >
                {i}
              </RadioButton>
            ))}
          </RadioButton.Group>
          <TextField
            {...FIELDS.description}
            defaultValue={mood.description}
            error={descriptionError}
          />
          <TextArea {...FIELDS.exploration} defaultValue={mood.exploration} />
          {showNoUpdateError && (
            <p className="center negative">{ERRORS.noChanges}</p>
          )}
          <Button.Group>
            <Button>Update</Button>
            <Button danger onClick={() => setIsDialogOpen(true)} type="button">
              Delete
            </Button>
            <Button
              onClick={() => window.history.back()}
              type="button"
              variant="secondary"
            >
              Back
            </Button>
          </Button.Group>
        </form>
        <MoodDeleteDialog
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {mood.location && (
        <Location
          date={createdDate}
          latitude={mood.location.latitude}
          longitude={mood.location.longitude}
        />
      )}
    </Paper.Group>
  );
}
