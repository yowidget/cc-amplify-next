export interface Category {
  id: string;
  nombre: string;
  preferencias: string[];
}

export interface Categories {
  [key: string]: Category;
}

export interface SelectedPreferences {
  [categoryId: string]: string[];
}

export interface CategoryListProps {
  categories: Categories;
  onPreferencesChange?: (preferences: SelectedPreferences[]) => void;
}

export interface GroupedPreferences {
    [categoryName: string]: {
        icon: string;
        preferences: string[];
    };
}