import { Paper, SubHeading } from "eri";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
} from "../../../../utils";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodByMonthForPeriod from "./MoodByMonthForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "../MoodCalendarForMonth";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloud from "../MoodCloud";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import { RootState } from "../../../../store";
import SummaryForYear from "../SummaryForYear";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { monthLongFormatter } from "../../../../formatters/dateTimeFormatters";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  xLabels: string[];
}

export default function MoodViewForYear({
  prevDate,
  date,
  nextDate,
  xLabels,
}: Props) {
  const moodIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsInPeriod(state, date, nextDate),
  );
  const navigate = useNavigate();
  const meanMoodsByMonth = useSelector(eventsSlice.selectors.meanMoodsByMonth);

  const months = eachMonthOfInterval({ start: date, end: nextDate }).slice(
    0,
    -1,
  );

  const calendars = [];
  for (const month of months) {
    const monthString = monthLongFormatter.format(month);
    const averageMood = meanMoodsByMonth[formatIsoDateInLocalTimezone(month)];
    const formattedAverageMood =
      averageMood === undefined
        ? undefined
        : oneDecimalPlaceFormatter.format(averageMood);
    calendars.push(
      <button
        aria-label={`Drill down into ${monthString}`}
        className="m-year__calendar-button br-0 p-1"
        key={String(month)}
        onClick={() =>
          navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`)
        }
        title={
          formattedAverageMood &&
          `Average mood for ${monthString}: ${formattedAverageMood}`
        }
      >
        <h4 className="center">
          {monthString}
          <small>{formattedAverageMood && ` (${formattedAverageMood})`}</small>
        </h4>
        <MoodCalendarForMonth month={month} small />
      </button>,
    );
  }

  return (
    <>
      <SummaryForYear dates={[prevDate, date, nextDate]} />
      <MoodChartForPeriod
        centerXAxisLabels
        dateFrom={date}
        dateTo={nextDate}
        hidePoints
        xLabels={xLabels}
      />
      {moodIdsInPeriod.length ? (
        <>
          <Paper>
            <h3>
              Calendar view
              <SubHeading>Tap a month to explore it in more detail</SubHeading>
            </h3>
            <div className="m-year__calendar-grid">{calendars}</div>
          </Paper>
          <MoodByMonthForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      ) : (
        <Paper>
          <p>No mood data for this year.</p>
        </Paper>
      )}
      {Boolean(moodIdsInPeriod.length) && (
        <>
          <MoodByWeekdayForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodCloud
            currentPeriod={{ dateFrom: date, dateTo: nextDate }}
            previousPeriod={{ dateFrom: prevDate, dateTo: date }}
          />
        </>
      )}
      <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
    </>
  );
}
