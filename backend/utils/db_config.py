import mysql.connector
import pymysql
from settings.config import Config

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB
        )
        return pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='app_didactica_db',
        cursorclass=pymysql.cursors.DictCursor  # DictCursor aquí es importante
    )
    except mysql.connector.Error as e:
        print(f"Error conectando a la base de datos: {e}")
        return None


# Verificar conexión
if __name__ == '__main__':
    create_connection()
