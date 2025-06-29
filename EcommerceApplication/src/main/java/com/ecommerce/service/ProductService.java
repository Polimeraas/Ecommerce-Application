package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> findActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> findByCategory(Category category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }
    
    public List<Product> findByVendor(User vendor) {
        return productRepository.findByUser(vendor);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
}
