import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@components/ui/Sheet"
import { useLock } from "@hooks/useLock"
import { RiSettingsFill } from "react-icons/ri"
import { FaUserShield } from "react-icons/fa6"
import { MdOutlineSyncLock } from "react-icons/md"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { Switch } from "@components/ui/Switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/Select"
import { usePassword } from "@renderer/hooks/usePassword"
import toast from "react-hot-toast"
import CustomToast from "../ui/CustomToast"
import { Button } from "../ui/Button"
import Input from "../ui/Input"
import { CustomDialog } from "../ui/CustomAlert"

interface UsePassWordForm {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const UserSettingSheet = ({ trigger }:
    { trigger: React.ReactNode }) => {
    const tabs = [
        {
            id: 1,
            title: 'Cài đặt chung',
            icon: <RiSettingsFill />
        },
        {
            id: 2,
            title: 'Đồng bộ mật khẩu',
            icon: <MdOutlineSyncLock />
        },
        {
            id: 3,
            title: 'Tài khoản và bảo mật',
            icon: <FaUserShield />
        }

    ]
    const { setPasswordData, passwordData } = usePassword();
    const { currentUser, setCurrentUser, settings, setSettings, lock } = useLock();
    const { handleSubmit, watch, register, formState: { errors }, setError, reset } = useForm<UsePassWordForm>()
    const [currentTab, setCurrentTab] = useState<{ id: number, title: string, icon: React.ReactNode } | null>()
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar);
    const [changePassword, setChangePassword] = useState(false);
    const [open, setOpen] = useState(false);
    const onChangePassword = async (data: UsePassWordForm) => {
        if (currentUser) {
            try {
                const result = await window.api.updatePassword({
                    password: data.currentPassword,
                    newPassword: data.newPassword
                });
                if (result) {
                    setChangePassword(false);
                    toast.custom((t) => <CustomToast message="Cập nhật mật khẩu mới thành công" t={t} />);
                } else {
                    setError("currentPassword", {
                        type: "custom",
                        message: "Mật khẩu hiện tại không đúng"
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleDeleteUser = async () => {
        if (currentUser) {
            try {
                const result = await window.api.deleteUser(currentUser?.username);
                if (result) {
                    setCurrentUser(null);
                    lock();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Data = reader.result as string;
                setAvatarUrl(base64Data);
                if (currentUser && currentUser.id) {
                    setCurrentUser({
                        ...currentUser,
                        avatar: base64Data
                    });
                    await window.api.updateAvatar({
                        avatar: base64Data
                    });
                    toast.custom((t) => <CustomToast message="Đã cập nhật ảnh đại diện mới" t={t} />);

                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleImportCsv = async () => {
        try {
            // Yêu cầu main process mở hộp thoại chọn file
            const filePath = await window.api.openCsvFile();
            if (!filePath) return; // Người dùng đóng hộp thoại hoặc không chọn file

            // Gửi dữ liệu đã đọc đến main process để lưu vào cơ sở dữ liệu
            if (currentUser?.id) {
                const result = await window.api.importPasswordData({
                    filePath: filePath
                });
                // Cập nhật lại danh sách dữ liệu
                if (result) {
                    setPasswordData([...result, ...passwordData]);
                    toast.custom((t) => <CustomToast message={`Đã thêm ${result.length} mật khẩu`} t={t} />);
                }
            }
        } catch (error) {
            console.error("Error reading CSV file:", error);
        }
    };
    const handleExportCsv = async () => {
        // Yêu cầu main process mở hộp thoại chọn file
        const filePath = await window.api.saveCsvFile();
        if (!filePath) return; // Người dùng đóng hộp thoại hoặc không chọn file
        // Đọc và phân tích file CSV
        if (currentUser?.id) {
            await window.api.exportPasswordData({
                filePath: filePath
            });
            toast.custom((t) => <CustomToast message={`Đã xuất mật khẩu`} t={t} />);
        }
    }
    const renderTabContent = () => {
        switch (currentTab?.title) {
            case 'Cài đặt chung':
                const options = [
                    {
                        value: 30,
                        label: '30 giây',
                    },
                    {
                        value: 60,
                        label: '1 phút',
                    },
                    {
                        value: 300,
                        label: '5 phút',
                    },
                    {
                        value: 600,
                        label: '10 phút',
                    },
                    {
                        value: -1,
                        label: 'Không bao giờ',
                    },
                ]
                const value = options.find((option) => option.value === settings?.auto_lock_time)?.value.toString();
                return (
                    <div className="space-y-8 mt-3.5">
                        <div className="flex items-center justify-between gap-2 px-4">
                            <label htmlFor="startup" className="text-sm font-semibold">Bật Locker khi mở máy</label>
                            <Switch onCheckedChange={(checked) => {
                                if (settings) {
                                    setSettings({
                                        ...settings,
                                        start_up_mode: checked
                                    })
                                }
                            }}
                                checked={settings?.start_up_mode} id="startup" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-4">
                            <label htmlFor="tray-icon" className="text-sm font-semibold">Khóa khi mất tiêu điểm</label>
                            <Switch onCheckedChange={(checked) => {
                                if (settings) {
                                    setSettings({
                                        ...settings,
                                        auto_lock_on_blur: checked
                                    })
                                }
                            }}
                                checked={settings?.auto_lock_on_blur} id="tray-icon" />
                        </div>
                        <div className="flex items-center justify-between gap-4 px-4">
                            <label htmlFor="tray-icon" className="text-sm font-semibold whitespace-nowrap">Khóa ứng dụng </label>
                            <Select 
                                value={value || undefined }
                                onValueChange={(value) => {
                                    if (settings) {
                                        setSettings({
                                            ...settings,
                                            auto_lock_time: Number(value)
                                        })
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Thời gian khóa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        options.map((option) => (
                                            <SelectItem value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                )
            case 'Tài khoản và bảo mật':
                return (
                    <div className="mt-3.5">
                        {changePassword ?
                            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3">
                                <div className="flex flex-col gap-1 px-4">
                                    <label htmlFor="">
                                        <p className="text-sm">Mật khẩu hiện tại</p>
                                    </label>
                                    <Input
                                        {...register("currentPassword", {
                                            required: {
                                                value: true,
                                                message: "Mật khẩu hiện tại không được để trống",
                                            },
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu hiện tại phải có ít nhất 6 ký tự",
                                            }
                                        })}
                                        error={errors.currentPassword} // Truyền lỗi vào component Input
                                        placeholder="Nhập mật khẩu hiện tại"
                                        type="password"
                                    />
                                    {errors.currentPassword && <p className="text-red-500 text-xs dark:text-red-400">{errors.currentPassword.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1 px-4">
                                    <label htmlFor="">
                                        <p className="text-sm">Mật khẩu mới</p>
                                    </label>
                                    <Input
                                        {...register("newPassword", {
                                            required: {
                                                value: true,
                                                message: "Mật khẩu mới không được để trống",
                                            },
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
                                            }
                                        })}

                                        error={errors.newPassword}
                                        placeholder="Nhập mật khẩu mới"
                                        type="password"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-xs dark:text-red-400">{errors.newPassword.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1 px-4">
                                    <label htmlFor="">
                                        <p className="text-sm">Xác nhận mật khẩu mới</p>
                                    </label>
                                    <Input
                                        {...register("confirmPassword", {
                                            required: {
                                                value: true,
                                                message: "Vui lòng xác nhận mật khẩu mới",
                                            },
                                            minLength: 6,
                                            maxLength: 20,
                                            validate: (val: string) => {
                                                if (watch('confirmPassword') != val) {
                                                    return "Mật khẩu không khớp"
                                                }
                                                return true
                                            }
                                        })}
                                        error={errors.confirmPassword}
                                        placeholder="Xác nhận mật khẩu mới"
                                        type="password"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs dark:text-red-400">{errors.confirmPassword.message}</p>}
                                </div>
                                <div className="flex items-center justify-end gap-2 px-4 pt-3">
                                    <Button variant={'secondary'} onClick={() => setChangePassword(false)} type="button">
                                        Hủy
                                    </Button>
                                    <Button type="submit">
                                        Xác nhận
                                    </Button>
                                </div>
                            </form>
                            :
                            <>
                                <div className="flex items-center justify-between px-4 w-full flex-col mb-6">
                                    <div className="relative">
                                        <div className=" w-24 h-24 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
                                            <img src={avatarUrl} alt="" />
                                        </div>
                                        <label title="Thay ảnh đại diện" className="absolute flex items-center justify-center -bottom-1.5 -right-1.5 p-2 border-2 hover:bg-zinc-300 dark:hover:bg-zinc-600 border-white dark:border-zinc-800 rounded-full text-zinc-800 dark:text-zinc-200 bg-zinc-200 duration-150 dark:bg-zinc-700">
                                            <Camera size={16}></Camera>
                                            <input onChange={handleFileChange} type="file" className="hidden" />
                                        </label>
                                    </div>
                                    <div className="text-zinc-800 dark:text-zinc-200 font-semibold mt-2">{currentUser?.username}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => setChangePassword(true)} className="flex items-center justify-between w-full gap-2 px-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 duration-150 py-3 text-sm text-zinc-800 font-semibold dark:text-zinc-200 group">
                                        <p className="">Đổi mật khẩu</p>
                                        <ChevronRight className="opacity-0 group-hover:opacity-100" size={16} />
                                    </button>
                                    <CustomDialog
                                        trigger={
                                            <button className="flex items-center justify-between w-full gap-2 px-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 duration-150 py-3 text-sm text-red-600 font-semibold dark:text-red-400 group">
                                                <p className="">Xóa tài khoản</p>
                                                <ChevronRight className="opacity-0 group-hover:opacity-100" size={16} />
                                            </button>
                                        }
                                        title="Xóa tài khoản"   
                                        description="Bạn có chắc chắn muốn xóa tài khoản này không?"
                                        onSubmit={handleDeleteUser}
                                    />
                                </div>
                            </>
                        }
                    </div>
                )
            case 'Đồng bộ mật khẩu':
                return (
                    <div className="flex flex-col gap-1">
                        <button onClick={handleImportCsv} className="flex dark:hover:bg-zinc-700 items-center justify-between w-full gap-2 px-4 hover:bg-zinc-200 duration-150 py-3 text-sm text-zinc-800 font-semibold dark:text-zinc-200 group">
                            <p className="">Nhập mật khẩu</p>
                            <ChevronRight className="opacity-0 group-hover:opacity-100" size={16} />
                        </button>
                        <button onClick={handleExportCsv} className="flex dark:hover:bg-zinc-700 items-center justify-between w-full gap-2 px-4 hover:bg-zinc-200 duration-150 py-3 text-sm text-zinc-800 font-semibold dark:text-zinc-200 group">
                            <p className="">Xuất dữ liệu mật khẩu</p>
                            <ChevronRight className="opacity-0 group-hover:opacity-100" size={16} />
                        </button>
                        <button className="flex dark:hover:bg-zinc-700 items-center justify-between w-full gap-2 px-4 hover:bg-zinc-200 duration-150 py-3 text-sm text-zinc-800 font-semibold dark:text-zinc-200 group">
                            <p className="">Đồng bộ với google drive</p>
                            <ChevronRight className="opacity-0 group-hover:opacity-100" size={16} />
                        </button>
                    </div>
                )
            default:
                return null;
        }
    }
    useEffect(() => {
        setCurrentTab(null)
    }, [open])
    useEffect(() => {
        setChangePassword(false)
    }, [currentTab])
    useEffect(() => {
        reset()
    }, [changePassword])
    useEffect(() => {
        console.log(settings)
    }, [])
    return (
        <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent side={'right'} className="w-72 dark:!bg-zinc-800 dark:!border-zinc-700 px-0">
                <div>
                    <SheetHeader className="border-b border-b-zinc-300 dark:border-b-zinc-700 px-4 py-3">
                        {currentTab ?
                            <div className="flex items-center gap-2">
                                <button title="back" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-50" onClick={() => setCurrentTab(null)}>
                                    <ChevronLeft size={16} />
                                </button>
                                <SheetTitle className="font-semibold ">
                                    {currentTab.title}
                                </SheetTitle>
                            </div>
                            :
                            <SheetTitle className="font-semibold">Cài đặt</SheetTitle>
                        }
                    </SheetHeader>
                    <div className="flex flex-col space-y-1 mt-4">
                        {
                            !currentTab && tabs.map((tab, index) => (
                                <div onClick={() => setCurrentTab(tab)} key={index}>
                                    <div className="w-full px-4 py-3 dark:hover:bg-zinc-700 duration-150 flex gap-4 items-center justify-between group cursor-pointer hover:bg-zinc-200/70">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full flex items-center justify-center text-zinc-800 dark:text-zinc-300">
                                                {tab.icon}
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">{tab.title}</p>
                                        </div>
                                        <button title="mở" className="flex items-center justify-center opacity-0 group-hover:opacity-100 duration-150">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {renderTabContent()}
                </div>
            </SheetContent>
        </Sheet>
    )
}
export default UserSettingSheet
