from cf import *
from func import *
import random,string
from configparser import ConfigParser
inif = '/etc/opt/sp.ini'
ff = ConfigParser()
ff.read(inif)
path_in = '/etc/network/interfaces'
same_in = 'source /etc/network/interfaces.d/*\r\nallow-hotplug eth0\r\nno-auto-down eth0\r\niface eth0 inet dhcp\r\nhwaddress ether {mac}\r\ndns-nameservers 8.8.8.8 8.8.4.4\r\nauto lo\r\niface lo inet loopback\r\n'
def mac():
    myhexdigits = []
    for x in range(3):
        a = random.randint(0,255)
        hex = '%02x' % a
        myhexdigits.append(hex)
    return 'C0-1C-4C-'+'-'.join(myhexdigits).upper()
def gen_string(types,leng:int):
    all1 = '%s%s' % (string.ascii_letters,string.digits)
    all2 = '%s%s' % (all1,string.punctuation)
    if types == 'th':letters = string.ascii_lowercase
    elif types == 'hoa':letters = string.ascii_uppercase
    elif types == 'ht':letters = string.ascii_letters
    elif types == 'so':letters = string.digits
    elif types == 'kt':letters = string.punctuation
    elif types == 'so':letters = string.digits
    elif types == 'all1':letters = all1
    elif types == 'all2':letters = all2
    else:letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(leng))
add = mac()
# save_file(path_in,same_in.format(mac=add))
sting = gen_string('all1',20)
ff['info']['client'] = sting
with open(inif, 'w') as fp:
    ff.write(fp)
print('mac',add,'str',sting)