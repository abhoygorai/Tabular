import psycopg2
from datetime import datetime
# from fastapi_pagination import Page, paginate


# conn = psycopg2.connect(database = "user_data", 
#                         user = "user_1", 
#                         host= 'localhost',
#                         password = "loginpage",
#                         port = 5432)

# cur = conn.cursor()
# select_query = "SELECT * FROM users;"
# cur.execute(select_query)
# for row in rows:
#     print(row)

# cur.close()
# conn.close()


def connect_to_database():
    try:
        # Establish a connection to PostgreSQL
        conn = psycopg2.connect(
            database="backupdb",
            user="user_1",
            host="localhost",
            password="loginpage",
            port=5432
        )
        print("Connected to database.")
        return conn
    
    except (Exception, psycopg2.Error) as error:
        print("Error connecting to PostgreSQL:", error)
        return None
    
def insert_registration_data(username, password):
    conn = connect_to_database()
    if conn:
        try:
            
            cur = conn.cursor()

            
            insert_query = "INSERT INTO usercred (username, password) VALUES (%s, %s);"

            
            cur.execute(insert_query, (username, password))

            
            conn.commit()

            print("Registration data inserted successfully.")
        
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting data:", error)
        
        finally:
            
            if cur:
                cur.close()
            conn.close()



def fetch_user_data(username):
    conn = connect_to_database()
    if conn:
        try:
            # Create a cursor object
            cur = conn.cursor()

            # Query to fetch user data based on username
            select_query = "SELECT * FROM usercred WHERE username = %s;"
            
            # Execute the SELECT query
            cur.execute(select_query, (username,))
            
            # Fetch all rows (in case there are multiple users with the same username)
            user_data = cur.fetchall()

            if user_data:
                for row in user_data:
                    print("User ID:", row[0])
                    print("Username:", row[1])
                    print("Password:", row[2])
                    print("")

                return user_data[0]
                
            else:
                print("No user found with username:", username)

        except (Exception, psycopg2.Error) as error:
            print("Error while fetching user data:", error)

        finally:
            # Close the cursor and connection
            if cur:
                cur.close()
            conn.close()    

def getMediaData(platform, keyword, fromDate=None, toDate=None, pageNumber=1, pageSize=15):
    # print(pageNumber)
    conn = connect_to_database()
    if conn:
        try:
            # Create a cursor object
            cur = conn.cursor()

            # Base query for counting rows
            count_query = "SELECT COUNT(*) FROM socialmediapost WHERE 1=1"
            
            # Base query for selecting data
            select_query = "SELECT username, post, url, dtposted, platform FROM socialmediapost WHERE 1=1"

            # Platform filter
            if platform in ['Media', 'Twitter', 'Youtube']:
                count_query += f" AND platform = '{platform}'"
                select_query += f" AND platform = '{platform}'"

            # Keyword filter
            if keyword:
                count_query += f" AND keyword = '{keyword}'"
                select_query += f" AND keyword = '{keyword}'"

            # Date range filter
            if fromDate:
                count_query += f" AND dtposted >= '{fromDate}'"
                select_query += f" AND dtposted >= '{fromDate}'"
            if toDate:
                count_query += f" AND dtposted <= '{toDate}'"
                select_query += f" AND dtposted <= '{toDate}'"

            # Calculate OFFSET and add LIMIT and OFFSET to SELECT query
            offset = (pageNumber - 1) * pageSize
            select_query += f" LIMIT {pageSize} OFFSET {offset};"

            # Debug: Print the queries
            print("Count Query:", count_query)
            print("Select Query:", select_query)

            # Execute the COUNT query
            cur.execute(count_query)
            row_count = cur.fetchone()[0]

            # Execute the SELECT query
            cur.execute(select_query)
            data = cur.fetchall()

            if data:
                # print(data)
                return data, row_count
            else:
                print("No data found")
                return [], 0

        except (Exception, psycopg2.Error) as error:
            print("Error while fetching data:", error)
            return [], 0

        finally:
            # Close the cursor and connection
            if cur:
                cur.close()
            conn.close()
