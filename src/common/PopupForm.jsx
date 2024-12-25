import { Block, Close, Save } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    useTheme,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { memo } from 'react'
import Draggable from 'react-draggable'

function PopupForm({
    title,
    open = false,
    size = 'md',
    children,
    handleClose,
    action,
    formik,
    classNameForm = '',
    hideFooter,
    scroll = 'paper',
    disableSubmit = false,
    hideSubmit = false,
    hiddenClose = false,
}) {
    function PaperComponent(props) {
        return (
            <Draggable
                handle={`#draggable-dialog-title_${size}`}
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        )
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            handleClose()
        }
    }
    const { palette } = useTheme()

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={size}
            className="popup-container"
            scroll={scroll}
            PaperComponent={PaperComponent}
            onKeyDown={handleKeyDown}
            sx={{ maxWidth: 'auto' }}
        >
            <Formik {...formik}>
                {(form) => (
                    <Form className={classNameForm}>
                        <DialogTitle
                            className="popup-header"
                            id={`draggable-dialog-title_${size}`}
                        >
                            {Boolean(title) && (
                                <p className="popup-title">{title}</p>
                            )}
                            {!hiddenClose && (
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    className="popup__iconBtn"
                                >
                                    <Close
                                        className="popup__icon"
                                        color="#000000"
                                    />
                                </IconButton>
                            )}
                        </DialogTitle>

                        <DialogContent
                            dividers={scroll === 'paper'}
                            className={`content ${
                                scroll === 'body' ? '' : 'popup-content'
                            }`}
                        >
                            {typeof children === 'function'
                                ? children(form)
                                : children}
                        </DialogContent>

                        {!hideFooter && (
                            <DialogActions className="action-popup-form">
                                {action ? (
                                    typeof action === 'function' ? (
                                        action(form)
                                    ) : (
                                        action
                                    )
                                ) : (
                                    <>
                                        {!hideSubmit && (
                                            <Button
                                                type="submit"
                                                disabled={
                                                    Boolean(
                                                        form.isSubmitting
                                                    ) || Boolean(disableSubmit)
                                                }
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor:
                                                        palette.primary.main,
                                                    color: palette.background
                                                        .alt,
                                                    '&:hover': {
                                                        color: palette.primary
                                                            .main,
                                                    },
                                                }}
                                            >
                                                <Save className="mr-2" /> Lưu
                                            </Button>
                                        )}
                                        <Button
                                            className="btn-gray"
                                            onClick={handleClose}
                                            disabled={Boolean(
                                                form.isSubmitting
                                            )}
                                            sx={{
                                                backgroundColor:
                                                    palette.primary.main,
                                                color: palette.background.alt,
                                                '&:hover': {
                                                    color: palette.primary.main,
                                                },
                                            }}
                                            variant="outlined"
                                        >
                                            <Block className="btn-content mr-2" />{' '}
                                            Hủy
                                        </Button>
                                    </>
                                )}
                            </DialogActions>
                        )}
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default memo(PopupForm)
