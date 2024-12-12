package com.plustek.plustekdashboard.service.impl;

import com.plustek.plustekdashboard.entity.Category;
import com.plustek.plustekdashboard.entity.User;
import com.plustek.plustekdashboard.repo.CategoryRepo;
import com.plustek.plustekdashboard.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public void saveCategory(Category category) {

        categoryRepo.save(category);

    }

    @Override
    public Category findById(int id) {
        return categoryRepo.findById(id).orElse(null);
    }

    @Override
    public List<Category> getCategoriesByUser(User user) {
        return categoryRepo.findByUser(user);
    }
}
