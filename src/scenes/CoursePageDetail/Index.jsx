import { Grid } from '@mui/material';
import Navbar from 'scenes/global/Navbar';
import ContentLesson from './ContentLesson';
import ListChapter from './ListChapter';
import { useState } from 'react';

function CoursePageDetail() {
  const [listLesson, setListLesson] = useState([]);
  return (
    <>
      <Navbar />
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3}>
          <ListChapter setListLesson={setListLesson} />
        </Grid>
        <Grid item xs={9} sx={{ height: '100%' }}>
          <ContentLesson listLesson={listLesson} />
        </Grid>
      </Grid>
    </>
  );
}

export default CoursePageDetail;
