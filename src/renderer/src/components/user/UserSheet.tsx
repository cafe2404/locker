import { useEffect, useState } from "react"
import {  useForm } from "react-hook-form"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@components/ui/Sheet"
import Input from "@components/ui/Input"
import { Button } from "../ui/Button"
import { Camera, Trash2 } from "lucide-react"

interface UserForm {
    username: string
    password: string
    confirmPassword: string
    avatar?: string | null
}

const UserSheet = ({ trigger, onAddUser }:
    { trigger: React.ReactNode, onAddUser?: ({ avatar, username, password }: {avatar:string, username:string, password:string}) => void }) => {
    const { register, handleSubmit, formState: { errors }, watch, resetField, setValue,reset } = useForm<UserForm>()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [open, setOpen] = useState(false)
    const onSubmit = async (data: UserForm) => {
        const addUser = onAddUser?.({
            username: data.username,
            password: data.password,
            avatar: data.avatar || '',
        })
        if (addUser) {
            setOpen(false)
            reset()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result as string;
                setAvatarUrl(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvtUrl = () => {
        setAvatarUrl(null);
        resetField('avatar');
    };

    const resetModal = () => {
        reset()
        setAvatarUrl(null);
    };

    useEffect(() => {
        setValue('avatar', avatarUrl);
    }, [avatarUrl]);

    useEffect(() => {
        resetModal();
    }, [open]);
    return (
        <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent  className="w-96 dark:!bg-zinc-800 dark:!border-zinc-700">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SheetHeader>
                        <SheetTitle>Thêm người dùng</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2 items-center">
                                Tên tài khoản và ảnh đại diện
                            </p>
                            <div className="flex items-center gap-1">
                                <Input
                                    {...register("username", { required: "Không thể để trống tên tài khoản" })}
                                    placeholder="Nhập tên người dùng"
                                    type="text"
                                    error={errors.username}
                                    className="flex-1"
                                />
                                <div className="relative w-10 h-10 min-w-10 dark:bg-zinc-700 bg-white active:ring-2 active:ring-blue-300 ml-2 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-600 overflow-hidden">
                                    <label htmlFor="avatar" className="w-full h-full flex items-center justify-center cursor-pointer text-zinc-800 dark:text-zinc-200">
                                        <Camera size={20} />
                                        <input {...register('avatar')} onChange={handleFileChange} type="file" className="hidden" accept="image/*" id="avatar" />
                                    </label>
                                    {
                                        avatarUrl && (
                                            <div className="absolute inset-0 flex items-center justify-center group">
                                                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={handleRemoveAvtUrl} title="remove icon" className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 opacity-0 group-hover:opacity-100 duration-150 text-white rounded-full">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-nowrap col-span-2">
                                Mật khẩu
                            </p>
                            <Input
                                {...register("password", {
                                    required: "Mật khẩu không được để trống",
                                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 kí tự" }
                                })}
                                placeholder="Mật khẩu bao gồm 6 kí tự"
                                type="password"
                                error={errors.password}
                            />
                            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 col-span-2">
                                Xác nhận mật khẩu
                            </p>
                            <Input
                                {...register("confirmPassword", {
                                    required: "Please confirm password",
                                    validate: (val: string) => {
                                        if (watch('password') != val) {
                                            return "Mật khẩu không khớp"
                                        }
                                        return true
                                    }
                                })}
                                error={errors.confirmPassword}
                                placeholder="Xác nhận lại mật khẩu"
                                type="password"

                            />
                            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose>
                            <Button variant={'secondary'} type="button">
                                Hủy
                            </Button>
                        </SheetClose>
                        <Button type="submit" >
                            Tạo người dùng
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default UserSheet
