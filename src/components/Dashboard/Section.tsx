import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const GridBoxTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "1.25rem",
  fontFamily: "inherit",
  lineHeight: "3rem",
  fontWeight: "normal",
}));

const GridBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  padding: "1rem 2rem 2rem 2rem",
}));

export interface SectionProps {
  size: number;
  title: string;
  content: () => JSX.Element;
}

export const Section = (props: SectionProps) => {
  return (
    <Grid item xs={props.size}>
      <GridBox>
        <GridBoxTitle>{props.title}</GridBoxTitle>
        <props.content></props.content>
      </GridBox>
    </Grid>
  );
};
