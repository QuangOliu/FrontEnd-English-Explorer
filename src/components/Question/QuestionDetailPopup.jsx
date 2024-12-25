import { Close } from '@mui/icons-material'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Paper,
    IconButton,
} from '@mui/material'
import QuestionDetail from 'components/QuestionDetail'
import Draggable from 'react-draggable'

const QuestionDetailPopup = ({
    open,
    question,
    onClose,
    hiddenClose = false,
}) => {
    function PaperComponent(props) {
        return (
            <Draggable
                handle={`#draggable-dialog-title_${question?.id}`}
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        )
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose()
        }
    }

    return (
        <Dialog
            PaperComponent={PaperComponent}
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            onKeyDown={handleKeyDown}
        >
            <DialogTitle
                className="popup-header"
                id={`draggable-dialog-title_${question?.id}`}
                sx={{ cursor: 'move' }}  // Add cursor style for draggable effect
            >
                <p className="popup-title">Question detail</p>
                {!hiddenClose && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        className="popup__iconBtn"
                    >
                        <Close className="popup__icon" color="#000000" />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>
                {question ? (
                    <QuestionDetail questionProp={question} />
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default QuestionDetailPopup
