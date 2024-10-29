import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import { formatDate } from "helper";

const arrStatus = ["Order", "Approved", "Shipping", "Success"];

export default function OppositeContentTimeline({ data }) {
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: { flex: 1 },
      }}
    >
      {data &&
        data.map((i, index) => {
          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent color='textSecondary'>{formatDate(i.timestamp)}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{arrStatus[i.status - 1]}</TimelineContent>
            </TimelineItem>
          );
        })}
    </Timeline>
  );
}
