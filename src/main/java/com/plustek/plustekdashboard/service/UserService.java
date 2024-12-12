package com.plustek.plustekdashboard.service;

import com.plustek.plustekdashboard.entity.User;

public interface UserService {

    public boolean registerUser(User user);

    public User loginUser(String username, String password);
}
