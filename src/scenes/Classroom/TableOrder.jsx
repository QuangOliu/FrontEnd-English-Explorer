import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tab, Tabs, Toolbar, Tooltip, Typography, alpha, useMediaQuery } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FlexBetween from "components/FlexBetween";
import StyledTableCell from "components/StyledTableCell";
import StyledTableRow from "components/StyledTableRow";
import { useState } from "react";
import { Link } from "react-router-dom";

const arrStatus = ["Order", "Approved", "Shipping", "Success"];

function TableOrder({ head, data, btn, submitDelete, submitDone }) {
  const [selected, setSelected] = useState([]);
  const [selectedOne, setSelectedOne] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [actionAllIn, setActionAllIn] = useState(false);

  const [statusFilter, setStatusFilter] = useState(1);

  const breakPoint = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();

  const filteredData = data.filter((data) => {
    return data.status === statusFilter; // Hiển thị chỉ những đơn hàng có trạng thái tương ứng
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClickDeleteIcon = (selected) => {
    submitDelete(selected);
  };

  const handleClickDoneIcon = (selected) => {
    submitDone(selected);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setActionAllIn(false);
      setSelectedOne();
    }, 250);
  };

  const handleChange = (event, newValue) => {
    setStatusFilter(newValue);
    setSelected([]);
  };

  // const
  return (
    <Box>
      <Box m='0 auto'>
        <Box>
          <Tabs
            textColor='primary'
            indicatorColor='primary'
            value={statusFilter}
            onChange={handleChange}
            TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
            sx={{
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap",
              },
            }}
          >
            <Tab label='Order' value={1} />
            <Tab label='Approved' value={2} />
            <Tab label='Shipping' value={3} />
            <Tab label='Success' value={4} />
          </Tabs>
        </Box>

        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography sx={{ flex: "1 1 100%" }} color='inherit' variant='subtitle1' component='div'>
              {selected.length} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: "1 1 100%" }} variant='h6' id='tableTitle' component='div'>
              Nutrition
            </Typography>
          )}

          {selected.length > 0 ? (
            <FlexBetween>
              <Tooltip title='Xóa'>
                <IconButton
                  onClick={() => {
                    setIsDelete(true);
                    setActionAllIn(true);
                    setOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              {statusFilter <= 3 && (
                <Tooltip title='Duyệt'>
                  <IconButton
                    onClick={() => {
                      setIsDelete(false);
                      setActionAllIn(true);
                      setOpen(true);
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              )}
            </FlexBetween>
          ) : (
            <Tooltip title='Filter list'>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            {/* Head table */}
            {head && (
              <TableHead>
                <TableRow>
                  <StyledTableCell align='left'>
                    <Checkbox
                      color='primary'
                      sx={{
                        backgroundColor: "white",
                      }}
                      indeterminate={selected.length > 0 && selected.length < data.length}
                      checked={selected.length > 0 && selected.length === data.length}
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </StyledTableCell>
                  {head.map((item) => {
                    return (
                      <StyledTableCell key={item.id} align='left'>
                        {item.lable}
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell align='center' colSpan={2}>
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
            )}

            {/* Body of table */}
            {filteredData?.length > 0 ? (
              <TableBody>
                {filteredData.map((row) => {
                  const isItemSelected = isSelected(row._id);
                  return (
                    <StyledTableRow key={row._id}>
                      <StyledTableCell align='left' onClick={(event) => handleClick(event, row._id)}>
                        <Checkbox
                          color='primary'
                          sx={{
                            backgroundColor: "white",
                          }}
                          checked={isItemSelected}
                        />
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <Link to={row.linkTo}>{row._id}</Link>
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row.name.length > 50 ? `${row.name.slice(0, 50)}...v.v` : row.name}</StyledTableCell>
                      <StyledTableCell align='left'>{row.phoneNumber.length > 50 ? `${row.phoneNumber.slice(0, 50)}...v.v` : row.phoneNumber}</StyledTableCell>
                      <StyledTableCell align='left'>{row.address.length > 50 ? `${row.address.slice(0, 50)}...v.v` : row.address}</StyledTableCell>
                      <StyledTableCell align='center'>
                        {row.items.reduce((acc, item) => {
                          return acc + item.price * item.count;
                        }, 0)}
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row.createdAt.slice(0, 10)}</StyledTableCell>
                      <StyledTableCell align='left'>{arrStatus[row.status - 1]}</StyledTableCell>
                      <StyledTableCell align='left'>
                        <IconButton
                          aria-label='delete'
                          size='large'
                          onClick={(e) => {
                            setIsDelete(true);
                            setSelectedOne(row._id);
                            handleClickOpen();
                          }}
                          sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.background.error,
                            color: "white",
                            "&:hover": { color: palette.background.error },
                          }}
                        >
                          <DeleteIcon fontSize='inherit' />
                        </IconButton>
                      </StyledTableCell>
                      {row.status <= 3 && (
                        <StyledTableCell align='left'>
                          <IconButton
                            onClick={(e) => {
                              setIsDelete(false);
                              setSelectedOne(row._id);
                              handleClickOpen();
                            }}
                            size='large'
                            sx={{
                              m: "2rem 0",
                              p: "1rem",
                              backgroundColor: palette.primary.main,
                              color: "white",
                              "&:hover": { color: palette.primary.main },
                            }}
                          >
                            <DoneIcon fontSize='inherit' />
                          </IconButton>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={112}>
                    <Typography>Dữ liệu trống</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{isDelete ? "Xác nhận xóa" : "Xác nhận duyệt"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {isDelete ? "Bạn có chắc chắn muốn xóa sản phẩm với id:" : "Bạn có chắc chắn muốn duyệt sản phẩm với id: "}
            <br />
            <br />
            {selectedOne
              ? selectedOne
              : selected.map((item, index) => (
                  <span key={index}>
                    <strong>{item}</strong>
                    <br />
                  </span>
                ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label='Hủy'
            onClick={(e) => {
              handleClose();
            }}
            sx={{
              p: "1rem",
            }}
          >
            Hủy
          </Button>
          <Button
            aria-label='delete'
            size='large'
            onClick={() => {
              if (isDelete) {
                if (actionAllIn) {
                  handleClickDeleteIcon(selected);
                } else {
                  handleClickDeleteIcon([selectedOne]);
                }
              } else {
                if (actionAllIn) {
                  handleClickDoneIcon(selected);
                } else {
                  handleClickDoneIcon([selectedOne]);
                }
              }
              setSelected([]);
              setSelectedOne();
              handleClose();
            }}
            autoFocus
            sx={{
              p: "1rem",
              backgroundColor: isDelete ? palette.background.error : palette.primary.main,
              color: "white",
              "&:hover": { color: isDelete ? palette.background.error : palette.primary.main },
            }}
          >
            {isDelete ? "Xóa" : "Duyệt"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableOrder;
