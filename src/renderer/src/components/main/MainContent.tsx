import PassWordItem from "@components/password/PassWordItem";
import { useEffect, useState } from "react";
import { useLock } from "@hooks/useLock";
import PassWorDataSheet from "../password/PasswordDataSheet";
import MainCategorySlider from "./MainCategorySlider";
import { Plus } from "lucide-react";
import { usePassword } from "@renderer/hooks/usePassword";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

interface MainContentProps {
    searchQuery: string;
}

const MainContent = ({ searchQuery }: MainContentProps) => {
    const { passwordData } = usePassword();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const { currentUser } = useLock();
    const [selectedCategory, setSelectedCategory] = useState<number>();

    useEffect(() => {
        const fetchCategories = async () => {
            if (currentUser?.id) {
                const categories = await window.api.getCategories();
                setCategories(categories);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (category_id: number) => {
        setSelectedCategory(category_id);
    };

    const filteredPasswordData = !selectedCategory || selectedCategory === -1
        ? passwordData
        : passwordData.filter(item => item.category_id === selectedCategory);

    const searchedPasswordData = filteredPasswordData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        || item.url.toLowerCase().includes(searchQuery.trim().toLowerCase())
        || item.username.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const renderItem = ({ index, key, style }) => {
        const item = searchedPasswordData[index];
        return (
            <div key={key} style={style}>
                <PassWordItem item={item} />
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <MainCategorySlider 
                categories={categories} 
                setCategories={setCategories} 
                onCategoryChange={handleCategoryChange} 
            />
            <div className="w-full pb-4 px-5 h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-zinc-600 dark:text-zinc-300">Danh sách mật khẩu</h2>
                    <div className="flex items-center gap-2 justify-end">
                        <PassWorDataSheet
                            trigger={
                                <button 
                                    title="thêm mật khẩu mới" 
                                    className="whitespace-nowrap gap-2 px-4 text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-xl py-1.5 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" 
                                    type="button"
                                >
                                    <Plus size={16} />
                                    Tạo mật khẩu
                                </button>
                            }
                        />
                    </div>
                </div>
                <div className="mt-3 flex-1 overflow-hidden">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={searchedPasswordData.length}
                                rowHeight={60} // Điều chỉnh chiều cao của mỗi hàng
                                rowRenderer={renderItem}
                                overscanRowCount={5} // Tăng hiệu suất khi cuộn
                            />
                        )}
                    </AutoSizer>
                </div>
            </div>
        </div>
    );
}

export default MainContent;
