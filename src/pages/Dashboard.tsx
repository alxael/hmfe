import { styled } from "@mui/system";
import { Grid, Typography } from "@mui/material";

import { Section, SectionProps } from "../components/Dashboard/Section";

import { ActiveReservations } from "../components/Dashboard/ActiveReservations";
import AvailableEmployees from "../components/Dashboard/AvailableEmployees";
import { RoomAnalytics } from "../components/Dashboard/RoomAnalytics";

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2.25rem",
  fontFamily: "inherit",
  lineHeight: "4rem",
  fontWeight: "normal",
}));

const Main = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: "3rem 3rem 6rem 3rem",
  marginLeft: "14rem",
  minHeight: "100vh",
  overflow: "auto",
}));

const Dashboard = () => {
  const sections: SectionProps[] = [
    {
      size: 6,
      title: "Active reservations",
      content: ActiveReservations,
    },
    {
      size: 6,
      title: "Available employees",
      content: AvailableEmployees,
    },
    {
      size: 12,
      title: "Room analytics",
      content: RoomAnalytics,
    },
  ];

  return (
    <Main>
      <Title>Dashboard</Title>
      <Grid container spacing={2}>
        {sections.map((section) => (
          <Section key={section.title} {...section} />
        ))}
      </Grid>
    </Main>
  );
};

export default Dashboard;
