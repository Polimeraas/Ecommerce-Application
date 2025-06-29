package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    public Cart getOrCreateCart(User user) {
        Optional<Cart> existingCart = cartRepository.findByUser(user);
        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            Cart newCart = new Cart(user);
            newCart.setCartItems(new HashSet<>());
            return cartRepository.save(newCart);
        }
    }
    
    public Cart addToCart(User user, Product product, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        
        // Check if product already exists in cart
        Optional<CartItem> existingItem = cart.getCartItems().stream()
            .filter(item -> item.getProduct().getId().equals(product.getId()))
            .findFirst();
            
        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            // Add new item
            CartItem newItem = new CartItem(cart, product, quantity, product.getPrice());
            cart.getCartItems().add(newItem);
        }
        
        updateCartTotal(cart);
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    public Cart removeFromCart(User user, Long productId) {
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));
        updateCartTotal(cart);
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }
    
    private void updateCartTotal(Cart cart) {
        BigDecimal total = cart.getCartItems().stream()
            .map(CartItem::getSubTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }
}
