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
sahibinden_arama = "hyundai getz"

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
    
    # Wait for and click the element
    driver.execute_script("arguments[0].click();", 
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="searchResultsSearchForm"]/div/div[3]/div[3]/div[2]/ul/li[2]/a'))
        )
    )
    
    # Wait for the table to load
    sleep(2)
    
    # Wait for elements to be present and get them
    wait = WebDriverWait(driver, 10)
    table = wait.until(EC.presence_of_element_located((By.ID, "searchResultsTable")))
    
    # Find all elements within the table
    item_titles = table.find_elements(By.XPATH, ".//tbody/tr[*]/td[2]")
    item_prices = table.find_elements(By.XPATH, ".//tbody/tr[*]/td[3]")
    item_loca = table.find_elements(By.XPATH, ".//tbody/tr[*]/td[5]")
    item_date = table.find_elements(By.XPATH, ".//tbody/tr[*]/td[4]")

    # Empty lists
    titles_list = []
    prices_list = []
    loca_list = []
    date_list = []

    # Extract text immediately after finding elements
    for title in item_titles:
        titles_list.append(title.text)
    for price in item_prices:
        prices_list.append(price.text)
    for loc in item_loca:
        loca_list.append(loc.text)
    for date in item_date:
        date_list.append(date.text)

    # Create a DataFrame
    df = pd.DataFrame({
        'Title': titles_list,
        'Price': prices_list,
        'Location': loca_list,
        'Date': date_list
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

