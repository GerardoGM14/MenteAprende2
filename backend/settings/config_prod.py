# config_prod.py
from config import Config
class ProdConfig(Config):
    DEBUG = False
    MYSQL_HOST = 'ip-del-servidor-prod'
    MYSQL_USER = 'user_prod'
    MYSQL_PASSWORD = 'password_prod'
    MYSQL_DB = 'app_didactica_db'
