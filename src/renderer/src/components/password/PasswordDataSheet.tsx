
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@components/ui/Sheet"

import { DialogClose } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/Select";
import { useEffect, useState } from "react";
import { useLock } from "@hooks/useLock";
import { Camera, Trash } from "lucide-react";
import { usePassword } from "@renderer/hooks/usePassword";
import toast from "react-hot-toast";
import CustomToast from "@components/ui/CustomToast";
import { Button } from "../ui/Button";
import Input from "../ui/Input";


const PasswordDataSheet = ({ trigger, passwordData }:
    { trigger: React.ReactNode, passwordData?: IPasswordData }) => {
    const { updatePasswordData, createPasswordData } = usePassword();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<IPasswordData>({ defaultValues: passwordData || {} })
    const [open, setOpen] = useState(false)
    const [base64Icon, setBase64Icon] = useState<string>(passwordData?.icon || '')
    const [categories, setCategories] = useState<ICategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState<ICategory>();
    const { currentUser } = useLock();
    const handleAction = async (data: IPasswordData) => {
        if (passwordData?.id) {
            toast.custom((t) => <CustomToast message="Đã cập nhật mật khẩu" t={t} />);
            return await updatePasswordData(data);
        } else {
            toast.custom((t) => <CustomToast message="Đã Thêm mật khẩu mới" t={t} />);
            return await createPasswordData(data);
        }
    }
    const onSubmitForm = async (data: IPasswordData) => {
        const submit = await handleAction(data);
        if (submit) {
            setOpen(false)
            reset();
        }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result as string;
                setBase64Icon(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveIcon = () => {
        setBase64Icon('');
    };

    useEffect(() => {
        setValue('icon', base64Icon || '');
    }, [base64Icon]);

    useEffect(() => {
        if (passwordData) {
            reset(passwordData);
            setBase64Icon(passwordData.icon || '');
        }
    }, [passwordData, reset]);

    useEffect(() => {
        if (currentUser?.id && open) {
            window.api.getCategories().then((res) => {
                setCategories(res);
                const initialCategory = res.find((category) => category.id === passwordData?.category_id);
                setSelectedCategory(initialCategory);
            });
        }
        return () => {
            setCategories([]);
            setSelectedCategory(undefined);
        };

    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                {trigger}
            </SheetTrigger>
            <SheetContent className="w-96 dark:!bg-zinc-800 dark:!border-zinc-700">
                <form onSubmit={handleSubmit(onSubmitForm)} >
                    <SheetHeader>
                        <SheetTitle>Thêm mật khẩu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2 items-center">
                                Tên và hình ảnh
                            </p>
                            <div className="flex ">
                                <Input
                                    {...register("name", { required: "Vui lòng nhập tên nền tảng" })}
                                    placeholder="Nhập tên nền tảng"
                                    type="text"
                                    error={errors.name}
                                    className="w-full"
                                />
                                <div className="relative w-10 h-10 min-w-10 dark:bg-zinc-700 bg-white active:ring-2 active:ring-blue-300 ml-2 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-600 overflow-hidden">
                                    <label htmlFor="icon" className="w-full h-full flex items-center justify-center cursor-pointer text-zinc-800 dark:text-zinc-200">
                                        <Camera size={20} />
                                        <input {...register('icon')} onChange={handleFileChange} type="file" id="icon" name="icon" className="hidden" accept="image/*.png,jpg,jepg,gif" />
                                    </label>
                                    {
                                        base64Icon && (
                                            <div className="absolute inset-0 flex items-center justify-center group">
                                                <img src={base64Icon} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={handleRemoveIcon} title="remove icon" className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 opacity-0 group-hover:opacity-100 duration-150 text-white rounded-full">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2 items-center">
                                Dường dẫn
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    {...register("url", { required: "Không thể để trống đường dẫn" })}
                                    placeholder="Nhập đường dẫn"
                                    type="text"
                                    className="flex-1"
                                />
                                <label className="bg-white border dark:border-zinc-700 border-zinc-300 text-zinc-800 rounded-lg font-semibold hover:border-zinc-500  px-4 py-2 flex items-center justify-center duration-150 text-sm dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                                    Mở app
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setValue('url', file.path);
                                        }
                                    }} />
                                </label>
                            </div>
                            {errors.url && <span className="text-red-500 text-xs">{errors.url.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2 items-center">
                                Tài khoản
                            </p>
                            <Input
                                {...register("username", { required: "Không thể để trống tài khoản" })}
                                placeholder="Nhập tên người dùng"
                                type="text"
                                error={errors.username}
                            />
                            {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2">
                                Mật khẩu
                            </p>
                            <Input
                                {...register("password", {
                                    required: "Không thể để trống mật khẩu",
                                })}
                                placeholder="Mật khẩu bao gồm 6 kí tự"
                                type="password"
                                error={errors.password}
                            />
                            {errors.username ?
                                <span className="text-red-500 text-xs">{errors.username.message}</span>
                                :
                                <span className="text-zinc-500 dark:text-zinc-400 text-xs">Mật khẩu sẽ được mã hóa khi lưu trữ</span>
                            }
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2">
                                Phân loại
                            </p>

                            <Select onValueChange={(value) => {
                                        setValue("category_id", Number(value));
                                    }}
                                    value={selectedCategory?.id.toString()}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        categories.map(category => ((
                                            <SelectItem value={category.id.toString()}>{category.name}</SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <DialogClose>
                            <Button variant={'secondary'} type="button" >
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="submit" >
                            {passwordData?.id ? "Cập nhật" : "Thêm"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default PasswordDataSheet
