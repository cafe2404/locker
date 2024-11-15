import { useEffect, useState } from "react";
import PasswordDataSheet from "./PasswordDataSheet";
import { CheckCheck, Copy, Eye, EyeClosed, Pencil, Trash } from "lucide-react";
import { usePassword } from "@renderer/hooks/usePassword";
import { CustomDialog } from "../ui/CustomAlert";


const PassWordItem = ({ item }: { item: IPasswordData }) => {
    const { deletePasswordData } = usePassword();
    const [showPassword, setShowPassword] = useState(false);
    const [currentItem, setCurrentItem] = useState<IPasswordData>(item);
    const [copied, setCopied] = useState(false);
    const toggleShowPassword = async () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showPassword) {
            timeout = setTimeout(() => {
                setShowPassword(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [showPassword]);

    const copyToClipboard = (text: string) => {
        window.api.clipboard.writeText(text);
    };
    const handleDeletePassword = async () => {
        if (currentItem.id) {
            deletePasswordData(currentItem.id);
        }
    };
    const copyPassword = async () => {
        if (currentItem) {
            copyToClipboard(currentItem.password);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    };

    const copyUsername = () => {
        if (currentItem.username) {
            copyToClipboard(currentItem.username);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    };
    const openLink = () => {
        if (currentItem) {
            try {
                new URL(currentItem.url);
                window.api.openURL(currentItem.url);
            } catch (_) {
                window.api.openExternalApp(currentItem.url);
            }
        }
    };

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);
    return (
        <div className="flex p-2 items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-150 group">
            <div className="flex-1 flex items-center gap-2">
                <div className="h-8 w-8 overflow-auto p-1 bg-zinc-300 dark:bg-zinc-700 rounded-full">
                    <img className="w-full h-full object-contain rounded-full" src={currentItem.icon} alt="" />
                </div>
                <div className="">
                    <button onClick={openLink} className="text-zinc-600 dark:text-zinc-300 text-xs block hover:text-blue-600 duration-150">{currentItem.name}</button>
                    <div className="flex gap-2 items-center">
                        <p onClick={copyUsername} className="text-zinc-800 dark:text-zinc-200  font-semibold text-sm">{currentItem.username}</p>
                        <p className="text-zinc-800 dark:text-zinc-200  font-semibold text-sm">
                            {showPassword && <span onClick={copyPassword}>{currentItem.password}</span>}
                        </p>
                    </div>

                </div>
            </div>
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 duration-150">
                <button onClick={toggleShowPassword} title="Copy mật khẩu" className="dark:bg-zinc-700 bg-white dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                    {
                        showPassword ? <EyeClosed size={16} /> : <Eye size={16} />
                    }
                </button>

                <button onClick={copyPassword} title="Copy mật khẩu" className="dark:bg-zinc-700 bg-white dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                    {
                        copied ? <CheckCheck size={16} /> : <Copy size={16} />
                    }
                </button>
                <PasswordDataSheet
                    passwordData={currentItem}
                    trigger={
                        <button title="Chỉnh sửa" className="dark:bg-zinc-700 bg-white dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                            <Pencil size={16} />
                        </button>
                    }

                />
                <CustomDialog
                    trigger={
                        <button title="Xóa mật khẩu" className="dark:bg-zinc-700 bg-white dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                            <Trash size={16} />
                        </button>
                    }
                    title="Xóa mật khẩu"
                    description={`Bạn chắc chắn muốn xóa ${currentItem.username}?`}
                    onSubmit={handleDeletePassword}
                />
            </div>
        </div>
    );
}
export default PassWordItem;
