package com.plustek.plustekdashboard.controller;


import com.plustek.plustekdashboard.entity.User;
import com.plustek.plustekdashboard.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MyController {


    @Autowired
    private UserService userService;


    @GetMapping("/register")
    public String openRegPage(Model model){

        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/regForm")
    public String signUp(@ModelAttribute("user") User user, Model model){

        boolean status = userService.registerUser(user);
        if(status){
            return "redirect:/login";

        }
        else {
            model.addAttribute("errorMsg", "User registration failed");
        }
        return "register";
    }

    @GetMapping("/login")
    public String loginPage(Model model){
        model.addAttribute("user", new User());
        return "login";


    }

    @GetMapping("/")
    public String welcomeDefault(){
        return "redirect:/login";
    }

    @PostMapping("/login")
    public String submitLogin(@ModelAttribute("user") User user, Model model, HttpSession session){

        User validUser = userService.loginUser(user.getUsername(), user.getPassword());
        if(validUser!=null){
            session.setAttribute("loggedInUser", validUser);
            return "redirect:/homepage";
        }else {
            model.addAttribute("errorMsg", "Email or Password did not match");
            return "login";
        }
    }

    @GetMapping("/homepage")
    public String homepage(Model model, HttpSession session){
        User loggedUser = (User)session.getAttribute("loggedInUser");
        if(loggedUser!=null){
            model.addAttribute("name", loggedUser.getName());
        }
        return "homepage";
    }


    @PostMapping("/logout")
    public String logout(HttpSession httpSession){
        httpSession.invalidate();
        return "redirect:/";
    }
}
