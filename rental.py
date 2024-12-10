import undetected_chromedriver as uc
from time import sleep
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from database import store_house_data

# Configure Chrome options
options = uc.ChromeOptions()
options.add_argument('--log-level=3')  # Suppress console messages

# Initialize the driver with undetected-chromedriver
driver = uc.Chrome(options=options)

# Define city XPaths
city_xpaths = [
    '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/div/div[3]/div/div[1]/ul/div/ul/li[12]/a',
    '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/div/div[3]/div/div[1]/ul/div/ul/li[1]/a',
    '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/div/div[3]/div/div[1]/ul/div/ul/li[54]/a'
]

# Initialize empty lists for storing data
titles_list = []
prices_list = []
city_list = []
district_list = []
date_list = []
squareGross_list = []
squareNet_list = []
rooms_list = []
age_list = []
floor_list = []
buildingFloor_list = []
heating_list = []
bathroom_list = []
elevator_list = []
parking_list = []
furnished_list = []
description_list = []
all_image_urls = []

try:
    # Initial navigation (only once)
    driver.get("https://www.sahibinden.com/")
    sleep(2)

    try:
        cookie_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, '//*[@id="onetrust-reject-all-handler"]'))
        )
        cookie_button.click()
        sleep(3)
    except Exception as e:
        print(f"Error handling cookies: {e}")

    # Navigate to rental houses section (only once)
    rental_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="container"]/div[3]/div/aside/div[1]/nav/ul[5]/li[1]/ul/li[1]/a'))
    )
    rental_link.click()
    sleep(3)

    # Click on real estate (only once)
    real_estate = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="container"]/div[1]/div[1]/div/div[2]/ul/div/div/li[2]/a/h2'))
    )
    real_estate.click()
    sleep(3)

    # Click on apartments (only once)
    apartments = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="searchCategoryContainer"]/div/div[1]/ul/li[1]/a/h2'))
    )
    apartments.click()
    sleep(3)

    # First city only - set up initial filters and sorting
    # Click on address bar for first city
    address_bar = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/a'))
    )
    driver.execute_script("arguments[0].click();", address_bar)
    sleep(3)

    # Select the first city
    first_city = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, city_xpaths[0]))
    )
    driver.execute_script("arguments[0].click();", first_city)
    sleep(3)

    # Click search button
    search_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="searchResultsSearchForm"]/div[1]/div[2]/div[27]/button'))
    )
    search_button.click()
    sleep(3)

    # Set up filters and sorting (only once)
    filter_element = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="searchResultsSearchForm"]/div/div[3]/div[3]/div[2]/ul/li[2]/a'))
    )
    driver.execute_script("arguments[0].click();", filter_element)
    sleep(2)

    # Sort by price (only once)
    sort_price = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="searchResultsTable"]/thead/tr/td[6]/a'))
    )
    sort_price.click()
    sleep(3)

    # Process houses for first city
    processed_count = 0
    while processed_count < 5:
        try:
            # Wait for the table and listings to be present
            listings = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH,
                     '//*[@id="searchResultsTable"]/tbody/tr[position()>0]/td[2]/a[1]')
                )
            )

            if processed_count >= len(listings):
                print("No more listings available")
                break

            # Try to click the listing with JavaScript if normal click fails
            listing = listings[processed_count]
            try:
                listing.click()
            except:
                driver.execute_script("arguments[0].click();", listing)
            sleep(3)

            # Find elements directly from driver with dynamic offsets
            item_titles = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[1]/h1')
            item_prices = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h3/span')
            item_city = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[1]')
            item_district = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[2]')
            item_date = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[2]/span')
            item_squareGross = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[4]/span')
            item_squareNet = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[5]/span')
            item_rooms = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[6]/span')
            item_age = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[7]/span')
            item_floor = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[8]/span')
            item_buildingFloor = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[9]/span')
            item_heating = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[10]/span')
            item_bathroom = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[11]/span')
            item_elevator = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[14]/span')
            item_parking = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[15]/span')
            item_furnished = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[16]/span')
            item_description = driver.find_elements(
                By.XPATH, '//*[@id="classifiedDescription"]')

            # Get images
            try:
                wait = WebDriverWait(driver, 10)
                wait.until(EC.visibility_of_element_located(
                    (By.CSS_SELECTOR, "img.thmbImg")))
                sleep(1)

                images = driver.find_elements(
                    By.CSS_SELECTOR, "img.thmbImg")
                image_urls = []

                for img in images:
                    src = img.get_attribute('src')
                    if src and src.startswith('http'):
                        full_size_url = src.replace('thmb_', '')
                        image_urls.append(full_size_url)

                all_image_urls.append(image_urls)

            except Exception as e:
                print(f"Error finding images for item: {e}")
                all_image_urls.append([])

            # Append data to lists
            titles_list.append(
                item_titles[0].text if item_titles else '')
            prices_list.append(
                item_prices[0].text if item_prices else '')
            city_list.append(item_city[0].text if item_city else '')
            district_list.append(
                item_district[0].text if item_district else '')
            date_list.append(item_date[0].text if item_date else '')
            squareGross_list.append(
                item_squareGross[0].text if item_squareGross else '')
            squareNet_list.append(
                item_squareNet[0].text if item_squareNet else '')
            rooms_list.append(item_rooms[0].text if item_rooms else '')
            age_list.append(item_age[0].text if item_age else '')
            floor_list.append(item_floor[0].text if item_floor else '')
            buildingFloor_list.append(
                item_buildingFloor[0].text if item_buildingFloor else '')
            heating_list.append(
                item_heating[0].text if item_heating else '')
            bathroom_list.append(
                item_bathroom[0].text if item_bathroom else '')
            elevator_list.append(
                item_elevator[0].text if item_elevator else '')
            parking_list.append(
                item_parking[0].text if item_parking else '')
            furnished_list.append(
                item_furnished[0].text if item_furnished else '')
            description_list.append(
                item_description[0].text if item_description else '')

            print(f"Processed house {
                  processed_count + 1}/5 in current city")
            processed_count += 1

            driver.back()
            sleep(2)

        except Exception as e:
            print(f"Error processing house {processed_count + 1}: {e}")
            try:
                driver.back()
            except:
                pass
            sleep(2)
            break

    # Now loop through remaining cities
    # Skip first city since we already did it
    for city_xpath in city_xpaths[1:]:
        try:
            print(f"\nProcessing new city...")

            # Click on address bar
            address_bar = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/a'))
            )
            driver.execute_script("arguments[0].click();", address_bar)
            sleep(3)

            # Select the current city
            city_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, city_xpath))
            )
            driver.execute_script("arguments[0].click();", city_element)
            sleep(3)

            # Click search button
            search_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, '//*[@id="searchResultsSearchForm"]/div[1]/div[2]/div[27]/button'))
            )
            search_button.click()
            sleep(3)

            # Process houses for this city
            processed_count = 0
            while processed_count < 5:
                try:
                    # Wait for the table and listings to be present
                    listings = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located(
                            (By.XPATH,
                             '//*[@id="searchResultsTable"]/tbody/tr[position()>0]/td[2]/a[1]')
                        )
                    )

                    if processed_count >= len(listings):
                        print("No more listings available")
                        break

                    # Try to click the listing with JavaScript if normal click fails
                    listing = listings[processed_count]
                    try:
                        listing.click()
                    except:
                        driver.execute_script("arguments[0].click();", listing)
                    sleep(3)

                    # Find elements directly from driver with dynamic offsets
                    item_titles = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[1]/h1')
                    item_prices = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h3/span')
                    item_city = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[1]')
                    item_district = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/h2/a[2]')
                    item_date = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[2]/span')
                    item_squareGross = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[4]/span')
                    item_squareNet = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[5]/span')
                    item_rooms = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[6]/span')
                    item_age = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[7]/span')
                    item_floor = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[8]/span')
                    item_buildingFloor = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[9]/span')
                    item_heating = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[10]/span')
                    item_bathroom = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[11]/span')
                    item_elevator = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[14]/span')
                    item_parking = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[15]/span')
                    item_furnished = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDetail"]/div/div[2]/div[2]/ul/li[16]/span')
                    item_description = driver.find_elements(
                        By.XPATH, '//*[@id="classifiedDescription"]')

                    # Get images
                    try:
                        wait = WebDriverWait(driver, 10)
                        wait.until(EC.visibility_of_element_located(
                            (By.CSS_SELECTOR, "img.thmbImg")))
                        sleep(1)

                        images = driver.find_elements(
                            By.CSS_SELECTOR, "img.thmbImg")
                        image_urls = []

                        for img in images:
                            src = img.get_attribute('src')
                            if src and src.startswith('http'):
                                full_size_url = src.replace('thmb_', '')
                                image_urls.append(full_size_url)

                        all_image_urls.append(image_urls)

                    except Exception as e:
                        print(f"Error finding images for item: {e}")
                        all_image_urls.append([])

                    # Append data to lists
                    titles_list.append(
                        item_titles[0].text if item_titles else '')
                    prices_list.append(
                        item_prices[0].text if item_prices else '')
                    city_list.append(item_city[0].text if item_city else '')
                    district_list.append(
                        item_district[0].text if item_district else '')
                    date_list.append(item_date[0].text if item_date else '')
                    squareGross_list.append(
                        item_squareGross[0].text if item_squareGross else '')
                    squareNet_list.append(
                        item_squareNet[0].text if item_squareNet else '')
                    rooms_list.append(item_rooms[0].text if item_rooms else '')
                    age_list.append(item_age[0].text if item_age else '')
                    floor_list.append(item_floor[0].text if item_floor else '')
                    buildingFloor_list.append(
                        item_buildingFloor[0].text if item_buildingFloor else '')
                    heating_list.append(
                        item_heating[0].text if item_heating else '')
                    bathroom_list.append(
                        item_bathroom[0].text if item_bathroom else '')
                    elevator_list.append(
                        item_elevator[0].text if item_elevator else '')
                    parking_list.append(
                        item_parking[0].text if item_parking else '')
                    furnished_list.append(
                        item_furnished[0].text if item_furnished else '')
                    description_list.append(
                        item_description[0].text if item_description else '')

                    print(f"Processed house {
                          processed_count + 1}/5 in current city")
                    processed_count += 1

                    driver.back()
                    sleep(2)

                except Exception as e:
                    print(f"Error processing house {processed_count + 1}: {e}")
                    try:
                        driver.back()
                    except:
                        pass
                    sleep(2)
                    break

            print(f"Completed processing current city - moving to next city...")
            sleep(2)

        except Exception as e:
            print(f"Error processing city: {e}")
            continue

    # Create DataFrame with all collected data
    df = pd.DataFrame({
        'Title': titles_list,
        'Price': prices_list,
        'City': city_list,
        'District': district_list,
        'Date': date_list,
        'Square_Gross': squareGross_list,
        'Square_Net': squareNet_list,
        'Rooms': rooms_list,
        'Age': age_list,
        'Floor': floor_list,
        'Building_Floor': buildingFloor_list,
        'Heating': heating_list,
        'Bathroom': bathroom_list,
        'Elevator': elevator_list,
        'Parking': parking_list,
        'Furnished': furnished_list,
        'Description': description_list,
        'Image_Urls': all_image_urls
    })

    # Store the data in Supabase
    store_house_data(df)

    print("\nData collected and stored successfully!")
    print(f"\nTotal houses processed: {len(titles_list)}")
    print("\nSummary of collected data by city:")
    print(df.groupby('City').size())

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Keep the browser open for inspection
    input("Press Enter to close the browser...")
    driver.quit()
