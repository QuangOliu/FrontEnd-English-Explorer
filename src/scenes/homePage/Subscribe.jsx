import { useTheme } from "@emotion/react";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Box, Button, IconButton, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  // const theme = useTheme();
  const { palette } = useTheme();
  // const neutralLight = theme.palette.neutral.light;
  // const dark = theme.palette.neutral.dark;
  // const background = theme.palette.background.default;
  // const primaryLight = theme.palette.primary.light;
  // const alt = theme.palette.background.alt;

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box margin='0 auto' textAlign='center'>
      <IconButton>
        <MarkEmailReadOutlinedIcon fontSize='large' />
      </IconButton>
      <Typography variant='h3'>Subscribe To Our Newsletter</Typography>
      <Typography>and receive $20 coupon for your first order when you checkout</Typography>
      <Box
        display='grid'
        gap={isNonMobile ? "15px" : "0px"}
        gridTemplateColumns='repeat(4, minmax(0, 1fr))'
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <TextField label='Email' name='email' onChange={(e) => setEmail(e.target.value)} value={email} sx={{ marginTop: "10px", gridColumn: "span 3" }} />
        <Button
          sx={{
            m: isNonMobile ? "10px 0" : "10px 0 0 0",
            p: "1rem",
            gridColumn: isNonMobile ? "span 1" : "span 4",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
          }}
        >
          Subscribe
        </Button>
      </Box>
    </Box>
  );
};

export default Subscribe;
