import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import roleApi from 'api/roleApi';
import userApi from 'api/userApi';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  fullname: yup.string().trim().required('Full name is required'),
  email: yup
    .string()
    .lowercase()
    .trim()
    .email('Invalid email')
    .required('Email is required'),
});

export default function RegisterForm({ userId, onSuccess }) {
  const [pageType, setPageType] = useState('add');
  const [open, setOpen] = useState(false);
  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    fullname: '',
    email: '',
    password: '',
    username: '',
    retypePassword: '',
    active: 1,
    roles: [],
  });

  const { palette } = useTheme();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isEdit = pageType === 'edit';
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setPageType('edit');
      userApi
        .getUserById(userId)
        .then((result) => {
          setInitialValues(result);
        })
        .catch((err) => console.error('Error fetching user:', err));
    } else {
      setPageType('add');
    }
  }, [userId]);

  useEffect(() => {
    // Fetch roles from server
    roleApi
      .getRoles()
      .then((roles) => setRoles(roles))
      .catch((err) => console.error('Error fetching roles:', err));
  }, []);

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      // Map roles objects to their ids for sending to the server
      const payload = {
        ...values, // Send only role IDs to the server
      };

      const endpoint = isEdit
        ? `${process.env.REACT_APP_BASE_URL}users/${userId}`
        : `${process.env.REACT_APP_BASE_URL}users`;
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? 'Error updating user' : 'Error creating user');
      }

      setOpen(true);
      onSubmitProps.resetForm();
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate('/manage/users');
      }, 1000);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handlePasswordChange = () => {
    // Implement the logic to change the password here.
    console.log('Password changed!');
    setPasswordPopupOpen(false);
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Account' : 'Add New User'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}
            >
              <TextField
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullname}
                name="fullname"
                error={Boolean(touched.fullname) && Boolean(errors.fullname)}
                helperText={touched.fullname && errors.fullname}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="User Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={Boolean(touched.username) && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 4' }}
              />

              <FormControl sx={{ gridColumn: 'span 4' }}>
                <InputLabel>Roles</InputLabel>
                <Select
                  name="roles"
                  multiple
                  value={values.roles} // Gắn giá trị từ Formik (Role objects)
                  onChange={(e) => {
                    const selectedRoles = e.target.value; // Lấy toàn bộ đối tượng roles được chọn
                    setFieldValue('roles', selectedRoles); // Cập nhật đối tượng roles vào Formik
                  }}
                  onBlur={handleBlur}
                  error={Boolean(touched.roles) && Boolean(errors.roles)}
                  renderValue={(selected) =>
                    selected
                      .map((role) => role.name) // Hiển thị tên role đã chọn
                      .join(', ')
                  }
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role}>
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  ))}
                </Select>
                {touched.roles && errors.roles && (
                  <Box color="error.main" mt={1}>
                    {errors.roles}
                  </Box>
                )}
              </FormControl>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                onClick={() => setPasswordPopupOpen(true)}
              >
                Change Password
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  '&:hover': { color: palette.primary.main },
                }}
              >
                {isEdit ? 'Save' : 'Register'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Password Change Popup */}
      <Dialog
        open={passwordPopupOpen}
        onClose={() => setPasswordPopupOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordPopupOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
