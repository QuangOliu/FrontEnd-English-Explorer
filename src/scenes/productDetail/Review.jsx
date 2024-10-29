import { Box, Button, TextField, useTheme } from "@mui/material";
import productApi from "api/productApi";
import ModalGlobal from "components/ModalGlobal";
import { Formik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import Aleart from "scenes/global/Aleart";
import * as yup from "yup";

const initialValues = {
  comment: "",
  // picture: "",
};
const initiaSchema = yup.object().shape({
  comment: yup.string().trim(),
});

export default function Review({ productId, setComments }) {
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const isAuth = Boolean(useSelector((state) => state.token));

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isAuth) {
      productApi
        .addComment(productId, values["comment"])
        .then((result) => {
          setComments(result.data.comments);
          onSubmitProps.resetForm();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setOpen(true);
  };

  return (
    <Box width={"100%"}>
      <Formik initialValues={initialValues} validationSchema={initiaSchema} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          dirty,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label='Comment'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.comment}
              name='comment'
              error={Boolean(touched.comment) && Boolean(errors.comment)}
              helperText={touched.comment && errors.comment}
              fullWidth
            />

            {/* BUTTONS */}
            <Button
              fullWidth
              type='submit'
              disabled={!dirty}
              sx={{
                m: "1rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Comment
            </Button>
          </form>
        )}
      </Formik>
      {isAuth ? (
        <Aleart title={"Appointment"} messsage={"Add Comment Succesfully"} open={open} setOpen={setOpen} />
      ) : (
        <ModalGlobal open={open} setOpen={setOpen} title={"Vui lòng đăng nhập"} message={"Bạn cần đăng nhập để thực hiện chức năng này"} btn={{ lable: "Đăng nhập", url: "/login" }} />
      )}
    </Box>
  );
}
