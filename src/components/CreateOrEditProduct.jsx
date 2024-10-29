import { TextareaAutosize } from "@mui/base";
import { Alert, Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, TextField, useMediaQuery, useTheme } from "@mui/material";
import categoryApi from "api/category";
import productApi from "api/productApi";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Aleart from "scenes/global/Aleart";
import { setItem } from "state";
import * as yup from "yup";

const productSchema = yup.object().shape({
  category: yup.string().required("Category is required"),
  shortDescription: yup.string().trim().required("Short Description is required"),
  name: yup.string().trim().required("Name is required"),
  longDescription: yup.string().lowercase().trim().required("Long Description is required"),
  quantity: yup.number().required("Quantity is required"),
  price: yup.number().required("Price is required"),
  productImages: yup.array().min(1, "Please select at least one file"),
});

export default function CreateOrEditProduct({ productId }) {
  // Create state
  const [initialValues, setInitialValues] = useState({ category: "", name: "", shortDescription: "", longDescription: "", quantity: 1, price: 1, images: [], productImages: [] });
  const [errorMessage, setErrorMessage] = useState("");
  const [openLog, setOpenLog] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Boolean for show UI
  const isEdit = productId ? true : false;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get theme
  const theme = useTheme();
  const { palette } = useTheme();
  const neutralLight = theme.palette.neutral.light;

  // Fetch product by ID
  useEffect(() => {
    if (productId) {
      productApi
        .getProductById(productId)
        .then((result) => {
          setInitialValues((prevValues) => ({
            ...prevValues,
            name: result.name,
            category: result.category,
            shortDescription: result.shortDescription,
            longDescription: result.longDescription,
            quantity: result.quantity,
            price: result.price,
            images: result.images,
            productImages: result.images,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [productId]);

  // Fetch category
  useEffect(() => {
    categoryApi
      .getAllCategory()
      .then((result) => {
        const { data } = result;
        setCategories(data);
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  }, []);

  // Function handle
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isEdit) {
      // Handle if form is edit product
      productApi
        .updateProduct(productId, values)
        .then((result) => {
          console.log(result);
          setOpen(true);
          onSubmitProps.resetForm();
          dispatch(setItem(result.data));
          setTimeout(() => {
            navigate("/manage/products");
          }, 1000);
        })
        .catch((err) => {
          setErrorMessage("Update product is false");
          setOpenLog(true);
        });
    } else {
      // Handle if form is create
      const formData = new FormData();
      values["images"] = values["productImages"].map((item) => item.name);

      for (let value in values) {
        formData.append(value, values[value]);
      }
      productApi
        .createProduct(formData)
        .then((result) => {
          setOpen(true);
          onSubmitProps.resetForm();
          dispatch(setItem(result.data));
        })
        .catch((err) => {
          setErrorMessage("Update product is false");
          setOpenLog(true);
        });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenLog(false);
  };

  return (
    <Box>
      <h1>Chỉnh sửa sản phẩm</h1>
      <Formik initialValues={initialValues} validationSchema={productSchema} onSubmit={handleFormSubmit} enableReinitialize={true}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          dirty,
          /* and other goodies */
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box
                display='grid'
                gap='30px'
                gridTemplateColumns='repeat(4, minmax(0, 1fr))'
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  label='Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name='name'
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 2", backgroundColor: neutralLight }}
                />
                <FormControl error={touched.category && Boolean(errors.category)}>
                  <InputLabel id='demo-simple-select-helper-label'>Category</InputLabel>
                  <Select labelId='demo-simple-select-helper-label' id='demo-simple-select-helper' value={values.category} label='Category' name='category' onBlur={handleBlur} onChange={handleChange}>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category.slug}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.category && errors.category}</FormHelperText>
                </FormControl>

                <TextField
                  label='Short Description'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.shortDescription}
                  name='shortDescription'
                  error={Boolean(touched.shortDescription) && Boolean(errors.shortDescription)}
                  helperText={touched.shortDescription && errors.shortDescription}
                  sx={{ gridColumn: "span 4", backgroundColor: neutralLight }}
                />
                <FormControl error={Boolean(touched.longDescription) && Boolean(errors.longDescription)} sx={{ gridColumn: "span 4" }}>
                  <TextareaAutosize
                    minRows={10}
                    placeholder='Long Description'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.longDescription}
                    name='longDescription'
                    style={{ backgroundColor: neutralLight, padding: "10px 14px", resize: "none", fontFamily: "Roboto, Slab,serif", fontSize: "15px" }}
                  />
                  <FormHelperText>{touched.longDescription && errors.longDescription}</FormHelperText>
                </FormControl>
                <TextField
                  label='Price'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.price}
                  type='number'
                  name='price'
                  error={Boolean(touched.price) && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  sx={{ gridColumn: "span 2", backgroundColor: neutralLight }}
                />
                <TextField
                  label='Quantity'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.quantity}
                  type='number'
                  name='quantity'
                  error={Boolean(touched.quantity) && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                  sx={{ gridColumn: "span 2", backgroundColor: neutralLight }}
                />
                {!isEdit && (
                  <FormControl
                    sx={{ gridColumn: "span 4", border: `1px solid ${palette.neutral.medium}`, borderRadius: "5px", p: "1rem", outline: "" }}
                    error={touched.productImages && Boolean(errors.productImages)}
                  >
                    <Dropzone acceptedFiles='.jpg,.jpeg,.png' onDrop={(acceptedFiles) => setFieldValue("productImages", acceptedFiles)}>
                      {({ getRootProps, getInputProps }) => (
                        <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p='1rem' sx={{ "&:hover": { cursor: "pointer" } }}>
                          <input {...getInputProps()} />
                          <p>Add Picture Here</p>
                        </Box>
                      )}
                    </Dropzone>
                    {errors.files && touched.files ? <div style={{ color: "red" }}>{errors.files}</div> : null}
                    {values.productImages.map((file) => (
                      <div key={file.name}>
                        {file.name} - {file.size} bytes
                      </div>
                    ))}
                    <FormHelperText>{touched.productImages && errors.productImages}</FormHelperText>
                  </FormControl>
                )}
              </Box>

              {/* BUTTONS */}
              <Button
                fullWidth
                type='submit'
                disabled={!dirty}
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </Button>
            </form>
          );
        }}
      </Formik>

      <Snackbar open={openLog} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: "100%", color: "white", backgroundColor: "red", "& > svg": { color: "white" } }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      {isEdit ? (
        <Aleart open={open} setOpen={setOpen} title={"Success"} messsage={"Chỉnh sửa sản phẩm thành công"} />
      ) : (
        <Aleart open={open} setOpen={setOpen} title={"Success"} messsage={"Thêm sản phẩm thành công"} />
      )}
    </Box>
  );
}
