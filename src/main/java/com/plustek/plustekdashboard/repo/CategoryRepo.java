package com.plustek.plustekdashboard.repo;

import com.plustek.plustekdashboard.entity.Category;
import com.plustek.plustekdashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Integer> {
    List<Category> findByUser(User user);
}
