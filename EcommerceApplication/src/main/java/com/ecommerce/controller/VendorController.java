package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import com.ecommerce.model.User;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/vendor")
@PreAuthorize("hasRole('VENDOR')")
public class VendorController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @GetMapping("/dashboard")
    public String dashboard(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User vendor = userService.findByUsername(userDetails.getUsername()).orElse(null);
        List<Product> products = productService.findByVendor(vendor);
        
        model.addAttribute("vendor", vendor);
        model.addAttribute("products", products);
        model.addAttribute("totalProducts", products.size());
        
        return "vendor/dashboard";
    }
    
    @GetMapping("/add-product")
    public String addProductForm(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryRepository.findAll());
        return "vendor/add-product";
    }
    
    @PostMapping("/add-product")
    public String addProduct(@Valid @ModelAttribute("product") Product product,
                           BindingResult result,
                           @AuthenticationPrincipal UserDetails userDetails,
                           Model model,
                           RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            model.addAttribute("categories", categoryRepository.findAll());
            return "vendor/add-product";
        }
        
        User vendor = userService.findByUsername(userDetails.getUsername()).orElse(null);
        product.setUser(vendor);
        
        productService.saveProduct(product);
        redirectAttributes.addFlashAttribute("success", "Product added successfully!");
        return "redirect:/vendor/dashboard";
    }
    
    @GetMapping("/edit-product/{id}")
    public String editProductForm(@PathVariable Long id, Model model, 
                                @AuthenticationPrincipal UserDetails userDetails) {
        Product product = productService.findById(id).orElse(null);
        User vendor = userService.findByUsername(userDetails.getUsername()).orElse(null);
        
        if (product == null || !product.getUser().getId().equals(vendor.getId())) {
            return "redirect:/vendor/dashboard";
        }
        
        model.addAttribute("product", product);
        model.addAttribute("categories", categoryRepository.findAll());
        return "vendor/edit-product";
    }
    
    @PostMapping("/edit-product/{id}")
    public String editProduct(@PathVariable Long id,
                            @Valid @ModelAttribute("product") Product product,
                            BindingResult result,
                            @AuthenticationPrincipal UserDetails userDetails,
                            Model model,
                            RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            model.addAttribute("categories", categoryRepository.findAll());
            return "vendor/edit-product";
        }
        
        User vendor = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Product existingProduct = productService.findById(id).orElse(null);
        
        if (existingProduct == null || !existingProduct.getUser().getId().equals(vendor.getId())) {
            redirectAttributes.addFlashAttribute("error", "Product not found!");
            return "redirect:/vendor/dashboard";
        }
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setImageUrl(product.getImageUrl());
        
        productService.updateProduct(existingProduct);
        redirectAttributes.addFlashAttribute("success", "Product updated successfully!");
        return "redirect:/vendor/dashboard";
    }
    
    @PostMapping("/delete-product/{id}")
    public String deleteProduct(@PathVariable Long id,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {
        User vendor = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Product product = productService.findById(id).orElse(null);
        
        if (product == null || !product.getUser().getId().equals(vendor.getId())) {
            redirectAttributes.addFlashAttribute("error", "Product not found!");
            return "redirect:/vendor/dashboard";
        }
        
        productService.deleteProduct(id);
        redirectAttributes.addFlashAttribute("success", "Product deleted successfully!");
        return "redirect:/vendor/dashboard";
    }
}
