import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shades } from "../theme";
import "./styles.css";

const Item = ({ item, width }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const isAuth = Boolean(useSelector((state) => state.token));
  const {
    palette: { neutral },
  } = useTheme();

  const { question, image, audio, level } = item;

  return (
    <Box width={width} mb={"10px"}>
      <Box position='relative' onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
        <Box sx={{ width: "300px", height: "400px" }}>
          <audio controls>
              <source src={audio} type="audio/mpeg" />
              Your browser does not support the audio tag.
          </audio>
        </Box>
        <Box display={isHovered ? "block" : "none"} position='absolute' bottom='10%' left='0' width='100%' padding='0 5%'>
          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' alignItems='center' backgroundColor={shades.neutral[100]} borderRadius='3px'>
              <IconButton disabled={item.quantity < 0 || count > item.quantity} onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
            </Box>
            
          </Box>
        </Box>
      </Box>

      <Box mt='3px'>
        <Typography variant='subtitle2' color={neutral.dark}>
        </Typography>
        <Typography>{question}</Typography>
      </Box>
    </Box>
  );
};

export default Item;
