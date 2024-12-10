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

# Configure Chrome options
options = uc.ChromeOptions()
options.add_argument('--log-level=3')  # Suppress console messages

# Initialize the driver with undetected-chromedriver
driver = uc.Chrome(options=options)
sahibinden_arama = "bmw"

try:
    driver.get("https://www.sahibinden.com/")
    sleep(1)

    # Using the new syntax for finding elements
    driver.find_element(By.XPATH, '//*[@id="searchText"]')\
        .send_keys(sahibinden_arama)
    driver.find_element(By.XPATH, '//*[@id="searchSuggestionForm"]/button')\
        .click()
    sleep(3)

    #reject cookies
    driver.find_element(By.XPATH, '//*[@id="onetrust-reject-all-handler"]')\
        .click()
    sleep(1)
    
    driver.find_element(By.XPATH, '//*[@id="wideContainer"]/div/div[2]/ul/li[2]')\
        .click()
    sleep(1)
    
     # Wait for and click the element
    driver.execute_script("arguments[0].click();", 
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="searchResultsSearchForm"]/div/div[3]/div[3]/div[2]/ul/li[2]/a'))
        )
    )
    sleep(1)
    driver.find_element(By.XPATH, '//*[@id="searchResultsTable"]/thead/tr/td[4]/a')\
        .click()
    sleep(3)

    # Initialize empty lists for storing data
    titles_list = []
    prices_list = []
    loca_list = []
    date_list = []
    model_list = []
    year_list = []
    fuel_list = []
    gear_list = []
    kilometers_list = []
    gaurantees_list = []
    damage_list = []
    description_list = []
    all_image_urls = []  # List to store image URLs for all items

    # Initialize a set to keep track of processed URLs to avoid duplicates
    processed_urls = set()
    
    # Loop through the first 50 items (or less if fewer items exist)
    item_index = 0
    while item_index < 10:
        try:
            # Find all title links on the current page
            title_links = driver.find_elements(
                By.XPATH, 
                '//*[@id="searchResultsTable"]/tbody/tr/td[2]/a[1]'
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
            
            # Click the title link specifically
            title_links[item_index].click()
            sleep(3)  # Wait for page to load
            
            # Add the URL to processed set
            processed_urls.add(current_url)

            # Wait for elements to be present on the detail page
            wait = WebDriverWait(driver, 10)

            # Find elements directly from driver
            item_titles = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[1]/h1')
            item_prices = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h3/span')
            item_locations = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[1]')
            item_date = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[2]/span')
            item_models = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[5]/span')
            item_years = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[6]/span')
            item_fuels = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[7]/span')
            item_gear = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[8]/span')
            item_kilometers = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[10]/span')
            item_gaurantees = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[16]/span')
            item_damage = driver.find_elements(By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[16]/span')
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
            model_list.append(item_models[0].text if item_models else '')
            year_list.append(item_years[0].text if item_years else '')
            fuel_list.append(item_fuels[0].text if item_fuels else '')
            gear_list.append(item_gear[0].text if item_gear else '')
            kilometers_list.append(item_kilometers[0].text if item_kilometers else '')
            gaurantees_list.append(item_gaurantees[0].text if item_gaurantees else '')
            damage_list.append(item_damage[0].text if item_damage else '')
            description_list.append(item_description[0].text if item_description else '')

            print(f"Processed item {len(processed_urls)}")
            
            # Go back to the search results page
            driver.back()
            sleep(2)  # Wait for the search results page to load
            
            # Increment only after successful processing
            item_index += 1

        except Exception as e:
            print(f"Error processing item {item_index + 1}: {e}")
            # If there's an error, try to go back to the results page
            try:
                driver.back()
                sleep(2)
            except:
                pass
            item_index += 1
            continue

    # Create DataFrame with all collected data
    df = pd.DataFrame({
        'Title': titles_list,
        'Price': prices_list,
        'Location': loca_list,
        'Date': date_list,
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

    print("\nData collected successfully!")
    print(f"\nTotal items found: {len(titles_list)}")
    print("\nAll collected data:")
    pd.set_option('display.max_rows', None)  # Show all rows
    pd.set_option('display.max_columns', None)  # Show all columns
    pd.set_option('display.width', None)  # Auto-detect display width
    print(df)

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Keep the browser open for inspection
    input("Press Enter to close the browser...")
    driver.quit()

