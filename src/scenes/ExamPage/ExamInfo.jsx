import React, { useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import examApi from "api/examApi";
import toast, { Toaster } from 'react-hot-toast'

const ExamInfo = () => {
  const [examData, setExamData] = React.useState({});
  
  const { examId } = useParams()
  useEffect(() => {
    if (examId) {
        examApi
            .getById(examId)
            .then((result) => {
              setExamData({
                    title: result.title || '',
                    description: result.description || '',
                    startDate: result.startDate || '',
                    endDate: result.endDate || '',
                    accessType: result.accessType || 'PRIVATE',
                    questions:
                        result.questions.map((q) => ({
                            id: q.id || '', // Ensure id is populated if available
                            question: q.question || '',
                            explanation: q.explanation || '',
                            skill: q.skill || '',
                            level: q.level || '',
                            image: q.image || '',
                            audio: q.audio || '',
                            choises: q.choises || [],
                        })) || [],
                })
            })
            .catch((err) => {
                console.error('Failed to fetch exam data:', err)
                toast.error('Error loading exam details')
            });
    }


}, [examId])
const navigate = useNavigate() // Initialize the useNavigate hook

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4">{examData.title}</Typography>
      <Typography variant="body1">{examData.description}</Typography>
      <Typography variant="body2">Thời gian: 60 phút</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/exam/doing/'+examId)}
        style={{ marginTop: "20px" }}
      >
        Bắt đầu kiểm tra
      </Button>
      
      <Toaster />
    </Box>
  );
};

export default ExamInfo;
