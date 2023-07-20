import concat
import Sproxy4g
from Sproxy4g import app as application
from threading import Thread
import sys
sys.dont_write_bytecode = True
if __name__ == '__main__':
    Thread(target=application.run,args=('0.0.0.0', 8000,)).start()