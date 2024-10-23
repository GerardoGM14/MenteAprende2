from mysql.connector import Error
from utils.db_config import create_connection

class GameModel:
    @staticmethod
    def get_all_games():
        try:
            connection = create_connection()
            query = "SELECT * FROM Juegos"
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query)
            games = cursor.fetchall()
            cursor.close()
            connection.close()
            return games
        except Error as e:
            print(f"Error obteniendo juegos: {e}")
            return None
