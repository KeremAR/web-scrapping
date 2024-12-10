import undetected_chromedriver as uc
from time import sleep
# Data manipulation
import pandas as pd
# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from database import store_car_data
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

# Configure Chrome options
options = uc.ChromeOptions()
options.add_argument('--log-level=3')  # Suppress console messages

# Initialize the driver with undetected-chromedriver
driver = uc.Chrome(options=options)

# Standardize brand names
car_brands = ["BMW", "Mercedes", "Audi", "Ford", "Fiat"]

# Initialize empty lists for storing data outside the brand loop
titles_list = []
prices_list = []
loca_list = []
date_list = []
brand_list = []  # Add brand list
model_list = []
year_list = []
fuel_list = []
gear_list = []
kilometers_list = []
gaurantees_list = []
damage_list = []
description_list = []
all_image_urls = []

try:
    driver.get("https://www.sahibinden.com/")
    sleep(2)

    # Reject cookies (only needs to be done once)
    try:
        cookie_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="onetrust-reject-all-handler"]'))
        )
        cookie_button.click()
        sleep(2)
    except Exception as e:
        print(f"Error handling cookies: {e}")

    # Loop through each brand
    for brand in car_brands:
        try:
            # Navigate to homepage for each new brand
            driver.get("https://www.sahibinden.com/")
            sleep(3)  # Increased sleep time

            # Clear search box and enter new brand
            search_box = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="searchText"]'))
            )
            search_box.clear()
            search_box.send_keys(brand)
            search_box.send_keys(Keys.RETURN)
            sleep(3)
            
            # Click on "Otomobil" category with wait
            car_category = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="wideContainer"]/div/div[2]/ul/li[2]/ul/li[1]/a'))
            )
            car_category.click()
            sleep(3)

            # Wait for and click the element with explicit wait
            filter_element = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="searchResultsSearchForm"]/div[1]/div[3]/div[3]/div[2]/ul/li[2]/a'))
            )
            driver.execute_script("arguments[0].click();", filter_element)
            sleep(3)
            
            # Sort by price with wait
            sort_price = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="searchResultsTable"]/thead/tr/td[9]/a'))
            )
            sort_price.click()
            sleep(3)

            # Initialize set for processed URLs for this brand
            processed_urls = set()
            
            # Loop through the first 5 items for this brand
            item_index = 0
            while item_index < 5:
                try:
                    # Find all title links on the current page
                    title_links = driver.find_elements(
                        By.XPATH, 
                        '//*[@id="searchResultsTable"]/tbody/tr/td[5]/a[1]'
                    )
                    
                    # Skip if we've reached the end of available items
                    if item_index >= len(title_links):
                        break
                        
                    # Get the current item's URL
                    current_url = title_links[item_index].get_attribute('href')
                    
                    # Skip if it's an advertisement or if we've already processed this URL
                    if not current_url or current_url in processed_urls:
                        item_index += 1
                        continue
                    
                    # When clicking on items, use JavaScript click if regular click fails
                    try:
                        title_link = title_links[item_index]
                        try:
                            title_link.click()
                        except:
                            driver.execute_script("arguments[0].click();", title_link)
                        sleep(3)
                    except Exception as e:
                        print(f"Error clicking item: {e}")
                        continue

                    # Add the URL to processed set
                    processed_urls.add(current_url)

                    # Wait for elements to be present on the detail page
                    wait = WebDriverWait(driver, 10)

                    # Find elements directly from driver with dynamic offsets
                    item_titles = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[1]/h1')
                    item_prices = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h3/span')
                    item_locations = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[1]')
                    item_date = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[2]/span')
                    item_brand = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{3}]/span')
                    item_models = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{5}]/span')
                    item_years = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{6}]/span')
                    item_fuels = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{7}]/span')
                    item_gear = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{8}]/span')
                    item_kilometers = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{10}]/span')
                    item_gaurantees = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{16}]/span')
                    item_damage = driver.find_elements(By.XPATH, f'//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[{16}]/span')
                    item_description = driver.find_elements(By.XPATH, '//*[@id="classifiedDescription"]')

                    # Process images
                    try:
                        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "img.thmbImg")))
                        sleep(1)
                        
                        images = driver.find_elements(By.CSS_SELECTOR, "img.thmbImg")
                        image_urls = []
                        
                        for img in images:
                            src = img.get_attribute('src')
                            if src and src.startswith('http'):
                                full_size_url = src.replace('thmb_', '')
                                image_urls.append(full_size_url)
                        
                        all_image_urls.append(image_urls)
                        
                    except Exception as e:
                        print(f"Error finding images for item {item_index + 1}: {e}")
                        all_image_urls.append([])

                    # Append data to lists
                    titles_list.append(item_titles[0].text if item_titles else '')
                    prices_list.append(item_prices[0].text if item_prices else '')
                    loca_list.append(item_locations[0].text if item_locations else '')
                    date_list.append(item_date[0].text if item_date else '')
                    brand_list.append(brand)  # Use the standardized brand name instead of scraped one
                    model_list.append(item_models[0].text if item_models else '')
                    year_list.append(item_years[0].text if item_years else '')
                    fuel_list.append(item_fuels[0].text if item_fuels else '')
                    gear_list.append(item_gear[0].text if item_gear else '')
                    kilometers_list.append(item_kilometers[0].text if item_kilometers else '')
                    gaurantees_list.append(item_gaurantees[0].text if item_gaurantees else '')
                    damage_list.append(item_damage[0].text if item_damage else '')
                    description_list.append(item_description[0].text if item_description else '')

                    print(f"Processed {brand} item {len(processed_urls)}")
                    
                    # Go back to the search results page
                    driver.back()
                    sleep(2)  # Wait for the search results page to load
                    
                    # Increment only after successful processing
                    item_index += 1

                except Exception as e:
                    print(f"Error processing {brand} item {item_index + 1}: {e}")
                    item_index += 1
                    continue

            print(f"Completed processing {brand} - moving to next brand...")
            sleep(2)

        except Exception as e:
            print(f"Error processing brand {brand}: {e}")
            continue

    # Create DataFrame with all collected data
    df = pd.DataFrame({
        'Title': titles_list,
        'Price': prices_list,
        'Location': loca_list,
        'Date': date_list,
        'Brand': brand_list,  # Add brand to DataFrame
        'Model': model_list,
        'Year': year_list,
        'Fuel': fuel_list,
        'Gear': gear_list,
        'Kilometers': kilometers_list,
        'Gaurantees': gaurantees_list,
        'Damage': damage_list,
        'Description': description_list,
        'Images': all_image_urls
    })

    # Store the data in Supabase
    store_car_data(df)

    print("\nData collected and stored successfully!")
    print(f"\nTotal items found: {len(titles_list)}")
    print("\nSummary of cars collected by brand:")
    print(df['Brand'].value_counts())

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    input("Press Enter to close the browser...")
    driver.quit()

