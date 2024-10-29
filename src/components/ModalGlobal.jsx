import { useTheme } from "@emotion/react";
import { FlareSharp } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { shades } from "theme";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function ModalGlobal({ open, setOpen, title, message, btn }) {
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const { palette } = useTheme();

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id='transition-modal-title' variant='h6' component='h2'>
              {title}
            </Typography>
            <Typography id='transition-modal-description' sx={{ mt: 2 }}>
              {message}
            </Typography>
            {btn && (
              <Button
                fullWidth
                sx={{
                  m: "1rem 0 0 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
                onClick={() => {
                  navigate(btn.url);
                }}
              >
                {btn.lable}
              </Button>
            )}

            <Button
              fullWidth
              onClick={() => {
                setOpen(false);
              }}
              sx={{ m: "1rem 0", p: "1rem", backgroundColor: shades.primary[300], color: "white", "&:hover": { color: "black" } }}
            >
              Hủy
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalGlobal;
