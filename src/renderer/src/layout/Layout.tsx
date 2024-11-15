import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='w-screen h-screen border-none'>
            <div className='w-full h-full font-inter bg-transparent border-none'>
                <div className="dark:bg-zinc-800 overflow-hidden bg-white w-full h-full relative">
                    <div className='absolute inset-0 blur-[250px] dark:bg-blue-900/10'>
                        <div className='absolute h-1/6 w-1/6 dark:bg-cyan-600 bg-cyan-300 top-0 left-0'></div>
                        <div className='absolute h-1/6 w-1/6 dark:bg-purple-600 bg-blue-300 bottom-0 right-0'></div>
                    </div>
                    <div className="relative z-10 h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
