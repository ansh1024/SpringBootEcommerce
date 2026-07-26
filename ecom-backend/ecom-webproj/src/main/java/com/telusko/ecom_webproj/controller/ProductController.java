package com.telusko.ecom_webproj.controller;

import com.telusko.ecom_webproj.model.Product;
import com.telusko.ecom_webproj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

//    @RequestMapping("/")
//    public String greet(){
//        return "Hello World";
//    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getallproducts(){
        return new ResponseEntity<>(service.getallproducts(), HttpStatus.OK);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getproduct(@PathVariable int id){
        Product product = service.getproductbyid(id);
        if(product != null){
            return new ResponseEntity<>(product,HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/products")
    public ResponseEntity<?>addproduct(@RequestPart Product product,
                                       @RequestPart MultipartFile imageFile){
        try{
            Product product1 = service.addproduct(product,imageFile);
            return new  ResponseEntity<>(product1,HttpStatus.CREATED);
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/products/{productid}/image")
    public ResponseEntity<byte[]>getimagebyid(@PathVariable int productid){
        Product product = service.getproductbyid(productid);
        byte[] imageFile = product.getImagedate();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImagetype()))
                .body(imageFile);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int id,
            @RequestPart Product product,
            @RequestPart(required = false) MultipartFile imageFile) throws IOException {
        Product product1 = service.updateproduct(id,product,imageFile);
        if(product1!=null){
            return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Failed",HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteproduct(@PathVariable int id){
        Product product = service.getproductbyid(id);
        if(product!=null){
            service.deleteproduct(id);
            return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Failed",HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchproducts(@RequestParam String keyword){
        System.out.println("Searching for products with keyword: "+keyword);
        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
