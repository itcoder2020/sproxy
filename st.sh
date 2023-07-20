#!/bin/bash
cd /home/Sproxy/hilink/
python3 st.py
rm -f st.py
set="abcdef0123456789"
n=2
rand=""
for i in `seq 1 $n`; do
    char=${set:$RANDOM % ${#set}:1}
    rand+=$char
done
sed -i "s/a2/${rand}/g" /etc/network/interfaces
systemctl enable Sproxy4g
systemctl start Sproxy4g
history -c