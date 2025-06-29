package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import com.ecommerce.model.User;
import com.ecommerce.model.Cart;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import com.ecommerce.service.CartService;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @GetMapping("/dashboard")
    public String dashboard(Model model, @RequestParam(required = false) String category) {
        List<Product> products;
        
        if (category != null && !category.isEmpty()) {
            Category cat = categoryRepository.findByName(category).orElse(null);
            products = cat != null ? productService.findByCategory(cat) : productService.findActiveProducts();
        } else {
            products = productService.findActiveProducts();
        }
        
        model.addAttribute("products", products);
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("selectedCategory", category);
        
        return "user/dashboard";
    }
    
    @PostMapping("/add-to-cart/{productId}")
    public String addToCart(@PathVariable Long productId,
                          @RequestParam(defaultValue = "1") Integer quantity,
                          @AuthenticationPrincipal UserDetails userDetails,
                          RedirectAttributes redirectAttributes) {
        
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Product product = productService.findById(productId).orElse(null);
        
        if (product == null) {
            redirectAttributes.addFlashAttribute("error", "Product not found!");
            return "redirect:/user/dashboard";
        }
        
        if (product.getQuantity() < quantity) {
            redirectAttributes.addFlashAttribute("error", "Insufficient stock!");
            return "redirect:/user/dashboard";
        }
        
        cartService.addToCart(user, product, quantity);
        redirectAttributes.addFlashAttribute("success", "Product added to cart!");
        return "redirect:/user/dashboard";
    }
    
    @GetMapping("/cart")
    public String viewCart(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Cart cart = cartService.getOrCreateCart(user);
        
        model.addAttribute("cart", cart);
        return "user/cart";
    }
    
    @PostMapping("/cart/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId,
                               @AuthenticationPrincipal UserDetails userDetails,
                               RedirectAttributes redirectAttributes) {
        
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        cartService.removeFromCart(user, productId);
        redirectAttributes.addFlashAttribute("success", "Product removed from cart!");
        return "redirect:/user/cart";
    }
    
    @GetMapping("/checkout")
    public String checkout(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Cart cart = cartService.getOrCreateCart(user);
        
        if (cart.getCartItems().isEmpty()) {
            return "redirect:/user/cart";
        }
        
        model.addAttribute("cart", cart);
        model.addAttribute("user", user);
        return "user/checkout";
    }
    
    @PostMapping("/checkout/process")
    public String processCheckout(@RequestParam String paymentMethod,
                                @RequestParam String address,
                                @AuthenticationPrincipal UserDetails userDetails,
                                RedirectAttributes redirectAttributes) {
        
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        Cart cart = cartService.getOrCreateCart(user);
        
        if (cart.getCartItems().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Cart is empty!");
            return "redirect:/user/cart";
        }
        
        // Process payment (simplified)
        // In real application, integrate with payment gateway
        
        // Clear cart after successful order
        cartService.clearCart(user);
        
        redirectAttributes.addFlashAttribute("success", 
            "Order placed successfully! Payment method: " + paymentMethod);
        return "redirect:/user/dashboard";
    }
}
