import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme, Snackbar, Alert } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import authApi from "api/authApi";

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  // picture: "",
};

const initialValuesLogin = { email: "", password: "" };

const registerSchema = yup.object().shape({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup.string().lowercase().trim().email("Invalid email").required("Email is required"),
  password: yup.string().trim().required("Password is required"),
  // picture: yup.string().required("require"),
});

const loginSchema = yup.object().shape({
  email: yup.string().lowercase().trim().email("Invalid email").required("Email is required"),
  password: yup.string().trim().required("Password is required"),
});

export default function Form() {
  const [pageType, setPageType] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const [openLog, setOpenLog] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const login = async (values, onSubmitProps) => {
    values["email"] = values["email"].toLowerCase().trim();
    authApi
      .login(values)
      .then((response) => {
        // Xử lý response thành công
        dispatch(
          setLogin({
            user: response.user,
            token: response.token,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setOpenLog(true);
      });
  };
  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(`${process.env.REACT_APP_BASE_URL}auth/register`, {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenLog(false);
  };

  return (
    <div>
      <h1>Anywhere in your app!</h1>
      <Formik initialValues={isLogin ? initialValuesLogin : initialValuesRegister} validationSchema={isLogin ? loginSchema : registerSchema} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='30px'
              gridTemplateColumns='repeat(4, minmax(0, 1fr))'
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label='First Name'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name='firstName'
                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label='Last Name'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name='lastName'
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  {/* <Box gridColumn='span 4' border={`1px solid ${palette.neutral.medium}`} borderRadius='5px' p='1rem'>
                    <Dropzone acceptedFiles='.jpg,.jpeg,.png' multiple={false} onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}>
                      {({ getRootProps, getInputProps }) => (
                        <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p='1rem' sx={{ "&:hover": { cursor: "pointer" } }}>
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box> */}
                </>
              )}

              <TextField
                label='Email'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label='Password'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name='password'
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type='submit'
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {!isSubmitting && (isLogin ? "LOGIN" : "REGISTER")}
                {isSubmitting && "Submitting..."}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    opacity: 0.5,
                  },
                }}
              >
                {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar open={openLog} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: "100%", color: "white", backgroundColor: "red", "& > svg": { color: "white" } }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
