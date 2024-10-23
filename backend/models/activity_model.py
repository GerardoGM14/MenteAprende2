from mysql.connector import Error
from utils.db_config import create_connection

class ActivityModel:
    @staticmethod
    def get_all_activities():
        try:
            connection = create_connection()
            query = "SELECT * FROM Actividades"
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query)
            activities = cursor.fetchall()
            cursor.close()
            connection.close()
            return activities
        except Error as e:
            print(f"Error obteniendo actividades: {e}")
            return None
