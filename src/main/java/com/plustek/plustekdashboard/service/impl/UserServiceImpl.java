package com.plustek.plustekdashboard.service.impl;

import com.plustek.plustekdashboard.entity.User;
import com.plustek.plustekdashboard.repo.UserRepo;
import com.plustek.plustekdashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    private UserRepo userRepo;


    @Override
    public boolean registerUser(User user) {

        try{
            userRepo.save(user);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public User loginUser(String username, String password) {
       Optional<User> user =  userRepo.findByUsername(username);
       if(user.isPresent()){
           if(user.get().getPassword().equals(password)){
               return user.get();
           }
           else {
               return null;
           }
       }else {
           return null;
       }
    }
}
