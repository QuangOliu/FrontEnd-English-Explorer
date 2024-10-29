import { Box, Typography, useMediaQuery } from "@mui/material";
import productApi from "api/productApi";
import Item from "components/Item";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "scenes/global/SearchBar";

function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  const [data, setData] = useState([]);

  useEffect(() => {
    productApi
      .search(query)
      .then((result) => {
        // console.log(result);
        setData(result.data);
      })
      .catch((err) => {});
  }, [query]);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      {!isNonMobileScreens && (
        <Box>
          <Typography variant='h3' textAlign='left' sx={{ mb: "15px" }}>
            <b>Search</b>
          </Typography>
          <SearchBar />
          <Box height={"20px"} />
        </Box>
      )}

      <Typography variant='h4' textAlign='left' sx={{ mb: "15px" }}>
        <b>Search result</b>
      </Typography>
      <Box margin='0 auto' display='grid' gridTemplateColumns='repeat(auto-fill, 300px)' justifyContent='space-around' rowGap='20px' columnGap='1.33%'>
        {data?.length > 0 ? data.map((item) => <Item item={item} key={`${item.name}-${item._id}`} />) : "Không tìm thấy sản phẩm nào tương tự"}
      </Box>
    </Box>
  );
}

export default SearchPage;
