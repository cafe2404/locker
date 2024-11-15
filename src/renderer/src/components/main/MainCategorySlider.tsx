import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getRandomEmoji } from '@renderer/utils';
import { CustomDialog } from '../ui/CustomAlert';

type MainCategorySliderProps = {
    categories: ICategory[];
    onCategoryChange?: (category_id: number) => void;
    setCategories: (categories: ICategory[]) => void;
}

const CategorySlide = ({ category, is_active, onEdit, onDelete }:
    { category: ICategory, is_active: boolean, onEdit?: (category: ICategory) => void, onDelete?: (category: ICategory) => void }) => {
    const [currentCategory, _] = useState<ICategory>(category);
    const [isEditing, setIsEditing] = useState(false);  // Trạng thái để theo dõi chế độ chỉnh sửa
    const [text, setText] = useState(currentCategory.name);  // Nội dung văn bản của <div>
    const handleDoubleClick = () => {
        if (onEdit) {
            setIsEditing(true);
        }
    };
    // Lưu nội dung mới khi nhấn Enter hoặc khi mất focus
    const handleSaveName = () => {
        if (onEdit) {
            setIsEditing(false);
            onEdit({ ...currentCategory, name: text });
        }
    };
    const handleDelete = () => {
        if (onDelete) {
            onDelete(category);
        }
    };

    return (
        <div
            
            className={`${is_active ? 'bg-blue-600 text-white border-blue-300 dark:border-blue-600 dark:hover:bg-blue-700 hover:border-blue-400' : 'text-zinc-800 bg-white border-zinc-200 hover:border-zinc-400 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500'} flex items-center gap-1 rounded-xl border px-3 py-1 cursor-pointer transition-all duration-150 font-medium group`}>
            <div className='text-lg'>
                {category.icon}
            </div>
            {
                isEditing ? (
                    <>
                        <input
                            type="text"
                            value={text}
                            className='border-none outline-none bg-transparent text-sm'
                            onChange={(e) => setText(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSaveName();
                                }
                            }}
                            maxLength={64}
                            autoFocus
                        />

                    </>
                ) : (
                    <div onDoubleClick={handleDoubleClick} className='text-sm truncate whitespace-nowrap max-w-36'>
                        {text}
                    </div>
                )
            }
            {
                currentCategory.id !== -1 && !isEditing &&
                <CustomDialog
                    trigger={
                        <button title='Xóa nhóm' className='ml-2 flex items-center justify-center'>
                            <X size={16}></X>
                        </button>
                    }
                    title="Xóa danh mục"
                    description={`Bạn chắc chắn muốn xóa ${currentCategory.name}?`}
                    onSubmit={handleDelete}
                />

            }
        </div>


    )
}

function MainCategorySlider({ categories, onCategoryChange, setCategories }: MainCategorySliderProps) {
    const allCategory = {
        id: -1, // ID for "Tất cả"
        name: 'Tất cả',
        icon: '🪟',
    }
    const [currentCategory, setCurrentCategory] = useState<ICategory>(allCategory);

    const handleCategoryClick = (category: ICategory) => {
        setCurrentCategory(category);
        if (onCategoryChange && category.id) {
            console.log('category', category.id);
            onCategoryChange(category.id);
        };
    };
    const handleEditCate = async (category: ICategory) => {
        setCategories(categories.map(c => c.id === category.id ? category : c));
        await window.api.updateCategory(category);
    };
    const createCategory = async () => {
        const newCategory: {name: string, icon: string} = {
            name: 'Nhóm mới',
            icon: getRandomEmoji(),
        }
        const data = await window.api.createCategory(newCategory);
        if (!data) return;
        setCategories([...categories, data]);
    }
    const handleDeleteCategory = async (category: ICategory) => {
        console.log('delete', category);
        setCategories(categories.filter(c => c.id !== category.id));
        await window.api.deleteCategory(category.id);
    }
    return (
        <div className="w-full py-4 px-5">
            <h2 className="text-sm text-zinc-600 dark:text-zinc-300">Phân loại</h2>
            <div className="flex items-center justify-between gap-2 w-full">
                <Swiper className="max-w-full w-full" spaceBetween={6} slidesPerView={'auto'}>
                    <SwiperSlide className="!w-fit pt-3 pb-2" onClick={() => handleCategoryClick(allCategory)}>
                        <CategorySlide is_active={currentCategory.id === allCategory.id} category={allCategory} />
                    </SwiperSlide>
                    {categories.map((category, index) => (
                        <SwiperSlide key={index} className="!w-fit pt-3 pb-2" onClick={() => handleCategoryClick(category)}>
                            <CategorySlide onEdit={handleEditCate} onDelete={handleDeleteCategory} is_active={currentCategory.id === category.id} category={category} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div onClick={createCategory} className="flex items-center justify-end gap-1.5 pt-0.5">
                    <button title="Thêm nhóm mới" className="rounded-xl dark:bg-zinc-700 dark:border-zinc-600 dark:shadow-zinc-900 dark:text-zinc-200 border border-zinc-200 p-2 flex items-center justify-center text-zinc-800 hover:border-zinc-400 duration-150 shadow" type="button">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MainCategorySlider;