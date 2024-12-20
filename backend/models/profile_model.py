from utils.db_config import create_connection
import pymysql

class ProfileModel:

    @staticmethod
    def get_profile_by_user_id(user_id):
        connection = create_connection()
        try:
            with connection.cursor(pymysql.cursors.DictCursor) as cursor:  # Usa DictCursor aquí
                query = "SELECT * FROM Perfiles WHERE id_usuario = %s"
                cursor.execute(query, (user_id,))
                perfil = cursor.fetchone()
            return perfil
        except Exception as e:
            print(f"Error al obtener el perfil: {e}")
            return None
        finally:
            connection.close()

    @staticmethod
    def update_profile(user_id, data):
        connection = create_connection()
        cursor = connection.cursor()
        query = """
            UPDATE Perfiles 
            SET notificaciones = %s, tema_preferido = %s, nivel_preferido = %s 
            WHERE id_usuario = %s
        """
        try:
            cursor.execute(query, (
                data.get("notificaciones"),
                data.get("tema_preferido"),
                data.get("nivel_preferido"),
                user_id
            ))
            connection.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            connection.close()
            
    @staticmethod
    def create_profile(user_id):
        connection = create_connection()
        try:
            with connection.cursor() as cursor:
                query = """
                INSERT INTO Perfiles (id_usuario, notificaciones, tema_preferido, nivel_preferido)
                VALUES (%s, true, 'default', 1)
                """
                cursor.execute(query, (user_id,))
                connection.commit()  # Asegúrate de que este commit esté presente
        except Exception as e:
            print(f"Error al crear perfil: {e}")
            connection.rollback()
        finally:
            connection.close()
