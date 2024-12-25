import { Box } from "@mui/material";
// import FormCreate from "./FormCreate";
import { useTheme } from "@emotion/react";
import FormCreate from "./FormCreate";

function QuestionCreate({ question, onChange }) {
  const theme = useTheme();
  return (
    <Box>
      <Box p='1rem' borderRadius='1.5rem' backgroundColor={theme.palette.background.alt}>
        <FormCreate question={question} onChange={onChange}/>
      </Box>
    </Box>
  );
}

export default QuestionCreate;
