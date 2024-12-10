from supabase import create_client
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def clear_car_data():
    """
    Delete all records from the cars table
    """
    try:
        result = supabase.table('cars').delete().neq('id', 0).execute()
        print("Successfully cleared all car data from database")
        return result
    except Exception as e:
        print(f"Error clearing car data: {e}")
        raise e

def store_car_data(df):
    """
    Store car data in Supabase
    """
    try:
        # Clear existing data first
        clear_car_data()
        
        # Convert DataFrame rows to list of dictionaries
        cars_data = []
        for _, row in df.iterrows():
            car_data = {
                'title': row['Title'],
                'price': row['Price'],
                'location': row['Location'],
                'listing_date': row['Date'],
                'brand': row['Brand'],
                'model': row['Model'],
                'year': row['Year'],
                'fuel_type': row['Fuel'],
                'gear_type': row['Gear'],
                'kilometers': row['Kilometers'],
                'guarantee': row['Gaurantees'],
                'damage_status': row['Damage'],
                'description': row['Description'],
                'image_urls': row['Images'],
                'created_at': datetime.now().isoformat()
            }
            cars_data.append(car_data)

        # Insert data into Supabase
        result = supabase.table('cars').insert(cars_data).execute()
        
        print(f"Successfully stored {len(cars_data)} cars in the database")
        return result
    
    except Exception as e:
        print(f"Error storing data in Supabase: {e}")
        raise e 