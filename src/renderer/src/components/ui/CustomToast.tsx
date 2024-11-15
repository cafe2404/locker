import toast from "react-hot-toast";
import { Bell } from "lucide-react";
const CustomToast = ({ t, message }: { t: any, message: string }) => {
    return (
        <div className="bg-white cursor-pointer shadow rounded-lg p-4 min-w-72 border relative dark:bg-zinc-900 dark:border-zinc-800">
            <button title="close toast" onClick={() => toast.dismiss(t.id)} className="p-1 flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 duration-150 rounded-full cursor-pointer absolute right-2 top-2 dark:bg-zinc-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-blue-600 text-white flex justify-center items-center">
                    <Bell size={16} />
                </div>
                <div className="clamp-3 leading-tight">
                    <span className="pr-8 text-sm">{message}</span>
                </div>
            </div>
        </div >
    );
}

export default CustomToast;
