import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const initialValues = {
  searchValue: "",
};

const initialSchema = yup.object().shape({
  searchValue: yup.string().trim(),
});

export default function SearchBar() {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const history = useNavigate();

  const handleFormSubmit = async (values, onSubmitProps) => {
    history(`/search?query=${values["searchValue"]}`);
  };

  return (
    <Box width='100%' sx={{ border: "1px solid #33333", borderRadius: "9px" }}>
      <Formik initialValues={initialValues} validationSchema={initialSchema} onSubmit={handleFormSubmit}>
        {({ values, handleSubmit, dirty, handleChange, handleBlur }) => (
          <form onSubmit={handleSubmit}>
            <FlexBetween backgroundColor={neutralLight} borderRadius='9px' width={"100%"} padding='0.1rem 1.5rem'>
              <InputBase placeholder='Search...' value={values.searchValue} onChange={handleChange} name='searchValue' onBlur={handleBlur} sx={{ width: "100%" }} />
              <IconButton type='submit' disabled={dirty ? false : true}>
                <Search />
              </IconButton>
            </FlexBetween>
          </form>
        )}
      </Formik>
    </Box>
  );
}
