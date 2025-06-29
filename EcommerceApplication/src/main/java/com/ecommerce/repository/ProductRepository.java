package com.ecommerce.repository;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import com.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByUser(User user);
    List<Product> findByActiveTrue();
    List<Product> findByCategoryAndActiveTrue(Category category);
    List<Product> findByUserAndActiveTrue(User user);
    List<Product> findByNameContainingIgnoreCase(String name);
}
