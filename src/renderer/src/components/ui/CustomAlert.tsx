import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./AlertDialog";


interface CustomDialogProps {
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    onCancel?: () => void;
    onSubmit?: () => void;
}


export const CustomDialog = (props : CustomDialogProps) => {
    const [open, setOpen] = useState(false);
    const handleCancel = () => {
        props.onCancel && props.onCancel();
    }
    const handleSubmit = () => {
        props.onSubmit && props.onSubmit();
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                {props.trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {props.title && <AlertDialogTitle>{props.title}</AlertDialogTitle>}
                    {props.description && <AlertDialogDescription>{props.description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}