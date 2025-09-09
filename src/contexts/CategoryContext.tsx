import { createContext, useContext, useState, useEffect } from "react";

export type Category = {
    id: number;
    name: string;
    category_id: string;
}

const CategoryContext = createContext<Category[]>([]);

export function CategoryProvider({children}: {children: React.ReactNode}) {
    const [ categories, setCategories ] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/categories");
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err)
            }
        };

        fetchCategories();

    }, []);

    return (
        <CategoryContext.Provider value={categories}>
            {children}
        </CategoryContext.Provider>
    );
}

// 自訂hook ： 可以在其他component 中取得categories
export function useCategories() {
    return useContext(CategoryContext);
}