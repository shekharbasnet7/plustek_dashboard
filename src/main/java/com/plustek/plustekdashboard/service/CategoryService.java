package com.plustek.plustekdashboard.service;

import com.plustek.plustekdashboard.entity.Category;
import com.plustek.plustekdashboard.entity.User;

import java.util.List;

public interface CategoryService {

    void saveCategory(Category category);

    Category findById(int id);

    List<Category> getCategoriesByUser(User user);
}
