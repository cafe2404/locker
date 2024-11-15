import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {  Search, X } from "lucide-react";

function MainHeader({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };
    const clearValue = () => {
        setValue('');
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(value);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [value, setSearchQuery]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }, [searchQuery]);

    return (
        <div className="w-full p-2 border-b border-b-zinc-300 flex items-center justify-between dark:border-zinc-700">
            <div className="flex items-center justify-center text-zinc-800 px-3 dark:text-zinc-200">
                {loading ?
                    <AiOutlineLoading3Quarters size={24} strokeWidth={2.5} className="animate-spin" />
                    :
                    <Search />
                }
            </div>
            <input
                value={value}
                onChange={onChange}
                type="text"
                className="w-full h-full outline-none py-3 text-lg placeholder:font-normal text-zinc-800 bg-transparent dark:text-zinc-200"
                placeholder="Tìm kiếm mật khẩu của bạn"
            />
            <div className="px-3 flex items-center justify-center gap-1.5">
                <button onClick={clearValue} title="clear" type="button"
                    className={`${value ? 'opacity-100' : 'opacity-0'} dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow`}
                >
                    <X size={16} />
                </button>
 
            </div>
        </div>
    );
}

export default MainHeader;
