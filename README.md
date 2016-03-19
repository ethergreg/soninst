# soninst

### installing
first, flash bbb to /bone-debian-8.3-lxqt-4gb-armhf-2016-01-24-4gb.img
```
apt-get update
apt-get upgrade - required apt-get install chromium
tar xzf nwjs-v0.12.0-linux-arm.tar.gz
ln -s nwjs-v0.12.0-linux-arm nwjs
```

nwjs code at https://github.com/jtg-gg/node-webkit/releases

added to /boot/uEnv.txt
```
cape_enable=bone_capemgr.enable_partno=BB-ADC
```

### running
As debian user:
```
export XAUTHORITY=/home/debian/.Xauthority
export DISPLAY=':0'
./nwjs/nw ./soninst/.
```
### issues
1. there is some sort of memory leak. heap space crash after a few hours
2. os flash appears to have broken the usb interface


### BBB Notes
##### Hide the panel
in /home/debian/.config/lxqt/panel.conf [panel1] set
```
hidable=true
```

in /home/debian/.xessionrc add
```
/mnt/microsd/nwjs/nw /mnt/microsd/soninst/.
```
