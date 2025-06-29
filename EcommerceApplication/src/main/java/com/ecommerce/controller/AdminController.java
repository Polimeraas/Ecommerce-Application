package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;
    
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<User> users = userService.findAllUsers();
        List<User> vendors = userService.findByRole(User.Role.VENDOR);
        List<User> customers = userService.findByRole(User.Role.USER);
        
        model.addAttribute("totalUsers", users.size());
        model.addAttribute("totalVendors", vendors.size());
        model.addAttribute("totalCustomers", customers.size());
        model.addAttribute("totalProducts", productService.findAllProducts().size());
        model.addAttribute("users", users);
        
        return "admin/dashboard";
    }
    
    @PostMapping("/user/{id}/toggle-status")
    public String toggleUserStatus(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        User user = userService.findById(id);
        if (user != null) {
            userService.updateUserStatus(id, !user.isEnabled());
            redirectAttributes.addFlashAttribute("success", 
                "User status updated successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", "User not found!");
        }
        return "redirect:/admin/dashboard";
    }
    
    @PostMapping("/user/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("success", "User deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting user!");
        }
        return "redirect:/admin/dashboard";
    }
}
