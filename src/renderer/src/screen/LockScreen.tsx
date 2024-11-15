import UserSheet from '@renderer/components/user/UserSheet';
import { useLock } from '@hooks/useLock';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaPlus, FaPowerOff, FaUserGroup } from 'react-icons/fa6';
import { MdComputer, MdOutlineLockReset, MdSunny } from 'react-icons/md';
import darkBg from '@renderer/assets/images/Monterey - Night Original.jpg';
import lightBg from '@renderer/assets/images/Monterey - Day Original.jpg';
import { useTheme } from '@renderer/hooks/useTheme';
import { IoMdMoon } from 'react-icons/io';

interface LockScreenProps { }

const LockScreen: React.FC<LockScreenProps> = () => {
    const today = moment();
    const { unlock, currentUser, setCurrentUser } = useLock();
    const [formattedDate, setFormattedDate] = useState(today.format('dddd, MMMM D'));
    const [formattedTime, setFormattedTime] = useState(today.format('h:mm'));
    const [passW, setPassW] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [length, setLength] = useState<number>(3);
    const { theme, setTheme, isDarkMode } = useTheme();

    const handleAddUser = async (user: { username: string, password: string, avatar: string }) => {
        const newUser = await window.api.registerUser(
            {
                username: user.username,
                password: user.password,
                avatar: user.avatar || '',
            }
        )
        if (newUser) {
            setUsers(prevUsers => [...prevUsers, newUser]);
        } else {
            alert("Có lỗi xảy ra vui lòng thử lại");
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setFormattedTime(moment().format('h:mm'));
            setFormattedDate(moment().format('dddd, MMMM D'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkPassword = async () => {
            if (currentUser) {
                const authenticated = await unlock({ username: currentUser.username, password: passW });
                if (authenticated) {
                    setPassW('');
                }
            }
        };
        if (passW.length) {
            checkPassword();
        }
    }, [passW]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await window.api.getAllUsers();
                setUsers(users);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setLength(users.length);
    }, [users]);
    useEffect(() => {
        setPassW('');
    }, [currentUser]);
    return (
        <div className="h-full w-full flex flex-col justify-between items-center relative">
            <div className="absolute inset-0">
                <img className='w-full h-full object-cover' src={isDarkMode ? darkBg : lightBg} alt="" />
            </div>
            <div className='relative flex flex-col items-center gap-2 h-full justify-between w-full'>
                <div className='flex flex-col w-full'>
                    <nav className='w-full flex items-center justify-end px-4 py-2'>
                        <div className="bg-zinc-50/30  backdrop-blur-md gap-2 bg-white dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 duration-150 shadow">
                            <button title="light" onClick={() => setTheme('light')} className={`${theme === 'light' ? 'text-blue-600' : 'text-zinc-400'}`}>
                                <MdSunny></MdSunny>
                            </button>
                            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600"></div>
                            <button title="dark" onClick={() => setTheme('dark')} className={`${theme === 'dark' ? 'text-zinc-50/90' : 'text-zinc-400'}`}>
                                <IoMdMoon></IoMdMoon>
                            </button>
                            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600"></div>
                            <button title="system" onClick={() => setTheme('system')} className={`${theme === 'system' ? 'text-zinc-50/90' : 'text-zinc-400'}`}>
                                <MdComputer></MdComputer>
                            </button>
                        </div>
                    </nav>
                    <div className="flex flex-col gap-2 relative mt-20 text-center">
                        <p className='font-semibold text-2xl text-zinc-50/90 [text-shadow:_0_2px_2px_rgb(48_48_48/_0.8)]'>{formattedDate}</p>
                        <p className='font-semibold text-8xl text-zinc-50/90 [text-shadow:_0_2px_2px_rgb(48_48_48/_0.8)]'>{formattedTime}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-2 mb-8 relative items-center'>
                    {
                        currentUser ?
                            <>
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-50/90 [text-shadow:_0_2px_4px_rgb(48_48_48/_0.8)]">{currentUser.username}</p>
                                <input
                                    autoFocus
                                    value={passW}
                                    onChange={(e) => setPassW(e.target.value)}
                                    type="password"
                                    className="focus:ring-2 focus:ring-zinc-50/90 duration-150 w-44 h-8 rounded-full bg-zinc-50/30 backdrop-blur-md px-4 text-zinc-50/90 font-semibold text-sm outline-none placeholder:text-zinc-50/75 text-center"
                                    placeholder="Enter password"
                                />
                                <p className="text-xs font-semibold text-zinc-50/75">Password is required</p>
                                <div className='flex items-center justify-center gap-2'>
                                    <button
                                        onClick={() => {
                                            setCurrentUser(null)
                                        }}
                                        title='reset passsword'
                                        className="focus:ring-2 flex items-center justify-center focus:ring-zinc-50/90 duration-150 w-8 h-8 rounded-full bg-zinc-50/30 backdrop-blur-md text-zinc-50/90 font-semibold text-sm outline-none"
                                    >
                                        <FaUserGroup size={14} />
                                    </button>
                                    <button
                                        title='reset passsword'
                                        className="focus:ring-2 flex items-center justify-center focus:ring-zinc-50/90 duration-150 w-8 h-8 rounded-full bg-zinc-50/30 backdrop-blur-md text-zinc-50/90 font-semibold text-sm outline-none"
                                    >
                                        <MdOutlineLockReset size={20} />
                                    </button>
                                </div>
                            </>
                            :
                            <>
                                <div className="flex gap-4 relative items-center">
                                    {
                                        users.map((user, index) => (
                                            <div onClick={() => setCurrentUser(user)} key={index} className='flex gap-2 w-full items-center p-2 rounded-xl hover:bg-zinc-50/30 hover:backdrop-blur-md duration-150 cursor-pointer'>
                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <p className="text-sm font-semibold text-zinc-50/90 [text-shadow:_0_2px_4px_rgb(48_48_48/_0.8)] ">{user.username}</p>
                                            </div>
                                        ))
                                    }

                                </div>
                                <div className='flex items-center justify-center gap-2 mt-2'>
                                    {
                                        length < 5 &&
                                        <UserSheet onAddUser={handleAddUser} trigger={
                                            <button
                                                title='add new user'
                                                className="focus:ring-2 flex items-center justify-center focus:ring-zinc-50/90 duration-150 w-8 h-8 rounded-full bg-zinc-50/30 backdrop-blur-md text-zinc-50/90 font-semibold text-sm outline-none"
                                            >
                                                <FaPlus></FaPlus>
                                            </button>
                                        } />

                                    }

                                    <button
                                        title='off'
                                        className="focus:ring-2 flex items-center justify-center focus:ring-zinc-50/90 duration-150 w-8 h-8 rounded-full bg-zinc-50/30 backdrop-blur-md text-zinc-50/90 font-semibold text-sm outline-none"
                                    >
                                        <FaPowerOff size={16} />
                                    </button>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}

export default LockScreen;
