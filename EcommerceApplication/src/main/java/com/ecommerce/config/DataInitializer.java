package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.User;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user
        if (!userService.existsByUsername("admin")) {
            User admin = new User("admin", "admin@example.com", "admin123", "Administrator", User.Role.ADMIN);
            userService.saveUser(admin);
        }
        
        // Create default categories
        createCategoryIfNotExists("Vegetables", "Fresh vegetables and leafy greens");
        createCategoryIfNotExists("Fruits", "Fresh fruits and seasonal produce");
        createCategoryIfNotExists("Groceries", "Daily essentials and packaged goods");
    }
    
    private void createCategoryIfNotExists(String name, String description) {
        if (!categoryRepository.existsByName(name)) {
            Category category = new Category(name, description);
            categoryRepository.save(category);
        }
    }
}
