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
from database import store_house_data

# Configure Chrome options
options = uc.ChromeOptions()
options.add_argument('--log-level=3')  # Suppress console messages

# Initialize the driver with undetected-chromedriver
driver = uc.Chrome(options=options)

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
    driver.get("https://www.sahibinden.com/")
    sleep(1)

    # Reject cookies (only needs to be done once)
    try:
        cookie_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, '//*[@id="onetrust-reject-all-handler"]'))
        )
        cookie_button.click()
        sleep(3)
    except Exception as e:
        print(f"Error handling cookies: {e}")

    # Navigate to rental houses
    driver.find_element(By.XPATH, '//*[@id="container"]/div[3]/div/aside/div[1]/nav/ul[5]/li[1]/ul/li[1]/a')\
        .click()
    sleep(3)

    driver.find_element(By.XPATH, '//*[@id="container"]/div[1]/div[1]/div/div[2]/ul/div/div/li[2]/a/h2')\
        .click()
    sleep(3)

    driver.find_element(By.XPATH, '//*[@id="searchCategoryContainer"]/div/div[1]/ul/li[1]/a/h2')\
        .click()
    sleep(3)

    driver.find_element(By.XPATH, '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/a')\
        .click()
    sleep(3)

    driver.find_element(By.XPATH, '//*[@id="searchResultLeft-address"]/dl/dd/ul/li[1]/div/div[3]/div/div[1]/ul/div/ul/li[12]/a')\
        .click()
    sleep(3)

    driver.find_element(By.XPATH, '//*[@id="searchResultsSearchForm"]/div[1]/div[2]/div[27]/button')\
        .click()
    sleep(3)

    # Wait for and click the element
    driver.execute_script("arguments[0].click();",
                          WebDriverWait(driver, 20).until(
                              EC.element_to_be_clickable(
                                  (By.XPATH, '//*[@id="searchResultsSearchForm"]/div/div[3]/div[3]/div[2]/ul/li[2]/a'))
                          )
                          )

    # Wait for the table to load
    sleep(2)

    # Sort by price
    driver.find_element(By.XPATH, '//*[@id="searchResultsTable"]/thead/tr/td[6]/a')\
        .click()
    sleep(3)

    # Process first 5 houses
    processed_count = 0
    while processed_count < 5:
        try:
            # Click on the house listing
            listing = driver.find_elements(
                By.XPATH, '//*[@id="searchResultsTable"]/tbody/tr[position()>0]/td[2]/a[1]')[processed_count]
            listing.click()
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

                images = driver.find_elements(By.CSS_SELECTOR, "img.thmbImg")
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
            titles_list.append(item_titles[0].text if item_titles else '')
            prices_list.append(item_prices[0].text if item_prices else '')
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
            heating_list.append(item_heating[0].text if item_heating else '')
            bathroom_list.append(
                item_bathroom[0].text if item_bathroom else '')
            elevator_list.append(
                item_elevator[0].text if item_elevator else '')
            parking_list.append(item_parking[0].text if item_parking else '')
            furnished_list.append(
                item_furnished[0].text if item_furnished else '')
            description_list.append(
                item_description[0].text if item_description else '')

            print(f"Processed house {processed_count + 1}/5")
            processed_count += 1

            driver.back()
            sleep(2)

        except Exception as e:
            print(f"Error processing house {processed_count + 1}: {e}")
            break

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
    print("\nSummary of collected data:")
    print(df[['Title', 'Price', 'City', 'District', 'Rooms']])

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Keep the browser open for inspection
    input("Press Enter to close the browser...")
    driver.quit()
