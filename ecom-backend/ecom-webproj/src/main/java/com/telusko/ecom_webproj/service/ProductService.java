package com.telusko.ecom_webproj.service;


import com.telusko.ecom_webproj.model.Product;
import com.telusko.ecom_webproj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getallproducts(){
        return repo.findAll();
    }

    public Product getproductbyid(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addproduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImagename(imageFile.getOriginalFilename());
        product.setImagetype(imageFile.getContentType());
        product.setImagedate(imageFile.getBytes());
        return repo.save(product);
    }

    public Product updateproduct(int id, Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            // update image
            product.setImagename(imageFile.getOriginalFilename());
            product.setImagetype(imageFile.getContentType());
            product.setImagedate(imageFile.getBytes());

        }
        return repo.save(product);
    }

    public void deleteproduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
