package com.foodbyte.config;

import com.foodbyte.entity.Product;
import com.foodbyte.entity.Category;
import com.foodbyte.entity.Restaurant;
import com.foodbyte.repository.CategoryRepository;
import com.foodbyte.repository.ProductRepository;
import com.foodbyte.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
        private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        // Images are optional. Use /admin/media/upload to upload and copy a local URL into imageUrl.
        String r1Img = null;
        String r2Img = null;
        String r3Img = null;

        String cat1Img = null;
        String cat2Img = null;
        String cat3Img = null;
        String cat4Img = null;

        // Seed restaurants if missing
        if (restaurantRepository.count() == 0) {
            restaurantRepository.save(Restaurant.builder()
                    .name("Byte Bites")
                    .address("123 Main St")
                    .description("Comfort food and quick bites")
                    .imageUrl(r1Img)
                    .build());

            restaurantRepository.save(Restaurant.builder()
                    .name("Green Bowl")
                    .address("45 Garden Ave")
                    .description("Fresh bowls, salads, and healthy plates")
                    .imageUrl(r2Img)
                    .build());

            restaurantRepository.save(Restaurant.builder()
                    .name("Spice Route")
                    .address("9 Market Rd")
                    .description("Bold flavors, street food inspired")
                    .imageUrl(r3Img)
                    .build());
        }

        // Seed categories if missing
        if (categoryRepository.count() == 0) {
            categoryRepository.save(Category.builder()
                    .name("Burgers")
                    .description("Classic burgers and sandwiches")
                    .imageUrl(cat1Img)
                    .build());

            categoryRepository.save(Category.builder()
                    .name("Sides")
                    .description("Fries, snacks, and small bites")
                    .imageUrl(cat2Img)
                    .build());

            categoryRepository.save(Category.builder()
                    .name("Bowls")
                    .description("Healthy bowls and plates")
                    .imageUrl(cat3Img)
                    .build());

            categoryRepository.save(Category.builder()
                    .name("Drinks")
                    .description("Refreshing drinks")
                    .imageUrl(cat4Img)
                    .build());
        }

        // Seed products if missing (needs at least one restaurant)
        if (productRepository.count() == 0 && restaurantRepository.count() > 0) {
            List<Restaurant> restaurants = restaurantRepository.findAll();
            Restaurant r1 = restaurants.get(0);
            Restaurant r2 = restaurants.size() > 1 ? restaurants.get(1) : r1;
            Restaurant r3 = restaurants.size() > 2 ? restaurants.get(2) : r1;

            Category burgers = categoryRepository.findByName("Burgers")
                    .orElseGet(() -> categoryRepository.save(Category.builder().name("Burgers").description("Classic burgers and sandwiches").imageUrl(cat1Img).build()));
            Category sides = categoryRepository.findByName("Sides")
                    .orElseGet(() -> categoryRepository.save(Category.builder().name("Sides").description("Fries, snacks, and small bites").imageUrl(cat2Img).build()));
            Category bowls = categoryRepository.findByName("Bowls")
                    .orElseGet(() -> categoryRepository.save(Category.builder().name("Bowls").description("Healthy bowls and plates").imageUrl(cat3Img).build()));
            Category drinks = categoryRepository.findByName("Drinks")
                    .orElseGet(() -> categoryRepository.save(Category.builder().name("Drinks").description("Refreshing drinks").imageUrl(cat4Img).build()));

            List<Product> products = List.of(
                    Product.builder()
                            .name("Classic Burger")
                            .description("Juicy patty, lettuce, tomato, house sauce")
                            .imageUrl(cat1Img)
                            .price(8.99)
                            .available(true)
                            .popularity(30)
                            .restaurant(r1)
                            .category(burgers)
                            .build(),
                    Product.builder()
                            .name("Crispy Fries")
                            .description("Golden fries with a pinch of salt")
                            .imageUrl(cat2Img)
                            .price(3.49)
                            .available(true)
                            .popularity(22)
                            .restaurant(r1)
                            .category(sides)
                            .build(),
                    Product.builder()
                            .name("Chicken Wrap")
                            .description("Grilled chicken, crunchy veggies, garlic mayo")
                            .imageUrl(null)
                            .price(6.99)
                            .available(true)
                            .popularity(18)
                            .restaurant(r1)
                            .category(burgers)
                            .build(),

                    Product.builder()
                            .name("Avocado Bowl")
                            .description("Brown rice, avocado, beans, pico de gallo")
                            .imageUrl(null)
                            .price(9.49)
                            .available(true)
                            .popularity(25)
                            .restaurant(r2)
                            .category(bowls)
                            .build(),
                    Product.builder()
                            .name("Greek Salad")
                            .description("Feta, olives, cucumber, tomato, oregano")
                            .imageUrl(null)
                            .price(7.99)
                            .available(true)
                            .popularity(14)
                            .restaurant(r2)
                            .category(bowls)
                            .build(),
                    Product.builder()
                            .name("Protein Plate")
                            .description("Chicken, quinoa, greens, lemon dressing")
                            .imageUrl(null)
                            .price(10.99)
                            .available(true)
                            .popularity(12)
                            .restaurant(r2)
                            .category(bowls)
                            .build(),

                    Product.builder()
                            .name("Spicy Noodles")
                            .description("Chili, garlic, veggies, sesame")
                            .imageUrl(null)
                            .price(8.49)
                            .available(true)
                            .popularity(28)
                            .restaurant(r3)
                            .category(bowls)
                            .build(),
                    Product.builder()
                            .name("Street Tacos")
                            .description("Three tacos with salsa and lime")
                            .imageUrl(null)
                            .price(7.49)
                            .available(true)
                            .popularity(20)
                            .restaurant(r3)
                            .category(sides)
                            .build(),
                    Product.builder()
                            .name("Mango Lassi")
                            .description("Sweet mango yogurt drink")
                            .imageUrl(cat4Img)
                            .price(2.99)
                            .available(true)
                            .popularity(16)
                            .restaurant(r3)
                            .category(drinks)
                            .build()
            );

            productRepository.saveAll(products);
        }
    }
}
