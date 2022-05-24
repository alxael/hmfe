import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const Main = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100vh",
  minHeight: "30rem",
  minWidth: "16rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0rem",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2.25rem",
  fontFamily: "inherit",
  lineHeight: "4rem",
  fontWeight: "normal",
}));

const NoContent = () => {
  return (
    <Main>
      <Title>Nothing to see here!</Title>
    </Main>
  );
};

export default NoContent;
