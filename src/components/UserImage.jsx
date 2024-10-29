import { Avatar, Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size} borderRadius={"50%"}>
      {/* <img style={{ objectFit: "cover", borderRadius: "50%" }} width={size} height={size} alt='user' src={`${process.env.REACT_APP_BASE_URL}assets/${image}`} /> */}
      <Avatar alt={"User"} src={`${process.env.REACT_APP_BASE_URL}assets/${image}`} sx={{ objectFit: "cover", width: size, height: size }} />
    </Box>
  );
};

export default UserImage;
