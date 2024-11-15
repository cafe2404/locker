import { MdComputer, MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import { useLock } from "@hooks/useLock";
import { RiSettingsFill } from "react-icons/ri";
import { useTheme } from "@renderer/hooks/useTheme";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@renderer/components/ui/DropdownMenu";
import { useEffect, useState } from "react";
import UserSettingSheet from "../user/UserSettingSheet";

const MainFooter = () => {
    const { lock, currentUser } = useLock();
    const { theme, setTheme } = useTheme();
    const [users, setUsers] = useState<IUser[]>([]);

    const handleThemeChange = async (theme: string) => {
        setTheme(theme);
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await window.api.getAllUsers();
                setUsers(usersData.filter(user =>
                    user.id !== currentUser?.id
                ));
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);
    return (
        <div className="border-t border-t-zinc-300 dark:border-t-zinc-700 px-5 py-3 flex items-center justify-between">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">{currentUser?.username}</p>
                    </div>
                </DropdownMenuTrigger>
                {users.length > 0 &&
                    <DropdownMenuContent className="w-48 mb-1" align="start">
                        {
                            users.map((user) => (
                                <DropdownMenuItem onClick={() => lock(user)} key={user.id}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">{user.username}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        }
                    </DropdownMenuContent>
                }
            </DropdownMenu>
            <div className="flex items-center gap-2">
                <div className="dark:bg-zinc-700 gap-2 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 duration-150 shadow">
                    <button title="light" onClick={() => handleThemeChange('light')} className={`${theme === 'light' ? 'text-blue-600' : 'text-zinc-500'}`}>
                        <MdSunny></MdSunny>
                    </button>
                    <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600"></div>
                    <button title="dark" onClick={() => handleThemeChange('dark')} className={`${theme === 'dark' ? 'text-blue-300' : 'text-zinc-400'}`}>
                        <IoMdMoon></IoMdMoon>
                    </button>
                    <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600"></div>
                    <button title="dark" onClick={() => handleThemeChange('system')} className={`${theme === 'system' ? 'text-blue-300' : 'text-zinc-400'}`}>
                        <MdComputer></MdComputer>
                    </button>
                </div>
                <UserSettingSheet
                    trigger={
                        <button title="setting" className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                            <RiSettingsFill />
                        </button>
                    }
                />
                {/* <button title="Hướng dẫn" className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                    <MdOutlineHelp />
                </button> */}
                <button onClick={() => lock()} title="Đăng xuất" className="dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow">
                    <BiSolidLock />
                </button>
            </div>
        </div>
    );
}

export default MainFooter;
